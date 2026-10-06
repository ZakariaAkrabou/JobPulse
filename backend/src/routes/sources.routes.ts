import { Router } from "express";
import { getSources } from "../controllers/sources.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/list",authenticate , getSources);
router.get("/", authenticate, getSources);

export default router;