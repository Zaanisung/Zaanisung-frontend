import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { subscribeToasts } from "../utils/toast";
import type { ToastMessage } from "../utils/toast";

const AUTO_DISMISS_MS = 5000;

/**
 * Renders transient, non-blocking notifications emitted via showErrorToast().
 * Uses sticky positioning so it floats above every app surface.
 */
export const ToastHost: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return subscribeToasts((toast) => {
      setToasts((prev) => [...prev.slice(-2), toast]);
    });
  }, []);

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[120] flex w-full max-w-sm flex-col gap-2 px-4"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastMessage; onDismiss: (id: number) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isError = toast.kind === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-xs font-medium shadow-lift ${
        isError
          ? "bg-red-950/90 border-red-700 text-red-100"
          : "bg-emerald-950/90 border-emerald-700 text-emerald-100"
      }`}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
      ) : (
        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
      )}
      <span className="flex-1">{toast.text}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};