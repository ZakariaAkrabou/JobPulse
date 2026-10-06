import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {getPreferences, updatePreferences,} from "../controllers/preferences.controller.js";

const router = Router();

router.get("/preferences", authenticate, getPreferences);
router.put("/preferences", authenticate, updatePreferences);

export default router;