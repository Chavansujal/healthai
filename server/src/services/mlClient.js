import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8001";

function fallbackPrediction(vitals) {
  let score = 0;

  if (vitals.heartRate > 120 || vitals.heartRate < 50) score += 35;
  if (vitals.spo2 < 92) score += 35;
  if (vitals.temperature && (vitals.temperature > 38.5 || vitals.temperature < 35.5)) score += 20;
  if (vitals.inactivityMinutes > 180) score += 15;
  if (vitals.sleepHours < 4) score += 10;

  const riskScore = Math.min(100, score);
  const riskLevel = riskScore >= 70 ? "high" : riskScore >= 35 ? "medium" : "low";

  return {
    riskLevel,
    riskScore,
    anomaly: riskScore >= 70,
    modelVersion: "fallback-rules-v1",
  };
}

export async function predictRisk(vitals) {
  try {
    const { data } = await axios.post(`${ML_SERVICE_URL}/predict`, vitals, {
      timeout: 2500,
    });

    return {
      riskLevel: data.risk_level,
      riskScore: Math.round(data.risk_score),
      anomaly: Boolean(data.anomaly),
      modelVersion: data.model_version || "ml-service",
    };
  } catch (error) {
    console.warn(`ML service unavailable, using fallback prediction: ${error.message}`);
    return fallbackPrediction(vitals);
  }
}
