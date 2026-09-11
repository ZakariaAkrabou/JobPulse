
import { Router } from "express";

import { register } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { refresh } from "../controllers/auth.controller.js";
import { me } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { profile } from "../controllers/auth.controller.js";
import { updateUserProfile } from "../controllers/auth.controller.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);
router.get("/profile", authenticate, profile);
router.put("/profile", authenticate, updateUserProfile);
export default router;

