import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadResume as uploadResumeMiddleware } from "../middleware/upload.middleware.js";
import { getProfile, updateProfile,uploadResume,changePassword,parseResume} from "../controllers/profile.controller.js";

const router = Router();

router.get("/profile", authenticate, getProfile);
router.put("/update-profile", authenticate, updateProfile);
router.put("/profile/change-password", authenticate, changePassword);


router.post("/profile/resume", authenticate,uploadResumeMiddleware,uploadResume,);
router.post("/profile/resume/parse", authenticate, parseResume);



export default router;