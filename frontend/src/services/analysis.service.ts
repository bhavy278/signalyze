import api from "./api";
import { AnalysisResponse, AnalysisVersionsResponse } from "@/types/document.types";

export const analyzeDocument = async (documentId: string): Promise<AnalysisResponse> => {
  try {
    const response = await api.post(`/analysis/documents/${documentId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to analyze document.");
  }
};

export const getAnalysisVersions = async (documentId: string): Promise<AnalysisVersionsResponse> => {
  try {
    const response = await api.get(`/analysis/documents/${documentId}/versions`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch analysis versions.");
  }
};

export const getAnalysisByVersion = async (documentId: string, version: number): Promise<AnalysisResponse> => {
  try {
    const response = await api.get(`/analysis/documents/${documentId}/versions/${version}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch analysis.");
  }
};
export const getAllAnalysisForDocument=async(documentId:string,userId:string)=>{
  try{

  }catch(error:any){
    throw new Error(error.response?.data?.message || "Failed to fetch analysis.")
  }
}