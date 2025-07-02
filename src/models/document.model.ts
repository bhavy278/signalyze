import mongoose, { Schema, Document as MDoc } from "mongoose";

export interface IDocument extends MDoc {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const DocumentModel = mongoose.model<IDocument>(
  "Document",
  DocumentSchema
);
