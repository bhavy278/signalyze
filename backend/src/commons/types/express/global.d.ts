// src/types/express.d.ts

import { Request } from "express";
import { DecodedUserType } from "../../commons/types/auth.types";
export interface AuthenticatedRequest extends Request {
  user?: DecodedUserType;
}

export {};
