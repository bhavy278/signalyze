import mongoose from "mongoose";

export interface IDocument {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  user: {
    id: mongoose.Types.ObjectId;
    email: string;
  };
  uploadedAt: Date;
}
