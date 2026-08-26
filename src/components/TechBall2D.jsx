import { memo } from "react";

const TechBall2D = memo(({ icon, name }) => (
  <div
    className="w-28 h-28 flex items-center justify-center"
    title={name}
  >
    <div className="relative w-[88px] h-[88px] animate-tech-float">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fff8eb] via-[#f5ead6] to-[#dcc9a8] shadow-[0_12px_28px_rgba(0,0,0,0.35)]" />
      <div className="absolute inset-[3px] rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
      <img
        src={icon}
        alt={name || "skill"}
        className="absolute inset-0 m-auto w-11 h-11 object-contain drop-shadow-sm"
        loading="lazy"
        draggable={false}
      />
    </div>
  </div>
));

TechBall2D.displayName = "TechBall2D";

export default TechBall2D;
