import { Request, Response } from "express";
import { DocumentModel } from "../models/document.model";
import { IDocument } from "../commons/interfaces/document.interface";
import { UserModel } from "../models/user.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { attachDocumentToUser } from "../services/user.service";

export const handleFileUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      error: "No file uploaded",
    });
    return;
  }

  console.log((req as AuthenticatedRequest).user);

  const data: IDocument = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    uploadedAt: new Date(),
    user: {
      id: (req as AuthenticatedRequest).user?._id,
      email: (req as AuthenticatedRequest).user?.email,
    },
  };

  const doc = await DocumentModel.create({
    ...data,
  });

  await attachDocumentToUser((req as AuthenticatedRequest).user?._id, doc._id);

  res.status(201).json({
    message: "File uploaded successfully",
    success: true,
    data: doc,
  });
};
