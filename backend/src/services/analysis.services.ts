import { db } from "../config/db.config";

import { diff } from "json-diff";
import { analyzeDocumentWithOpenAI } from "./ai.services";
import { getTextFromFile } from "./file.services";
import {
  ANALYSIS_QUERIES,
  DOCUMENT_QUERIES,
} from "../commons/constants/query.constants";
import { getQueryFromFile } from "./app.services";

export const getDocumentByIdAndAnalyze = async (
  id: number,
  user_id: number
) => {
  const getDocumentQuery = getQueryFromFile(
    DOCUMENT_QUERIES.GET_SINGLE_DOCUMENT_BY_DOCUMENT_ID
  );
  const [[document]]: any = await db.query(getDocumentQuery, [id, user_id]);

  if (!document) {
    throw new Error("Document not found");
  }

  const textFromFile = await getTextFromFile(document.filename);

  const analysisJson = await analyzeDocumentWithOpenAI(textFromFile);

  const analysisQuery = getQueryFromFile(ANALYSIS_QUERIES.SAVE_ANALYSIS);

  const [result]: any = await db.execute(analysisQuery, [
    id,
    JSON.stringify(analysisJson),
  ]);

  const newAnalysis = result[0];

  return newAnalysis;
};

export const handleGetAllAnalysisForDocument = async (documentId: number) => {
  const query = getQueryFromFile(
    ANALYSIS_QUERIES.GET_ALL_ANALYSIS_FOR_DOCUMENT
  );
  const [rows]: any = await db.query(query, [documentId]);

  if (rows.length === 0) {
    return [];
  }

  return rows;
};

export const handleGetAnalysisByVersion = async (
  documentId: number,
  version: number
) => {
  const query = getQueryFromFile(
    ANALYSIS_QUERIES.GET_ANALYSIS_BY_DOCUMENT_ID_AND_VERSION
  );
  const [[analysis]]: any = await db.query(query, [documentId, version]);

  if (!analysis) {
    throw new Error(
      `Analysis version ${version} for document ${documentId} not found.`
    );
  }

  if (typeof analysis.analysis_json === "string") {
    analysis.analysis_json = JSON.parse(analysis.analysis_json);
  }

  return analysis;
};

export const handleCompareAnalysis = async (
  documentId: number,
  baseVersion: number,
  compareVersion: number
) => {
  if (baseVersion === compareVersion) {
    throw new Error("Cannot compare a version with itself.");
  }

  console.log(
    `Comparing document ${documentId}: version ${baseVersion} vs ${compareVersion}`
  );

  const baseAnalysis = await handleGetAnalysisByVersion(
    documentId,
    baseVersion
  );
  const compareAnalysis = await handleGetAnalysisByVersion(
    documentId,
    compareVersion
  );

  const differences = diff(
    baseAnalysis.analysis_json,
    compareAnalysis.analysis_json,
    { full: true }
  );

  return {
    base: {
      version: baseAnalysis.version,
      createdAt: baseAnalysis.created_at,
    },
    compare: {
      version: compareAnalysis.version,
      createdAt: compareAnalysis.created_at,
    },

    differences: differences || "No differences found.",
  };
};
