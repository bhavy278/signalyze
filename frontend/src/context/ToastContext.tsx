"use client";
import ToastContainer from "@/app/components/ui/ToastContainer";
import {
  Toast,
  ToastContextType,
  ToastProviderProps,
} from "@/types/toast.types";
import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  }, []);
  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = toastId++;
      setToasts((currentToasts) => [...currentToasts, { ...toast, id }]);
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
