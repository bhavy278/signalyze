import { Request, Response } from "express";


export const handleFileUpload = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({
      error: "No file uploaded",
    });
    return;
  }

  res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
  });
};
