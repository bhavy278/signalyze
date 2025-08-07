import { SelectProps } from "@/types/ui.types";
import { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

export const Select = ({
  options,
  onSelect,
  value,
  placeholder = "Select an option...",
  className = "",
  disabled = false,
}: SelectProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
            appearance-none w-full bg-light-100 border border-gray-200 text-dark py-2 px-4 pr-8
            rounded-lg leading-tight focus:outline-none focus:bg-white 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50
            transition-all duration-200
            ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={20} />
      </div>
    </div>
  );
};
