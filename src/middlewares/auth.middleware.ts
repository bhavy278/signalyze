import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyJWT } from "../services/auth.service";
import { DecodedUserType } from "../commons/types/auth.types";
import { AuthenticatedRequest } from "../commons/types/express/global";

export const authMiddleware = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const authHeader = _req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  const isVerified = await verifyJWT(token);

  if (!isVerified) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const decoded = jwt.decode(token) as DecodedUserType;

  _req.user = {
    email: decoded?.email,
    name: decoded?.name,
    role: decoded?.role,
  };

  next();
};
