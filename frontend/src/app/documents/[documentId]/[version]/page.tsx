"use client";

import { Select } from "@/app/components/ui/Select";
import { useToast } from "@/context/ToastContext";
import { SelectOption } from "@/types/ui.types";
import { useParams } from "next/navigation";

export default function DocumentDetailPage() {
  const params = useParams();
  const documentId = params.documentId as string;

  const { addToast } = useToast();

  const analysisVersions: SelectOption[] = [
    { value: 3, label: "Version 3 (Latest)" },
    { value: 2, label: "Version 2" },
    { value: 1, label: "Version 1" },
  ];

  const handleSelectChange = (value: string | number) => {
    console.log("Selected version:", value);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 h-full flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-gray-800 truncate">
            File Name
          </h1>
        </div>
        <div className="flex-grow bg-gray-200 p-4">
          <p className="text-center">
            Document Previewer Component will go here.
          </p>
        </div>
      </div>

      <div className="w-1/2 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Analysis</h2>
          <div className="flex items-center gap-4">
            <p>Version Selector</p>
            <Select
              options={analysisVersions}
              //   value={selectedValue}
              onSelect={handleSelectChange}
              placeholder="Choose a version..."
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          {true ? (
            <div>
              <h3 className="text-lg font-bold">
                Analysis Details (Version: Version number)
              </h3>
              <pre className="mt-4 bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap">
                <h1>Analysis Preview</h1>
              </pre>
            </div>
          ) : (
            <div className="text-center text-gray-500 pt-20">
              <p>No analysis has been run for this document yet.</p>
              <p className="mt-2">Click "Analyze Document" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
