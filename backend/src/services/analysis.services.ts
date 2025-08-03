import { db } from "../config/db.config";
// import { analyzeDocumentWithOpenRouter } from "./ai.services";
import { analyzeDocumentWithOpenAI } from "./ai.services";
import { cleanText, getTextFromFile } from "./file.services";
import { diff } from "json-diff";

//  This is the function you already have, which creates a new analysis version.
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

  // // This stored procedure saves the new analysis and increments the version.
  const [result]: any = await db.execute("CALL SaveAnalysis(?, ?)", [
    id,
    JSON.stringify(analysisJson),
  ]);

  const newAnalysis = result[0];

  // // The JSON is stored as a string, so parse it before returning.

  // newAnalysis.analysis = JSON.parse(newAnalysis.analysis);

  return newAnalysis;
};

export const handleGetAllAnalysisForDocument = async (documentId: number) => {
  const [rows]: any = await db.query(
    "SELECT id, document_id, version, created_at FROM analysis WHERE document_id = ? ORDER BY version DESC",
    [documentId]
  );

  if (rows.length === 0) {
    return []; // Return an empty array if no analysis exist yet.
  }

  return rows;
};

/**
 * Retrieves a single, specific version of an analysis for a document.
 */
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

  // The database stores the JSON as a string, so we need to parse it
  // before sending it back to the controller.
  analysis.analysis_json = JSON.parse(analysis.analysis_json);

  return analysis;
};

/**
 * Fetches two versions of an analysis and computes the difference between them.
 */
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

  // Reuse our existing function to get each version's data.
  const baseAnalysis = await handleGetAnalysisByVersion(
    documentId,
    baseVersion
  );
  const compareAnalysis = await handleGetAnalysisByVersion(
    documentId,
    compareVersion
  );

  // Use the json-diff library to find the differences.
  // The `true` flag returns a more detailed diff object.
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
    // The `differences` object will be undefined if there are no changes.
    differences: differences || "No differences found.",
  };
};
