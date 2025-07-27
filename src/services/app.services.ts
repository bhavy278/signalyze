import fs from "fs";
import path from "path";

export const getQueryFromFile = (filePath: string): string => {
  const query = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
  return query;
};
