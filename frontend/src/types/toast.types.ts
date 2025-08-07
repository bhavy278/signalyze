import { createContext } from "react";

export interface Toast {
  id: number;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

export interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
  toasts: Toast[];
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

export interface ToastMessageProps {
  toast: Toast;
  onClose: () => void;
}
