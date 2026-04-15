import { Alert } from "../models/Alert.js";
import { HealthData } from "../models/HealthData.js";
import { evaluatePatientState } from "../services/agentDecisionEngine.js";
import { predictRisk } from "../services/mlClient.js";
import { simulateNotification } from "../services/notificationService.js";

function normalizeVitals(body) {
  return {
    userId: body.userId,
    source: body.source || "manual",
    heartRate: Number(body.heartRate),
    spo2: Number(body.spo2),
    steps: Number(body.steps),
    sleepHours: Number(body.sleepHours),
    temperature: body.temperature === undefined || body.temperature === "" ? undefined : Number(body.temperature),
    inactivityMinutes: Number(body.inactivityMinutes),
    timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
  };
}

function validateVitals(vitals) {
  const required = ["userId", "heartRate", "spo2", "steps", "sleepHours", "inactivityMinutes"];
  const missing = required.filter((key) => vitals[key] === undefined || vitals[key] === "" || Number.isNaN(vitals[key]));

  if (missing.length > 0) {
    return `Missing or invalid fields: ${missing.join(", ")}`;
  }

  return null;
}

export async function createHealthData(req, res, next) {
  try {
    const vitals = normalizeVitals(req.body);
    const validationError = validateVitals(vitals);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const mlPrediction = await predictRisk(vitals);
    const agentDecision = evaluatePatientState({
      vitals,
      mlPrediction,
      lastSeenAt: vitals.timestamp,
    });

    const record = await HealthData.create({
      ...vitals,
      mlPrediction,
      agentDecision,
    });

    const alertDocs = await Alert.insertMany(
      agentDecision.alerts.map((alert) => ({
        ...alert,
        userId: vitals.userId,
        healthDataId: record._id,
      })),
      { ordered: false }
    ).catch(() => []);

    const notification = await simulateNotification({
      userId: vitals.userId,
      alerts: agentDecision.alerts,
    });

    return res.status(201).json({ record, alerts: alertDocs, notification });
  } catch (error) {
    return next(error);
  }
}

export async function getHealthDataHistory(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const records = await HealthData.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return res.json(records.reverse());
  } catch (error) {
    return next(error);
  }
}

export async function getRiskScore(req, res, next) {
  try {
    const latest = await HealthData.findOne({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .lean();

    if (!latest) {
      return res.status(404).json({ message: "No health data found for this user." });
    }

    const mlPrediction = await predictRisk(latest);
    const agentDecision = evaluatePatientState({
      vitals: latest,
      mlPrediction,
      lastSeenAt: latest.timestamp,
    });

    return res.json({
      userId: req.params.userId,
      timestamp: latest.timestamp,
      mlPrediction,
      agentDecision,
    });
  } catch (error) {
    return next(error);
  }
}
