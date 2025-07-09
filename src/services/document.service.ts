import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import mammoth from "mammoth";

export const extractTextFromDocx = async (
  docId: mongoose.Types.ObjectId,
  path: string
): Promise<string> => {
  console.log(`Extracting text from document with ID: ${docId}`);

  const text = await mammoth.extractRawText({ path });
  console.log(`Extracted text: ${text.value}`);
  return text.value;
};

// working on text extraction from document
