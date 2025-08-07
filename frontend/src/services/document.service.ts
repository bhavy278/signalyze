import {
  AllDocumentsResponse,
  SingleDocumentResponse,
  UploadResponse,
} from "@/types/document.types";
import api from "./api";

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData: any = new FormData();
  formData.append("file", file);
  try {
    const response: any = await api.post<UploadResponse>(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const getAllDocuments = async (): Promise<AllDocumentsResponse> => {
  try {
    const response = await api.get("/documents");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch documents."
    );
  }
};

export const getDocumentById = async (
  id: string
): Promise<SingleDocumentResponse> => {
  try {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch document details."
    );
  }
};

export const deleteDocumentById = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete document."
    );
  }
};
export const getPreviewUrl = async (id: string): Promise<string> => {
  try {
    const response = await api.get(`/documents/preview/${id}`, {
      responseType: "blob",
    });

    const blob = response.data;

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Could not load preview:", error);

    throw new Error("Could not load document preview. Please try again.");
  }
};
