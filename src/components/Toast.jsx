import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export const Toast = ({ id, message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-600" size={17} />,
    error: <XCircle className="text-red-500" size={17} />,
    info: <AlertCircle className="text-gold-600" size={17} />
  };

  const bgColors = {
    success: "bg-white/96 backdrop-blur-lg border-emerald-500/25 shadow-[0_12px_32px_rgba(16,185,129,0.06)]",
    error: "bg-white/96 backdrop-blur-lg border-red-500/25 shadow-[0_12px_32px_rgba(239,68,68,0.06)]",
    info: "bg-white/96 backdrop-blur-lg border-gold-300/30 shadow-[0_12px_32px_rgba(176,141,69,0.08)]"
  };

  const progressColors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-gold-500"
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border relative overflow-hidden ${bgColors[type]} max-w-sm w-80 animate-toast-pop font-sans`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-[13px] font-semibold text-ink-900 leading-tight">
          {message}
        </p>
      </div>
      <button onClick={() => onClose(id)} className="text-ink-400 hover:text-ink-900 transition-colors pl-2 z-10 cursor-pointer">
        <X size={14} />
      </button>

      {/* Countdown progress bar countdown visual */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${progressColors[type]} origin-left animate-toast-progress`} />
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-3 pointer-events-none max-w-[90%] w-80">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};
