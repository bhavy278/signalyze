import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import { CORS_OPTIONS } from "./commons/constants/app.constants";
import { connectToDatabase } from "./config/db.config";
import { authMiddleware } from "./middlewares/auth.middleware";
import AuthRoutes from "./routes/auth.routes";
import { AuthenticatedRequest } from "./commons/types/express/global";


const app: Application = express();
const PORT = 5001;

// Middlewares
app.use(cors(CORS_OPTIONS)); // Enable CORS for all origins by default
app.use(morgan("dev")); // Log HTTP requests to console
app.use(express.json()); // Parse JSON bodies

connectToDatabase();

app.get("/", (_req: Request, res: Response) => {
  res.send("Signalyze TypeScript API is running 🚀");
});

app.use("/api/v1/auth", AuthRoutes);

app.get("/api/v1/home", authMiddleware, (_req: AuthenticatedRequest, res: Response) => {
  res.json(_req.user);
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
