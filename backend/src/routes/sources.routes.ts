import { Router } from "express";
import { deselectSource, getSources, selectSource, toggleSource } from "../controllers/sources.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/list",authenticate , getSources);

router.post("/:sourceId/select", authenticate, selectSource);

router.patch("/:sourceId", authenticate, toggleSource);

router.delete("/:sourceId/select", authenticate, deselectSource);

export default router;