const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function createAlert(type, title, message, severity = "warning", notifyCaregiver = false) {
  return { type, title, message, severity, notifyCaregiver };
}

export function evaluatePatientState({ vitals, mlPrediction, lastSeenAt = new Date() }) {
  const alerts = [];
  const recommendations = new Set();
  const escalation = {
    notifyCaregiver: false,
    notifyClinician: false,
    emergencyFlag: false,
  };

  if (Date.now() - new Date(lastSeenAt).getTime() > TWO_HOURS_MS) {
    alerts.push(
      createAlert(
        "INACTIVITY",
        "No Activity Detected",
        "No smartwatch data has been received for more than two hours.",
        "warning",
        true
      )
    );
    recommendations.add("Ask the patient to confirm device battery and connectivity.");
    escalation.notifyCaregiver = true;
  }

  if (mlPrediction.riskLevel === "high") {
    alerts.push(
      createAlert(
        "HIGH_RISK",
        "High Risk Detected",
        `ML model scored this patient at ${mlPrediction.riskScore}/100.`,
        "critical",
        true
      )
    );
    recommendations.add("Start a nurse call and schedule same-day clinical review.");
    escalation.notifyCaregiver = true;
    escalation.notifyClinician = true;
  }

  const abnormalVitals = [];
  if (vitals.heartRate > 130 || vitals.heartRate < 45) abnormalVitals.push("heart rate");
  if (vitals.spo2 < 90) abnormalVitals.push("SpO2");
  if (vitals.temperature && (vitals.temperature > 39 || vitals.temperature < 35)) abnormalVitals.push("temperature");

  if (abnormalVitals.length > 0 || mlPrediction.anomaly) {
    alerts.push(
      createAlert(
        "EMERGENCY",
        "Emergency Condition",
        `Abnormal ${abnormalVitals.join(", ") || "multi-vital pattern"} detected.`,
        "critical",
        true
      )
    );
    recommendations.add("Escalate immediately and verify symptoms by phone.");
    escalation.notifyCaregiver = true;
    escalation.notifyClinician = true;
    escalation.emergencyFlag = vitals.spo2 < 88 || vitals.heartRate > 145 || mlPrediction.anomaly;
  }

  if (vitals.spo2 < 94) recommendations.add("Practice slow breathing and recheck oxygen saturation.");
  if (vitals.inactivityMinutes > 120) recommendations.add("Take a short supervised walk if clinically safe.");
  if (vitals.sleepHours < 5) recommendations.add("Prioritize rest and review sleep disruption triggers.");
  if (vitals.temperature && vitals.temperature > 38) recommendations.add("Hydrate and monitor fever trend.");
  if (recommendations.size === 0) recommendations.add("Continue routine monitoring.");

  const priority = escalation.emergencyFlag
    ? "emergency"
    : escalation.notifyClinician
    ? "urgent"
    : alerts.length > 0
    ? "watch"
    : "routine";

  return {
    priority,
    alerts,
    recommendations: Array.from(recommendations),
    escalation,
  };
}
