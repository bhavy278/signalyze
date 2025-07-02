import mongoose, { Schema, Document as MDoc } from "mongoose";
import { IDocument } from "../commons/interfaces/document.interface";

const DocumentSchema = new Schema<IDocument>({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
  user: {
    id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
  },
});

export const DocumentModel = mongoose.model<IDocument>(
  "Document",
  DocumentSchema
);
