/** Shared Canvas props: context-loss handling + renderer cleanup */
export const webglCanvasProps = {
  frameloop: "demand",
  dpr: [1, 2],
  gl: {
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
    antialias: true,
    alpha: true,
  },
  onCreated: ({ gl }) => {
    const canvas = gl.domElement;

    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn("WebGL context lost – attempting recovery.");
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      if (!gl.getContext()?.isContextLost()) {
        gl.dispose();
      }
    };
  },
};

/** For canvases that need continuous animation (e.g. Stars) */
export const animatedWebglCanvasProps = {
  ...webglCanvasProps,
  frameloop: "always",
};
