import React from "react";

const SectionLoader = ({ label = "Yükleniyor..." }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-white/10" />
      <div className="absolute inset-0 rounded-full border-t-2 border-[#915EFF] animate-spin" />
    </div>
    <p className="text-secondary text-sm tracking-wider animate-pulse">{label}</p>
  </div>
);

export default SectionLoader;
