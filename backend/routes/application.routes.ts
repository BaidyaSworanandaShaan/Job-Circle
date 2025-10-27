import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  applyForJob,
  getApplications,
  getApplicationsForSingleJob,
} from "../controllers/application.controller";

const router = Router();

router.post("/:jobId", authenticate, applyForJob);
router.get(
  "/:jobId",
  authenticate,
  authorize("ADMIN"),
  getApplicationsForSingleJob
);
router.get("/", authenticate, getApplications);

export default router;
