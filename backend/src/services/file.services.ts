import path from "path";
import fs from "fs/promises";
import PdfParse from "pdf-parse";
import mammoth from "mammoth";

export const getTextFromFile = async (filename: string) => {
  const filePath = path.join(__dirname, "../../", "uploads", filename);

  try {
    await fs.access(filePath);
  } catch {
    throw new Error("File not found in /uploads");
  }

  const documentText = await extractTextFromFile(filePath);
  return cleanText(documentText);
};

export function cleanText(text: string): string {
  return text
    .replace(/[\t\r]+/g, " ")
    .replace(/\s{1,}/g, " ")
    .replace(/\n{1,}/g, "\n")
    .replace(/\n{1,}/g, "\\")
    .trim();
}
export async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const buffer = await fs.readFile(filePath);
    const data = await PdfParse(buffer);
    return data.text;
  }

  if (ext === ".docx") {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(
    `Unsupported file extension: ${ext}. Only .pdf and .docx are supported.`
  );
}
