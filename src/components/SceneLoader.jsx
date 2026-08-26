/** Plain HTML loader – safe to use OUTSIDE <Canvas> (e.g. React.lazy Suspense) */
const SceneLoader = ({ label = "Yükleniyor..." }) => (
  <div className="flex justify-center items-center w-full h-full min-h-[200px]">
    <div className="flex flex-col items-center gap-4">
      <span className="canvas-loader" />
      <p className="text-secondary text-sm font-medium">{label}</p>
    </div>
  </div>
);

export default SceneLoader;
