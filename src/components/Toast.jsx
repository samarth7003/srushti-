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
    success: <CheckCircle className="text-emerald-500" size={18} />,
    error: <XCircle className="text-red-500" size={18} />,
    info: <AlertCircle className="text-gold-500" size={18} />
  };

  const bgColors = {
    success: "bg-white dark:bg-stone-900 border-emerald-500/20",
    error: "bg-white dark:bg-stone-900 border-red-500/20",
    info: "bg-white dark:bg-stone-900 border-gold-500/20"
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border shadow-xl ${bgColors[type]} max-w-sm w-80 animate-fade-in font-sans`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-sm font-medium text-luxury-black dark:text-stone-200">
          {message}
        </p>
      </div>
      <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors pl-2">
        <X size={14} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
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
