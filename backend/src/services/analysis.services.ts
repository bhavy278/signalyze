import { db } from "../config/db.config";

import { diff } from "json-diff";
import { analyzeDocumentWithOpenAI } from "./ai.services";
import { getTextFromFile } from "./file.services";

export const getDocumentByIdAndAnalyze = async (id: number) => {
  const [[document]]: any = await db.query(
    "SELECT * FROM documents WHERE id = ?",
    [id]
  );

  if (!document) {
    throw new Error("Document not found");
  }

  const textFromFile = await getTextFromFile(document.filename);

  const analysisJson = await analyzeDocumentWithOpenAI(textFromFile);

  const [result]: any = await db.execute("CALL SaveAnalysis(?, ?)", [
    id,
    JSON.stringify(analysisJson),
  ]);

  const newAnalysis = result[0];

  return newAnalysis;
};

export const handleGetAllAnalysisForDocument = async (documentId: number) => {
  const [rows]: any = await db.query(
    "SELECT id, document_id, version, created_at FROM analysis WHERE document_id = ? ORDER BY version DESC",
    [documentId]
  );

  if (rows.length === 0) {
    return [];
  }

  return rows;
};


export const handleGetAnalysisByVersion = async (
  documentId: number,
  version: number
) => {
  const [[analysis]]: any = await db.query(
    "SELECT * FROM analysis WHERE document_id = ? AND version = ?",
    [documentId, version]
  );

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
