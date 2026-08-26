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

/** WebGL Decal yalnızca PNG / yerel asset ile güvenli çalışır; SVG & CDN hata verir */
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

const FallbackBall = () => (
  <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
    <mesh castShadow receiveShadow scale={2.75}>
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

const BallMesh = memo(({ imgUrl }) => {
  const [decal] = useTexture([imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
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
  );
});

BallMesh.displayName = "BallMesh";

const BallScene = memo(({ imgUrl, name }) => {
  const textureUrl = useMemo(
    () => resolveIconFor3D(name, imgUrl),
    [name, imgUrl]
  );

  return (
    <BallErrorBoundary>
      <Suspense fallback={null}>
        <BallMesh imgUrl={textureUrl} />
      </Suspense>
    </BallErrorBoundary>
  );
});

BallScene.displayName = "BallScene";

const BallCanvas = memo(({ icon, name = "" }) => (
  <Canvas
    {...webglCanvasProps}
    dpr={[1, 1.5]}
    style={{ width: "100%", height: "100%" }}
  >
    <OrbitControls enableZoom={false} enablePan={false} />
    <BallScene imgUrl={icon} name={name} />
    <Preload all />
  </Canvas>
));

BallCanvas.displayName = "BallCanvas";

export default BallCanvas;
