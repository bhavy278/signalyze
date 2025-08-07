import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, type = "text", className, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-500">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          type={type}
          className={`
            mt-1 block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm 
            bg-light-100 text-dark
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
