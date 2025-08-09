"use client";

import { useToast } from "@/context/ToastContext";
import {
  deleteDocumentById,
  getAllDocuments,
} from "@/services/document.service";
import { Document } from "@/types/document.types";
import { Eye, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FileIcon } from "../components/ui/FileIcon";

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await getAllDocuments();
      if (response.success) {
        setDocuments(response.data);
        console.log(response.data);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        addToast({
          message: error.message || "Failed to fetch documents.",
          severity: "error",
          position: "top-right",
        });
      } else {
        addToast({
          message: "Failed to fetch documents.",
          severity: "error",
          position: "top-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (documentId: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this document? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteDocumentById(documentId);
      addToast({
        message: "Document deleted successfully.",
        severity: "success",
        position: "top-right",
      });
      fetchDocuments();
    } catch (error: unknown) {
      if (error instanceof Error) {
        addToast({
          message: error.message,
          severity: "error",
          position: "top-right",
        });
      } else {
        addToast({
          message: "Failed to delete the document.",
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
            {documents.map((doc: Document) => {
              const navLink = `/documents/${doc.id}/`;
              console.log(doc);
              return (
                <li
                  key={doc.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="flex items-center gap-4"
                    title={doc.original_filename}
                  >
                    <FileIcon filetype={doc.type} />
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
                      href={navLink}
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
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">
            No Documents Found
          </h2>
          <p className="text-gray-500 mt-2">
            You haven&apos;t uploaded any documents yet.
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
