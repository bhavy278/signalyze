import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import { CORS_OPTIONS } from "./commons/constants/app.constants";
import { AuthenticatedRequest } from "./commons/types/express/global";
import { connectToDatabase } from "./config/db.config";
import { authMiddleware } from "./middlewares/auth.middleware";
import { adminOnly } from "./middlewares/role.middleware";
import AuthRoutes from "./routes/auth.routes";
import UserRoutes from "./routes/user.routes";
import DocumentRoutes from "./routes/document.routes";
import AnalysisRoutes from "./routes/analysis.routes";

const app: Application = express();
const PORT = 5001;

app.use(cors(CORS_OPTIONS));
app.use(morgan("dev"));
app.use(express.json());

connectToDatabase();

app.get("/api/v1", (_req: Request, res: Response) => {
  res.send("Signalyze TypeScript API is running 🚀");
});

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", authMiddleware, UserRoutes);
app.use("/api/v1/documents", authMiddleware, DocumentRoutes);
app.use("/api/v1/analysis/", authMiddleware, AnalysisRoutes);

app.get(
  "/api/v1/home",
  authMiddleware,
  (_req: AuthenticatedRequest, res: Response) => {
    res.json(_req.user);
  }
);
app.get(
  "/api/v1/admin",
  authMiddleware,
  adminOnly,
  (_req: AuthenticatedRequest, res: Response) => {
    res.json(_req.user);
  }
);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
