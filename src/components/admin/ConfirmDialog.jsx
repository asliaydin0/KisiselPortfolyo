import React from "react";
import { adminBtnDanger, adminBtnSecondary } from "../../utils/adminStyles";

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#151030] border border-white/10 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-[#dfd9ff]/80 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={adminBtnSecondary}
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={adminBtnDanger}
          >
            {loading ? "Siliniyor..." : "Sil"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
