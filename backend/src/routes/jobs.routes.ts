import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { manualFetch } from "../controllers/jobs.controller.js";

const router = Router();

router.post("/fetch", authenticate, manualFetch);

export default router;