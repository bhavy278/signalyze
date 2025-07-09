import express from "express";
import { handleOpenRouterAI } from "../controllers/ai.controller";

const router = express.Router();

router.post("/ans", handleOpenRouterAI);


export default router;
