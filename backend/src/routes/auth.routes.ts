
import { Router } from "express";

import { register } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { refresh } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { profile } from "../controllers/auth.controller.js";
import { updateUserProfile } from "../controllers/auth.controller.js";
import {
	loginSchema,
	refreshSchema,
	registerSchema,
	updateProfileSchema,
	validate,
} from "../validators/auth.validator.js";


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.get("/profile", authenticate, profile);
router.put("/profile", authenticate, validate(updateProfileSchema),updateUserProfile,
);
export default router;

