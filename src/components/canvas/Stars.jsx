import { useState, useRef, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

import { animatedWebglCanvasProps } from "../../utils/webglCanvasProps";

const STAR_COUNT = 5000;

const createStarPositions = () => {
  const positions = random.inSphere(
    new Float32Array(STAR_COUNT * 3),
    { radius: 1.2 }
  );

  for (let i = 0; i < positions.length; i++) {
    if (!Number.isFinite(positions[i])) positions[i] = 0;
  }

  return positions;
};

const Stars = memo((props) => {
  const ref = useRef();
  const [sphere] = useState(createStarPositions);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
});

Stars.displayName = "Stars";

const StarsCanvas = memo(() => {
  return (
    <div className="w-full h-auto absolute inset-0 z-[-1]">
      <Canvas {...animatedWebglCanvasProps} camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
});

StarsCanvas.displayName = "StarsCanvas";

export default StarsCanvas;
