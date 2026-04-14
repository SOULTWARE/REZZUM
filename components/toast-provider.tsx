"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ActionResult, ActionResultStatus } from "@/lib/actions";

type Toast = ActionResult & {
  id: number;
};

type ToastContextValue = {
  pushToast: (toast: ActionResult) => void;
  dismissToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function getToastStyles(status: ActionResultStatus) {
  if (status === "success") {
    return {
      card: "border-[rgb(0_83_218_/_0.12)] bg-white text-[var(--foreground)]",
      badge: "bg-[var(--primary-soft)] text-[var(--primary-strong)]",
    };
  }

  if (status === "warning") {
    return {
      card: "border-[rgb(181_125_20_/_0.18)] bg-[rgb(255_250_240)] text-[rgb(108_79_10)]",
      badge: "bg-[rgb(245_230_188)] text-[rgb(108_79_10)]",
    };
  }

  return {
    card: "border-[rgb(159_64_61_/_0.18)] bg-[rgb(255_245_245)] text-[rgb(117_33_33)]",
    badge: "bg-[rgb(243_221_220)] text-[rgb(117_33_33)]",
  };
}

function getToastLabel(status: ActionResultStatus) {
  if (status === "success") {
    return "Success";
  }

  if (status === "warning") {
    return "Warning";
  }

  return "Error";
}

export function ToastProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((toast: ActionResult) => {
    const id = nextIdRef.current++;

    setToasts((current) => [...current, { ...toast, id }]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(
        () => dismissToast(toast.id),
        toast.status === "success" ? 4200 : 6800,
      ),
    );

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [dismissToast, toasts]);

  const value = useMemo(
    () => ({
      pushToast,
      dismissToast,
    }),
    [dismissToast, pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:px-6">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.status);

          return (
            <div key={toast.id} className="pointer-events-auto flex justify-end">
              <div
                role="status"
                aria-live="polite"
                className={`w-full max-w-md rounded-2xl border px-4 py-4 shadow-[0_20px_40px_rgb(42_52_57_/_0.12)] backdrop-blur ${styles.card}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${styles.badge}`}
                  >
                    {getToastLabel(toast.status)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-6">{toast.message}</p>
                    {toast.detail ? (
                      <p className="mt-1 text-sm leading-6 opacity-85">{toast.detail}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    aria-label="Dismiss notification"
                    className="rounded-full px-2 py-1 text-xs font-semibold opacity-70 hover:opacity-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
