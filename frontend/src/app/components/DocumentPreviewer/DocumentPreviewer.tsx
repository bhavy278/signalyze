"use client";

import { getPreviewUrl } from "@/services/document.service";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DocumentPreviewerProps {
  documentId: string;
}

export const DocumentPreviewer = ({ documentId }: DocumentPreviewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      if (!documentId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = await getPreviewUrl(documentId);
        setPreviewUrl(url);
        previewUrlRef.current = url;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [documentId]);

  return (
    <div className="relative flex-grow bg-gray-200">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="ml-2 text-gray-600">Generating preview...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-600 z-10">
          <p>Error loading preview: {error}</p>
        </div>
      )}

      {previewUrl && !isLoading && (
        <iframe
          src={previewUrl}
          title="Document Preview"
          className="w-full h-full border-none"
        />
      )}
    </div>
  );
};
