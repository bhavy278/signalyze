import { CorsOptions } from "cors";
export const CORS_OPTIONS: CorsOptions = {
  origin: ["http://localhost:3000", "https://your-frontend.com"],
  credentials: true,
};

export const RESULT_ENUM = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SERVER_ERROR: "SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
  EMAIL_EXISTS: "EMAIL_EXISTS",
};
