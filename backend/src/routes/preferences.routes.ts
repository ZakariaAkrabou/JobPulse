import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {getPreferences, updatePreferences,} from "../controllers/preferences.controller.js";

const router = Router();

router.get("/all", authenticate, getPreferences);
router.put("/set", authenticate, updatePreferences);

export default router;