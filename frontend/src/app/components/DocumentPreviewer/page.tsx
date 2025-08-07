"use client";

import { getPreviewUrl } from "@/services/document.service";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DocumentPreviewerProps {
  documentId: string;
}

export const DocumentPreviewer = ({ documentId }: DocumentPreviewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
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
      {previewUrl && (
        <iframe
          src={previewUrl}
          title="Document Preview"
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};
