import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "font-semibold w-full text-center rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const variantStyles = {
    // Corrected: Set text color to light-200 (white) for the primary button
    primary: "bg-blue-700 text-white hover:bg-blue-700",
    secondary: "bg-gray-800 text-light-100 hover:bg-gray-900",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
