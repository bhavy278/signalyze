import {
  AllDocumentsResponse,
  SingleDocumentResponse,
  UploadResponse,
} from "@/types/document.types";
import api from "./api";

interface AxiosErrorData {
  message?: string;
  msg?: string;
}

interface AxiosErrorResponse {
  data?: AxiosErrorData | null;
}

interface AxiosErrorLike {
  response?: AxiosErrorResponse | null;
}

const getErrorMessage = (
  error: unknown,
  fallback = "An error occurred"
): string => {
  const err = error as AxiosErrorLike;

  if (err && typeof err === "object" && err.response && err.response.data) {
    return err.response.data.message || err.response.data.msg || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post<UploadResponse>(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Something went wrong"));
  }
};

export const getAllDocuments = async (): Promise<AllDocumentsResponse> => {
  try {
    const response = await api.get<AllDocumentsResponse>("/documents");
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to fetch documents."));
  }
};

export const getDocumentById = async (
  id: string
): Promise<SingleDocumentResponse> => {
  try {
    const response = await api.get<SingleDocumentResponse>(`/documents/${id}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      getErrorMessage(error, "Failed to fetch document details.")
    );
  }
};

export const deleteDocumentById = async (id: string): Promise<void> => {
  try {
    await api.delete(`/documents/${id}`);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to delete document."));
  }
};

export const getPreviewUrl = async (id: string): Promise<string> => {
  try {
    const response = await api.get<Blob>(`/documents/preview/${id}`, {
      responseType: "blob",
    });

    const blob = response.data;

    return URL.createObjectURL(blob);
  } catch (error: unknown) {
    console.error("Could not load preview:", error);
    throw new Error("Could not load document preview. Please try again.");
  }
};
