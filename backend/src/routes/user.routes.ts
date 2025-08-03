import express from "express";
import {
  getLoggedInUserEmail,
  getLoggedInUserInfo,
  updatePassword,
} from "../controllers/user.controllers";

const router = express.Router();

router.get("/me/email", getLoggedInUserEmail);
router.get("/me", getLoggedInUserInfo);
router.get("/me/update-password", updatePassword);

const UserRoutes = router;
export default UserRoutes;
