import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { RESULT_ENUM } from "../commons/constants/app.constants";
import { DOCUMENT_QUERIES } from "../commons/constants/query.constants";
import {
  SaveDocumentType,
  UserDocumentType,
} from "../commons/types/document.types";
import { db } from "../config/db.config";
import { getQueryFromFile } from "./app.services";

export const saveDocument = async (document: SaveDocumentType) => {
  const query = await getQueryFromFile(DOCUMENT_QUERIES.SAVE_DOCUMENT);

  const [result]: any = await db.query(query, [
    document.user_id,
    document.filename,
    document.original_filename,
    document.filepath,
    document.size,
    document.type,
    document.uploaded_at,
    document.deleted,
  ]);
  console.log(result);
  const newDocumentId = result[0][0]?.id;

  if (newDocumentId) {
    return {
      status: RESULT_ENUM.SUCCESS,
      document: {
        id: newDocumentId,
        ...document,
      },
    };
  } else {
    return { status: RESULT_ENUM.FAILED, document: null };
  }
};

export const handleGetAllDocumentsByUser = async (userId: string) => {
  const query = getQueryFromFile(DOCUMENT_QUERIES.GET_ALL_DOCUMENTS_BY_USER);

  const [rows]: any = await db.query(query, [userId]);
  return rows;
};

export const handleGetSingleDocumentById = async (
  documentId: string,
  userId: string
) => {
  const query = getQueryFromFile(
    DOCUMENT_QUERIES.GET_SINGLE_DOCUMENT_BY_DOCUMENT_ID
  );
  const [rows]: any = await db.query(query, [documentId, userId]);

  let result: UserDocumentType = {
    status: "DOCUMENTS_NOT_FOUND",
    docs: [],
  };
  if (rows.length > 0) {
    result.status = "DOCUMENTS_FOUND";
    result.docs = rows;
  } else {
    result.status = "DOCUMENTS_NOT_FOUND";
    result.docs = [];
  }
  return result;
};

export const handleDeleteDocument = async (
  documentId: string,
  userId: string
): Promise<string> => {
  const query = getQueryFromFile(DOCUMENT_QUERIES.DELETE_DOCUMENT_BY_ID);
  const [rows]: any = await db.query(query, [documentId, userId]);
  if (rows.affectedRows > 0) return RESULT_ENUM.SUCCESS;
  else return RESULT_ENUM.FAILED;
};

export const convertDocxToPdf = (
  docxPath: string,
  outputDir: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const args = [
      "--headless",
      "--convert-to",
      "pdf",
      "--outdir",
      outputDir,
      docxPath,
    ];

    execFile("soffice", args, (error, stdout, stderr) => {
      if (error) {
        console.error("LibreOffice conversion error:", stderr);
        return reject(new Error("Failed to convert document to PDF."));
      }

      const pdfFilename = `${path.basename(docxPath, ".docx")}.pdf`;
      const pdfPath = path.join(outputDir, pdfFilename);

      if (fs.existsSync(pdfPath)) {
        resolve(pdfPath);
      } else {
        reject(new Error("Converted PDF file not found."));
      }
    });
  });
};
