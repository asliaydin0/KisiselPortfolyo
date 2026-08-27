import React, { Suspense, memo, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { webglCanvasProps } from "../../utils/webglCanvasProps";

useGLTF.preload("./desktop_pc/scene.gltf");

const Computers = memo(({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? 512 : 1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.65 : 0.7}
        position={isMobile ? [0, -2.8, -2.2] : [0, -3.05, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
});

Computers.displayName = "Computers";

const ComputersCanvas = memo(({ frameloop = "always" }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      {...webglCanvasProps}
      frameloop={frameloop}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      shadows={!isMobile}
      camera={{ position: [20, 3, 5], fov: 25 }}
      className="!absolute !inset-0 !w-full !h-full"
      style={{ background: "transparent" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate={!isMobile}
          autoRotateSpeed={0.8}
          enableRotate={!isMobile}
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
});

ComputersCanvas.displayName = "ComputersCanvas";

export default ComputersCanvas;
