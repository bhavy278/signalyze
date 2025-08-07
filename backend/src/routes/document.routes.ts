import express from "express";
import {
  uploadDocument,
  getAllDocumentsByUser,
  getDocumentById,
  deleteDocumentById,
  previewDocument,
} from "../controllers/document.controllers";
import upload from "../middlewares/file.middleware";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getAllDocumentsByUser);
router.get("/:documentId", getDocumentById);
router.delete("/:documentId", deleteDocumentById);
router.get("/preview/:documentId", previewDocument);

const DocumentRoutes = router;
export default DocumentRoutes;
