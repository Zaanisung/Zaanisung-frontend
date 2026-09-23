/**
 * Tiny, dependency-free app-wide notification bus used for non-blocking
 * feedback on async admin actions. Prefers an inline error banner in the page
 * itself; this exists for the handful of handlers that don't own one.
 */

export type ToastKind = "success" | "error";

export interface ToastMessage {
  id: number;
  kind: ToastKind;
  text: string;
}

type ToastListener = (toast: ToastMessage) => void;

class ToastBus {
  private listeners = new Set<ToastListener>();
  private nextId = 1;

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(kind: ToastKind, text: string): void {
    const toast: ToastMessage = { id: this.nextId++, kind, text };
    this.listeners.forEach((listener) => listener(toast));
  }
}

const bus = new ToastBus();

/** Show a transient error toast. */
export const showErrorToast = (text: string): void => bus.emit("error", text);

/** Subscribe to toasts (used by <ToastHost />). */
export const subscribeToasts = (listener: ToastListener): (() => void) =>
  bus.subscribe(listener);