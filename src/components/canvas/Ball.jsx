import React, { Suspense, Component, memo, useMemo, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";
import { createInitialsIcon } from "../../utils/techIconMap";
import { webglCanvasProps } from "../../utils/webglCanvasProps";

const CELL = 112;
const GAP = 40;
const WORLD_SCALE = 2.75 / CELL;

export const isWebGLSafeIcon = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("data:image/png")) return true;
  if (url.startsWith("data:image/svg")) return false;
  if (url.startsWith("http") && url.includes(".svg")) return false;
  if (url.startsWith("http")) return false;
  return url.includes(".png") || url.includes("/assets/");
};

export const resolveIconFor3D = (name, icon) => {
  if (isWebGLSafeIcon(icon)) return icon;
  return createInitialsIcon(name || "?");
};

const getCols = (width) => {
  if (width >= 1024) return 7;
  if (width >= 768) return 5;
  if (width >= 480) return 4;
  return 3;
};

const computeLayout = (count, containerWidth) => {
  const cols = getCols(containerWidth);
  const rows = Math.max(1, Math.ceil(count / cols));
  const canvasHeight = rows * CELL + Math.max(0, rows - 1) * GAP;

  const positions = Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const itemsInRow = Math.min(cols, count - row * cols);
    const rowWidth = itemsInRow * CELL + Math.max(0, itemsInRow - 1) * GAP;
    const offsetX = (containerWidth - rowWidth) / 2;
    const px = offsetX + col * (CELL + GAP) + CELL / 2;
    const py = row * (CELL + GAP) + CELL / 2;
    const x = (px - containerWidth / 2) * WORLD_SCALE;
    const y = -(py - canvasHeight / 2) * WORLD_SCALE;
    return [x, y, 0];
  });

  const gridHeightWorld = canvasHeight * WORLD_SCALE;
  const zoom = Math.max(20, (canvasHeight / gridHeightWorld) * 18);

  return { cols, rows, canvasHeight, positions, zoom };
};

const FallbackBall = () => (
  <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
    <mesh scale={2.75}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#915EFF" flatShading />
    </mesh>
  </Float>
);

class BallErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <FallbackBall />;
    return this.props.children;
  }
}

const BallMesh = memo(({ imgUrl, position }) => {
  const [decal] = useTexture([imgUrl]);

  return (
    <group position={position}>
      <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
        <mesh castShadow receiveShadow scale={2.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#fff8eb"
            polygonOffset
            polygonOffsetFactor={-5}
            flatShading
          />
          <Decal
            position={[0, 0, 1]}
            rotation={[2 * Math.PI, 0, 6.25]}
            scale={1}
            map={decal}
            flatShading
          />
        </mesh>
      </Float>
    </group>
  );
});

BallMesh.displayName = "BallMesh";

const TechBall = memo(({ imgUrl, name, position }) => {
  const textureUrl = useMemo(
    () => resolveIconFor3D(name, imgUrl),
    [name, imgUrl]
  );

  return (
    <BallErrorBoundary>
      <BallMesh imgUrl={textureUrl} position={position} />
    </BallErrorBoundary>
  );
});

TechBall.displayName = "TechBall";

/** Tüm yetenek topları tek WebGL context kullanır – grid layout korunur */
export const TechBallsCanvas = memo(({ skills }) => {
  const containerRef = useRef(null);
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !skills.length) return;

    const update = () => {
      const width = el.offsetWidth || el.getBoundingClientRect().width;
      if (width > 0) {
        setLayout(computeLayout(skills.length, width));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [skills.length]);

  if (!skills.length) return null;

  const height = layout?.canvasHeight ?? Math.ceil(skills.length / 4) * (CELL + GAP);

  return (
    <div ref={containerRef} className="w-full" style={{ height }}>
      {layout && (
        <Canvas
          {...webglCanvasProps}
          dpr={[1, 1.5]}
          orthographic
          camera={{
            zoom: layout.zoom,
            position: [0, 0, 10],
            near: 0.1,
            far: 100,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <ambientLight intensity={0.25} />
            <directionalLight position={[0, 0, 5]} />
            {skills.map((skill, index) => (
              <TechBall
                key={skill.id}
                imgUrl={skill.icon}
                name={skill.name}
                position={layout.positions[index]}
              />
            ))}
          </Suspense>
          <Preload all />
        </Canvas>
      )}
    </div>
  );
});

TechBallsCanvas.displayName = "TechBallsCanvas";

const BallCanvas = memo(({ icon, name = "" }) => {
  const textureUrl = useMemo(
    () => resolveIconFor3D(name, icon),
    [name, icon]
  );

  return (
    <Canvas {...webglCanvasProps} dpr={[1, 1.5]} style={{ width: "100%", height: "100%" }}>
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[0, 0, 0.05]} />
        <BallErrorBoundary>
          <BallMesh imgUrl={textureUrl} position={[0, 0, 0]} />
        </BallErrorBoundary>
      </Suspense>
      <Preload all />
    </Canvas>
  );
});

BallCanvas.displayName = "BallCanvas";

export default BallCanvas;
