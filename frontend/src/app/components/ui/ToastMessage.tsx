import { Toast, ToastMessageProps } from "@/types/toast.types";

const ToastMessage = ({ toast, onClose }: ToastMessageProps) => {
  const severityStyles: { [key in Toast["severity"]]: string } = {
    success: "bg-green-500 text-green-950",
    error: "bg-red-500 text-red-950",
    warning: "bg-yellow-500 text-yellow-950",
    info: "bg-indigo-500 text-indigo-950",
  };

  return (
    <>
      <div
        className={`
        ${severityStyles[toast.severity]} 
        text-white font-medium rounded-lg shadow-lg 
        flex items-center justify-between 
        py-3 px-4 max-w-sm animate-fade-in-down
      `}
      >
        <span>{toast.message}</span>
        {/* The cross icon button for manual removal */}
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-full hover:bg-white/20 focus:outline-none transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default ToastMessage;
