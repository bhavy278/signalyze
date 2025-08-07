"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Trash2, Eye, PlusCircle } from "lucide-react";
import {
  getAllDocuments,
  deleteDocumentById,
} from "@/services/document.service";
import { useToast } from "@/context/ToastContext";
import { Document } from "@/types/document.types";

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDocuments = async () => {
    try {
      const response = await getAllDocuments();
      if (response.success) {
        setDocuments(response.data);
      }
    } catch (error: any) {
      addToast({
        message: error.message || "Failed to fetch documents.",
        severity: "error",
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (documentId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this document? This action cannot be undone."
      )
    ) {
      try {
        await deleteDocumentById(documentId);
        addToast({
          message: "Document deleted successfully.",
          severity: "success",
          position: "top-right",
        });

        fetchDocuments();
      } catch (error: any) {
        addToast({
          message: error.message,
          severity: "error",
          position: "top-right",
        });
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading documents...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>
        <Link href="/">
          <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle size={20} />
            Upload New
          </button>
        </Link>
      </div>

      {documents.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-800 truncate max-w-md">
                      {doc.original_filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded on:{" "}
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600"
                    title="View & Analyze"
                  >
                    <Eye size={20} />
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id.toString())}
                    className="p-2 text-gray-500 hover:text-red-600"
                    title="Delete Document"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            No Documents Found
          </h2>
          <p className="text-gray-500 mt-2">
            You haven't uploaded any documents yet.
          </p>
          <Link href="/">
            <button className="mt-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Upload Your First Document
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
