export interface SelectOption {
  value: string | number;
  label: string;
}

// Define the props for the Select component
export interface SelectProps {
  options: SelectOption[];
  onSelect: (value: string | number) => void;
  value?: string | number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}
