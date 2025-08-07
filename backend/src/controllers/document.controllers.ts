import { Response } from "express";
import fs from "fs";
import path from "path";
import { AuthenticatedRequest } from "../commons/types/express/global";
import {
  SaveDocumentType,
  UserDocumentsType,
  UserDocumentType,
} from "../commons/types/document.types";
import {
  convertDocxToPdf,
  handleDeleteDocument,
  handleGetAllDocumentsByUser,
  handleGetSingleDocumentById,
  saveDocument,
} from "../services/document.services";
import { getQueryFromFile } from "../services/app.services";
import { DOCUMENT_QUERIES } from "../commons/constants/query.constants";
import { RESULT_ENUM } from "../commons/constants/app.constants";
import { db } from "../config/db.config";

export const uploadDocument = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const file = _req.file;

  console.log("file", file);
  if (!file) {
    return res
      .status(400)
      .json({ message: "No file uploaded", success: false });
  }
  const userId = _req.user?.id;

  // Save relative path
  const relativeFilePath = path.join("/uploads", file.filename);
  const documentInfo: SaveDocumentType = {
    user_id: userId,
    filename: file.filename,
    original_filename: file.originalname,
    filepath: relativeFilePath,
    size: file.size,
    type: file.mimetype,
    uploaded_at: new Date(),
    deleted: false,
  };
  const result: any = await saveDocument(documentInfo);

  if (result.status === RESULT_ENUM.FAILED || !result.document) {
    return res.status(500).json({
      message: "Internal Server Error. Could not save document.",
      success: false,
    });
  } else {
    return res.status(201).json({
      message: "Document uploaded successfully",
      success: true,
      data: result.document,
    });
  }
};

export const getAllDocumentsByUser = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const documents: Array<UserDocumentsType> = await handleGetAllDocumentsByUser(
    _req.user.id
  );
  return res.status(200).json({
    message: "Documents found",
    success: true,
    data: documents,
  });
};

export const getDocumentById = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const result: UserDocumentType = await handleGetSingleDocumentById(
    _req.params.documentId,
    _req.user.id
  );
  if (result.status === RESULT_ENUM.DOCUMENTS_FOUND)
    return res.status(200).json({
      success: true,
      message: `Document found with id: ${_req.params.documentId}`,
      data: result.docs,
    });
  else
    return res.status(200).json({
      success: true,
      message: `No document found with id: ${_req.params.documentId}`,
      data: result.docs,
    });
};

export const deleteDocumentById = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const userId = _req.user.id;
  const documentId = _req.params.documentId;
  const result: UserDocumentType = await handleGetSingleDocumentById(
    documentId,
    userId
  );
  if (result.status === RESULT_ENUM.DOCUMENTS_NOT_FOUND)
    return res.status(200).json({
      success: true,
      message: `No document found with id: ${documentId}`,
      data: result.docs,
    });
  else {
    const isDeleted = await handleDeleteDocument(documentId, userId);
    if (isDeleted === RESULT_ENUM.SUCCESS)
      return res.status(200).json({
        success: true,
        message: `Deleted a document with id: ${documentId}`,
      });
    else
      return res.status(200).json({
        success: true,
        message: `Failed to delete a document with id: ${documentId}`,
      });
  }
};

export const previewDocument = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { documentId } = _req.params;
    const userId = _req.user?.id;

    const [[document]]: any = await db.query(
      "SELECT * FROM documents WHERE id = ? AND user_id = ?",
      [documentId, userId]
    );

    if (!document) {
      return res.status(404).send("Document not found or access denied.");
    }

    const uploadsDir = path.join(__dirname, "../../uploads");
    const originalFilePath = path.join(uploadsDir, document.filename);

    if (!fs.existsSync(originalFilePath)) {
      return res.status(404).send("Original file not found on server.");
    }

    // If the file is already a PDF or an image, send it directly.
    if (
      document.type === "application/pdf" ||
      document.type.startsWith("image/")
    ) {
      return res.sendFile(originalFilePath);
    }

    // If it's a DOCX, convert it to PDF and then send the PDF.
    if (
      document.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const pdfPath = await convertDocxToPdf(originalFilePath, uploadsDir);
      return res.sendFile(pdfPath);
    }

    res.status(400).send("File type cannot be previewed.");
  } catch (error) {
    console.error("Error during document preview:", error);
    res.status(500).send("Server error while generating preview.");
  }
};
