import Router from "express";

import { register, login, verifyEmail, forgotPassword, resetPassword,getMe, } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getMe);

export default router;
