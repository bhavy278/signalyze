import express, { Request, Response } from "express";
import { register, login } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

const AuthRoutes = router;
export default AuthRoutes;
