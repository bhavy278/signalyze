import express, { Request, Response } from "express";
import upload from "../middlewares/upload.middleware";
import { handleFileUpload } from "../controllers/documents.controller";

const routes = express.Router();

routes.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Documents API!",
  });
});

routes.post("/upload", upload.single("file"), handleFileUpload);

export default routes;
