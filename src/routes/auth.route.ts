import express, { Request, Response } from "express";
import { AUTH_ROUTES } from "../enums/routes.enum";
import { handleAuthSignUp,handleAuthSignIn } from "../controllers/auth.controller";

const router = express.Router();

router.post(AUTH_ROUTES.SIGN_UP, handleAuthSignUp);
router.post(AUTH_ROUTES.SIGN_IN, handleAuthSignIn);

export default router;
