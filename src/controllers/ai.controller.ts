import {Request,Response} from "express";
import { askAI } from "../config/ai.config";

export const handleOpenRouterAI = async (req: Request, res: Response) => {
    const { prompt } = req.body;
  
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required." });
    } else {
      const aiResponse = await askAI({ prompt });
      res.json({ aiResponse });
    }
  };