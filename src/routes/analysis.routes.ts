import { Router } from "express";
import {
  analyzeDocumentById,
  getAllAnalysisForDocument,
  getAnalysisByVersion,
  compareAnalysis,
} from "../controllers/analysis.controllers";

const router = Router();

// router.post("/documents/:id/:version/", analyzeDocumentById);

router.post("/documents/:id", analyzeDocumentById);
router.get("/documents/:id/versions", getAllAnalysisForDocument);
router.get("/documents/:id/versions/:version", getAnalysisByVersion);
router.get("/documents/:id/compare", compareAnalysis);
const AnalysisRoutes = router;
export default AnalysisRoutes;
