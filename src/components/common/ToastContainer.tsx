import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />;
        let border = 'border-emerald-200';
        if (toast.type === 'error') {
          icon = <AlertCircle size={16} className="text-red-700 shrink-0 mt-0.5" />;
          border = 'border-red-200';
        } else if (toast.type === 'info') {
          icon = <Info size={16} className="text-[#B69A59] shrink-0 mt-0.5" />;
          border = 'border-[#E4DED3]';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto bg-[#FFFFFF] border ${border} shadow-lg rounded-sm p-4 flex items-start gap-3 transition-all transform animate-in slide-in-from-bottom-2`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#171512] tracking-wide">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-[#716C64] mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#716C64] hover:text-[#171512] p-1 cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
