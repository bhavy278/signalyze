import express from "express";
import { uploadDocument,getAllDocumentsByUser, getDocumentById,deleteDocumentById } from "../controllers/document.controllers";
import upload from "../middlewares/file.middleware";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getAllDocumentsByUser);
router.get("/:documentId", getDocumentById);
router.delete("/:documentId", deleteDocumentById);

const DocumentRoutes = router;
export default DocumentRoutes;
