import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getMatches } from "../controllers/matches.controller.js";

const router = Router();

router.get("/all", authenticate, getMatches);

export default router;