"use client";

import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { getPreviewBlob } from "@/services/document.service";

interface DocumentPreviewerProps {
  documentId: string;
  filetype: string;
}

export const DocumentPreviewer = ({
  documentId,
  filetype,
}: DocumentPreviewerProps) => {
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const { addToast } = useToast();

  // Effect 1: Fetch the file data
  useEffect(() => {
    if (!documentId) return;

    const loadFile = async () => {
      setIsLoading(true);
      setError(null);
      setFileBlob(null);

      try {
        const blob = await getPreviewBlob(documentId);
        setFileBlob(blob);
      } catch (err: unknown) {
        // Use 'unknown' instead of 'any'
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        addToast({
          message: errorMessage,
          severity: "error",
          position: "top-right",
        });
        setIsLoading(false);
      }
    };

    loadFile();
  }, [documentId, addToast]);

  // Effect 2: Render the file data once it's available
  useEffect(() => {
    if (!fileBlob) return;

    const containerElement = previewContainerRef.current;

    const renderFile = async () => {
      try {
        if (
          filetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          if (containerElement) {
            await renderAsync(fileBlob, containerElement);
          }
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        addToast({
          message: errorMessage,
          severity: "error",
          position: "top-right",
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    renderFile();
  }, [fileBlob, filetype, addToast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-200">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-3 text-gray-600">Loading Preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 font-semibold">
        {error}
      </div>
    );
  }

  if (filetype === "application/pdf" || filetype.startsWith("image/")) {
    const url = URL.createObjectURL(fileBlob!);
    return (
      <iframe
        src={url}
        title="File Preview"
        className="w-full h-full border-none"
      />
    );
  }

  // This div is the target for the DOCX renderer
  return (
    <div
      ref={previewContainerRef}
      className="p-8 bg-white docx-preview-container h-full overflow-y-auto"
    />
  );
};
