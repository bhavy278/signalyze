"use client";

import { FileText, FileCode } from "lucide-react";

interface FileIconProps {
  filetype: string;
}

export const FileIcon = ({ filetype }: FileIconProps) => {
  switch (filetype) {
    case "application/pdf":
      // Icon for PDF files
      return <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      // Icon for DOCX files
      return <FileCode className="h-8 w-8 text-blue-500 flex-shrink-0" />;
    default:
      // Default icon for any other file type
      return <FileText className="h-8 w-8 text-gray-400 flex-shrink-0" />;
  }
};
