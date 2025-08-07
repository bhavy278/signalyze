"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StyledFileUpload } from "./components/ui/FileUpload";
import { Button } from "./components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { uploadDocument } from "@/services/document.service";
import { analyzeDocument } from "@/services/analysis.service";
import { Loader2 } from "lucide-react";

// Defines the possible states of the page to manage the UI flow
type PageState =
  | "initial"
  | "file_selected"
  | "uploading"
  | "uploaded"
  | "analyzing";

export default function HomePage() {
  const [pageState, setPageState] = useState<PageState>("initial");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedDocumentId, setUploadedDocumentId] = useState<number | null>(
    null
  );

  const { addToast } = useToast();
  const router = useRouter();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setUploadedDocumentId(null); // Reset previous upload if a new file is selected
    if (file) {
      setPageState("file_selected");
    } else {
      setPageState("initial");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setPageState("uploading");

    try {
      const response = await uploadDocument(selectedFile);
      if (response.success) {
        addToast({
          message: "Document uploaded successfully!",
          severity: "success",
          position: "top-right",
        });
        setUploadedDocumentId(response.data.id);
        setPageState("uploaded"); // Transition to the next step
      }
    } catch (error: any) {
      addToast({
        message: error.message || "Upload failed. Please try again.",
        severity: "error",
        position: "top-right",
      });
      setPageState("file_selected"); // Revert to previous state on failure
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedDocumentId) return;

    setPageState("analyzing");

    try {
      const response = await analyzeDocument(uploadedDocumentId.toString());
      if (response.success) {
        addToast({
          message: "Analysis complete! Redirecting...",
          severity: "success",
          position: "top-right",
        });
        // Redirect to the main document page after analysis
        router.push(`/documents/${uploadedDocumentId}/`);
      }
    } catch (error: any) {
      addToast({
        message: error.message || "Analysis failed. Please try again.",
        severity: "error",
        position: "top-right",
      });
      setPageState("uploaded"); // Revert to previous state on failure
    }
  };

  // Renders the correct button based on the current page state
  const renderButton = () => {
    switch (pageState) {
      case "initial":
        return (
          <Button size="md" disabled>
            Upload Document
          </Button>
        );
      case "file_selected":
        return (
          <Button size="md" onClick={handleUpload}>
            Upload Document
          </Button>
        );
      case "uploading":
        return (
          <Button size="md" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
          </Button>
        );
      case "uploaded":
        return (
          <Button size="md" onClick={handleAnalyze}>
            Start Analysis
          </Button>
        );
      case "analyzing":
        return (
          <Button size="md" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-24 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-dark leading-tight">
        Understand Your Documents, Instantly.
      </h1>
      <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
        Signalyze uses cutting-edge AI to analyze your contracts, leases, and
        terms of service. Uncover key details, identify potential risks, and
        gain clarity in minutes.
      </p>
      <div className="mt-10">
        <div className="mb-6">
          <StyledFileUpload
            onFileSelect={handleFileSelect}
            acceptedFileTypes=".pdf,.docx,.txt"
            // Disable the file upload area during processing states
            disabled={
              pageState === "uploading" ||
              pageState === "uploaded" ||
              pageState === "analyzing"
            }
          />
        </div>
        {renderButton()}
      </div>
    </div>
  );
}
