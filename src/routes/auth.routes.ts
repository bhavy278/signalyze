import express, { Request, Response } from "express";
import { register,login } from "../controllers/auth.controller";

const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);

export default routes;
