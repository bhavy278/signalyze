import { RESULT_ENUM } from "../constants/app.constants";
export type SaveDocumentType = {
  user_id: Number;
  filename: String; // Saved/generated name
  original_filename: String; // User's uploaded name
  filepath: String;
  size: Number; // Size in bytes
  type: String; // MIME type
  latest_version: number | null;
  uploaded_at: Date;
  deleted: false;
};

export type UserDocumentsType = {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  filepath: string;
  size: number;
  type: string;
  uploaded_at: Date;
  deleted: boolean;
  latest_version: number | null;
};

export type UserDocumentType = {
  status: "DOCUMENTS_FOUND" | "DOCUMENTS_NOT_FOUND";
  docs: Array<UserDocumentsType>;
};
