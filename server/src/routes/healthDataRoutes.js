import { Router } from "express";
import {
  createHealthData,
  getHealthDataHistory,
  getRiskScore,
} from "../controllers/healthDataController.js";

const router = Router();

router.post("/health-data", createHealthData);
router.get("/health-data/:userId", getHealthDataHistory);
router.get("/risk-score/:userId", getRiskScore);

export default router;
