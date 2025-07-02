import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../commons/interfaces/auth.interface";

// Extend the Request type locally
export interface AuthenticatedRequest extends Request {
  user?: IUser | JwtPayload;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from headers (Authorization header)
  const token = req.headers["authorization"]?.split(" ")[1].trim(); // Assuming the format "Bearer <token>"

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  } else {
    try {
      // Verify the token using the secret key
      if (!process.env.JWT_SECRET_KEY) {
        throw new Error(
          "JWT secret key is not defined in environment variables"
        );
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Replace with your JWT secret key
      if (decoded && typeof decoded === "object" && "_doc" in decoded) {
        (req as AuthenticatedRequest).user = decoded["_doc"]; // Attach the decoded user information to the request object
      }

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token, authorization denied",
      });
    }
  }
};
export default authMiddleware;
