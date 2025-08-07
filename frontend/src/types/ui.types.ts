export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  onSelect: (value: string | number) => void;
  value?: string | number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}
