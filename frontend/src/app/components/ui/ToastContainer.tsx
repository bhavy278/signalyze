import { Toast, ToastContainerProps } from "@/types/toast.types";
import ToastMessage from "./ToastMessage";

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  const positions: { [key in Toast["position"]]: string } = {
    "top-left": "top-5 left-5",
    "top-right": "top-5 right-5",
    "top-center": "top-5 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-5 left-5",
    "bottom-right": "bottom-5 right-5",
    "bottom-center": "bottom-5 left-1/2 -translate-x-1/2",
  };

  return (
    <>
      {Object.keys(positions).map((position) => {
        const posKey = position as keyof typeof positions;
        return (
          <div
            key={position}
            className={`fixed ${positions[posKey]} z-50 flex flex-col gap-2`}
          >
            {toasts
              .filter((toast) => toast.position === posKey)
              .map((toast) => (
                <ToastMessage
                  key={toast.id}
                  toast={toast}
                  onClose={() => removeToast(toast.id)}
                />
              ))}
          </div>
        );
      })}
    </>
  );
};

export default ToastContainer;
