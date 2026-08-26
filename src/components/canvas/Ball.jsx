import React, { Suspense, Component, memo, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";
import { createInitialsIcon } from "../../utils/techIconMap";
import { webglCanvasProps } from "../../utils/webglCanvasProps";

const COLS = 7;
const SPACING = 2.75;

/** Texture yüklemeden düz renkli küre – hata durumunda güvenli yedek */
const FallbackBall = ({ position = [0, 0, 0] }) => (
  <group position={position}>
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#915EFF" flatShading />
      </mesh>
    </Float>
  </group>
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
    if (this.state.hasError) {
      return <FallbackBall position={this.props.position} />;
    }
    return this.props.children;
  }
}

const BallMesh = ({ imgUrl, position = [0, 0, 0] }) => {
  const [decal] = useTexture([imgUrl], (loader) => {
    loader.crossOrigin = "anonymous";
  });

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
};

const TechBall = memo(({ imgUrl, name, position }) => {
  const fallbackUrl = useMemo(
    () => createInitialsIcon(name || "?"),
    [name]
  );
  const textureUrl = imgUrl || fallbackUrl;

  return (
    <BallErrorBoundary position={position}>
      <BallMesh imgUrl={textureUrl} position={position} />
    </BallErrorBoundary>
  );
});

TechBall.displayName = "TechBall";

const computeBallPosition = (index, total) => {
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  const itemsInRow = Math.min(COLS, total - row * COLS);
  const x = (col - (itemsInRow - 1) / 2) * SPACING;
  const y = -row * SPACING;
  return [x, y, 0];
};

/**
 * All skill balls share ONE WebGL context to avoid browser context limits.
 */
export const TechBallsCanvas = memo(({ skills }) => {
  const rows = Math.max(1, Math.ceil(skills.length / COLS));
  const canvasHeight = rows * 112;

  if (!skills.length) return null;

  return (
    <div className="w-full" style={{ height: canvasHeight }}>
      <Canvas
        {...webglCanvasProps}
        orthographic
        camera={{ zoom: 45, position: [0, 0, 10], near: 0.1, far: 100 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[0, 0, 5]} />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          {skills.map((skill, index) => (
            <TechBall
              key={skill.id}
              imgUrl={skill.icon}
              name={skill.name}
              position={computeBallPosition(index, skills.length)}
            />
          ))}
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
});

TechBallsCanvas.displayName = "TechBallsCanvas";

/** @deprecated Use TechBallsCanvas for multiple balls – each instance creates a WebGL context. */
const BallCanvas = memo(({ icon, name = "" }) => {
  const fallbackUrl = useMemo(
    () => createInitialsIcon(name || "?"),
    [name]
  );

  return (
    <Canvas {...webglCanvasProps}>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <BallErrorBoundary position={[0, 0, 0]}>
          <BallMesh imgUrl={icon || fallbackUrl} />
        </BallErrorBoundary>
      </Suspense>
      <Preload all />
    </Canvas>
  );
});

BallCanvas.displayName = "BallCanvas";

export default BallCanvas;
