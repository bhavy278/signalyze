import { Response } from "express";
import { AuthenticatedRequest } from "../commons/types/express/global";
import {
  getDocumentByIdAndAnalyze,
  handleCompareAnalysis,
  handleGetAllAnalysisForDocument,
  handleGetAnalysisByVersion,
} from "../services/analysis.services";

export const analyzeDocumentById = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(_req.params.id);
    const analysis = await getDocumentByIdAndAnalyze(id);
    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAnalysisByVersion = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const documentId = parseInt(req.params.id);
    const version = parseInt(req.params.version);
    const analysis = await handleGetAnalysisByVersion(documentId, version);
    res.json({ success: true, analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllAnalysisForDocument = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const documentId = parseInt(req.params.id);
    const analysis = await handleGetAllAnalysisForDocument(documentId);
    res.json({ success: true, analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const compareAnalysis = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const documentId = parseInt(req.params.id);
    const { baseVersion, compareVersion } = req.query;
    const comparison = await handleCompareAnalysis(
      documentId,
      parseInt(baseVersion as string),
      parseInt(compareVersion as string)
    );
    res.json({ success: true, comparison });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
