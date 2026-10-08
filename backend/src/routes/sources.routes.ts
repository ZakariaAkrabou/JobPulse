import { Router } from "express";
import { getSources, selectSource } from "../controllers/sources.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/list",authenticate , getSources);

router.post("/:sourceId/select", authenticate, selectSource);

export default router;