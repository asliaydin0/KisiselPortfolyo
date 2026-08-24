import React from "react";

const DataFetchError = ({ message, onRetry }) => (
  <div className="mt-20 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-4">
    <p className="text-red-200 text-sm leading-relaxed">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl font-medium bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200 text-sm"
      >
        Tekrar Dene
      </button>
    )}
  </div>
);

export default DataFetchError;
