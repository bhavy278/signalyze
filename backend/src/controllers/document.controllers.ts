import { Response } from "express";
import path from "path";
import { AuthenticatedRequest } from "../commons/types/express/global";
import {
  SaveDocumentType,
  UserDocumentsType,
  UserDocumentType,
} from "../commons/types/document.types";
import {
  handleDeleteDocument,
  handleGetAllDocumentsByUser,
  handleGetSingleDocumentById,
  saveDocument,
} from "../services/document.services";
import { getQueryFromFile } from "../services/app.services";
import { DOCUMENT_QUERIES } from "../commons/constants/query.constants";
import { RESULT_ENUM } from "../commons/constants/app.constants";

export const uploadDocument = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const file = _req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const userId = _req.user?.id;

  // Save relative path
  const relativeFilePath = path.join("/uploads", file.filename);
  const documentInfo: SaveDocumentType = {
    user_id: userId,
    filename: file.filename, // Saved/generated name
    original_filename: file.originalname, // User's uploaded name
    filepath: relativeFilePath,
    size: file.size, // Size in bytes
    type: file.mimetype, // MIME type
    uploaded_at: new Date(),
    deleted: false,
  };
  const result: string = await saveDocument(documentInfo);
  if (result === RESULT_ENUM.FAILED)
    return res.status(500).json({
      message: "Internal Server Error. Try Again Later.",
    });

  return res.status(201).json({
    message: "Document uploaded successfully",
    data: {
      ...documentInfo,
    },
  });
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
      message: `Document found with id: ${_req.params.documentId}`,
      data: result.docs,
    });
  else
    return res.status(200).json({
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
      message: `No document found with id: ${documentId}`,
      data: result.docs,
    });
  else {
    const isDeleted = await handleDeleteDocument(documentId, userId);
    if (isDeleted === RESULT_ENUM.SUCCESS)
      return res.status(200).json({
        message: `Deleted a document with id: ${documentId}`,
      });
    else
      return res.status(200).json({
        message: `Failed to delete a document with id: ${documentId}`,
      });
  }
};
