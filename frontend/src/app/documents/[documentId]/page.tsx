"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Document, Analysis, AnalysisVersion } from "@/types/document.types";
import { getDocumentById } from "@/services/document.service";
import {
  analyzeDocument,
  getAnalysisVersions,
  getAnalysisByVersion,
} from "@/services/analysis.service";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/app/components/ui/Button";
import { Select } from "@/app/components/ui/Select";
import { SelectOption } from "@/types/ui.types";
import { Loader2 } from "lucide-react";
import { AnalysisViewer } from "@/app/components/AnalysisViewer/page";

const DocumentPreviewer = dynamic(
  () =>
    import("@/app/components/DocumentPreviewer/page").then(
      (mod) => mod.DocumentPreviewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-200">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-3 text-gray-600">Loading Previewer...</p>
      </div>
    ),
  }
);
export default function DocumentDetailPage() {
  const params = useParams();
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<AnalysisVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { addToast } = useToast();

  const fetchAnalysisForVersion = useCallback(
    async (version: number) => {
      try {
        const response = await getAnalysisByVersion(documentId, version);
        if (response.success) {
          setSelectedAnalysis(response.analysis);
        }
      } catch (error: any) {
        addToast({
          message: error.message,
          severity: "error",
          position: "top-right",
        });
      }
    },
    [documentId, addToast]
  );

  useEffect(() => {
    if (!documentId) return;

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const docPromise = getDocumentById(documentId);
        const versionsPromise = getAnalysisVersions(documentId);

        const [docResponse, versionsResponse] = await Promise.all([
          docPromise,
          versionsPromise,
        ]);

        if (docResponse.success && docResponse.data.length > 0) {
          setDocument(docResponse.data[0]);
        } else {
          throw new Error("Document not found.");
        }

        if (versionsResponse.success) {
          setVersions(versionsResponse.analysis);
          if (versionsResponse.analysis.length > 0) {
            const latestVersion = versionsResponse.analysis[0].version;
            setSelectedVersion(latestVersion.toString());
            await fetchAnalysisForVersion(latestVersion);
          }
        }
      } catch (error: any) {
        addToast({
          message: error.message,
          severity: "error",
          position: "top-right",
        });
        setDocument(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [documentId, addToast, fetchAnalysisForVersion]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await analyzeDocument(documentId);
      if (response.success) {
        addToast({
          message: "New analysis complete!",
          severity: "success",
          position: "top-right",
        });
        const versionsResponse = await getAnalysisVersions(documentId);
        setVersions(versionsResponse.analysis);
        const newLatestVersion = versionsResponse.analysis[0].version;
        setSelectedVersion(newLatestVersion.toString());
        await fetchAnalysisForVersion(newLatestVersion);
      }
    } catch (error: any) {
      addToast({
        message: error.message,
        severity: "error",
        position: "top-right",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVersionSelect = (value: string | number) => {
    const versionNumber = Number(value);
    setSelectedVersion(versionNumber.toString());
    fetchAnalysisForVersion(versionNumber);
  };

  const versionOptions: SelectOption[] = versions.map((v) => ({
    value: v.version,
    label: `Version ${v.version} (${new Date(
      v.created_at
    ).toLocaleDateString()})`,
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-10 font-semibold text-lg">
        Document not found.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 h-full flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h1
            className="text-xl font-bold text-gray-800 truncate"
            title={document.original_filename}
          >
            {document.original_filename}
          </h1>
        </div>

        <DocumentPreviewer documentId={document.id.toString()} />
      </div>

      <div className="w-1/2 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Analysis</h2>
          <div className="flex items-center gap-4">
            {versions.length > 0 && (
              <Select
                options={versionOptions}
                value={selectedVersion}
                onSelect={handleVersionSelect}
              />
            )}
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Re-Analyze"
              )}
            </Button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          {selectedAnalysis ? (
            <AnalysisViewer analysis={selectedAnalysis.analysis_json} />
          ) : (
            <div className="text-center text-gray-500 pt-20">
              <h3 className="text-xl font-semibold">No Analysis Available</h3>
              <p className="mt-2">
                Click "Re-Analyze" to generate the first version.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
