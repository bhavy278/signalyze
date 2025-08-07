"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, File, X } from "lucide-react";

interface StyledFileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedFileTypes?: string;
  disabled?: boolean;
}

export const StyledFileUpload = ({
  onFileSelect,
  acceptedFileTypes = ".pdf,.docx,.txt",
  disabled = false,
}: StyledFileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const selectedFile = e.target.files && e.target.files[0];
    setFile(selectedFile || null);
    onFileSelect(selectedFile || null);
  };

  const handleRemoveFile = () => {
    if (disabled) return;
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0];
    setFile(droppedFile || null);
    onFileSelect(droppedFile || null);
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes}
        disabled={disabled}
      />

      {!file ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            ${
              isDragging && !disabled
                ? "border-blue-600 bg-blue-600/10"
                : "border-gray-200"
            }
            ${
              disabled
                ? "bg-gray-100 opacity-60 cursor-not-allowed"
                : "bg-light-100 hover:border-gray-300 hover:bg-light-0 cursor-pointer"
            }
          `}
        >
          <div className="flex flex-col items-center justify-center text-gray-500">
            <UploadCloud
              size={48}
              className={`mb-4 transition-colors ${
                isDragging && !disabled ? "text-blue-600" : "text-gray-400"
              }`}
            />
            <p className="font-semibold text-gray-700">
              <span className="text-blue-600">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-sm mt-1">PDF, DOCX, or TXT</p>
          </div>
        </div>
      ) : (
        <div className="bg-light-100 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <File size={32} className="text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-dark truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Remove file"
            disabled={disabled}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
