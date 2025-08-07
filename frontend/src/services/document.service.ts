import {
  AllDocumentsResponse,
  UploadResponse,
  SingleDocumentResponse,
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
    // Use axios to get the file, specifying the response type as 'blob'
    const response = await api.get(`/documents/preview/${id}`, {
      responseType: "blob",
    });

    // With axios, the blob data is directly in response.data
    const blob = response.data;

    // Create and return a temporary local URL for the blob
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Could not load preview:", error);
    // Re-throw a user-friendly error message
    throw new Error("Could not load document preview. Please try again.");
  }
};
// export const previewDocument = async (id: string): Promise<any> => {
//   try {
//     const response: any = await api.get(`/documents/preview/${id}`, {
//       responseType: "blob",
//     });

//     if (!response.ok) {
//       throw new Error("Could not load preview.");
//     }

//     const blob = await response.blob();
//     console.log(blob);
//     return URL.createObjectURL(blob);
//     // setPreviewUrl(URL.createObjectURL(blob));
//   } catch (error) {
//     console.error(error);
//   }
// };
