// src/middlewares/role.middleware.ts
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../commons/types/express/global";

export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};
