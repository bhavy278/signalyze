import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import express, { Request, Response } from "express";
import { connectDB } from "./config/db.config";
import { APP_ROUTES, BASE_API_ENDPOINT } from "./enums/routes.enum";
import documentsRoutes from "./routes/documents.route";
import authRoutes from "./routes/auth.route";

connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Express TypeScript API!",
  });
});

app.use(`${BASE_API_ENDPOINT}${APP_ROUTES.API_AUTH}`, authRoutes);

// Document routes
// app.use("/api/v1/documents", documentsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// startServer();

// export default startServer;
