import React from "react";
import { Loader2 } from "lucide-react";
import "./ui.css";
interface LoadingButtonProps {
  txt: string;
}
const LoadingButton = ({ txt }: LoadingButtonProps) => {
  return (
    <>
      <span className="flex align-center justify-center loader">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> <label>{txt}</label>
      </span>
    </>
  );
};
export default LoadingButton;
