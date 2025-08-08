import {
  AnalysisResponse,
  AnalysisVersionsResponse,
} from "@/types/document.types";
import api from "./api";
import { AxiosError } from "axios";

// Utility for error handling
const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const analyzeDocument = async (
  documentId: string
): Promise<AnalysisResponse> => {
  try {
    const response = await api.post(`/analysis/documents/${documentId}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to analyze document."));
  }
};

export const getAnalysisVersions = async (
  documentId: string
): Promise<AnalysisVersionsResponse> => {
  try {
    const response = await api.get(
      `/analysis/documents/${documentId}/versions`
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      extractErrorMessage(error, "Failed to fetch analysis versions.")
    );
  }
};

export const getAnalysisByVersion = async (
  documentId: string,
  version: number
): Promise<AnalysisResponse> => {
  try {
    const response = await api.get(
      `/analysis/documents/${documentId}/versions/${version}`
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to fetch analysis."));
  }
};

// If this method is not implemented yet, leave a comment or return a placeholder
export const getAllAnalysisForDocument = async (
  documentId: string,

): Promise<unknown> => {
  try {
    const response = await api.get(
      `/analysis/documents/${documentId}/versions`
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractErrorMessage(error, "Failed to fetch analysis."));
  }
};
