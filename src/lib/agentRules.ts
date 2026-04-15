import type { AgentAlert, AgentDecision, HealthVitals, MlPrediction } from "@/types/health";

function alert(
  type: string,
  title: string,
  message: string,
  severity: AgentAlert["severity"],
  notifyCaregiver = false
): AgentAlert {
  return { type, title, message, severity, notifyCaregiver };
}

export function localRiskPrediction(vitals: HealthVitals): MlPrediction {
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
    modelVersion: "frontend-demo-rules-v1",
  };
}

export function localAgentDecision(vitals: HealthVitals, mlPrediction: MlPrediction): AgentDecision {
  const alerts: AgentAlert[] = [];
  const recommendations = new Set<string>();
  const escalation = {
    notifyCaregiver: false,
    notifyClinician: false,
    emergencyFlag: false,
  };

  if (mlPrediction.riskLevel === "high") {
    alerts.push(
      alert(
        "HIGH_RISK",
        "High Risk Detected",
        `Risk score reached ${mlPrediction.riskScore}/100.`,
        "critical",
        true
      )
    );
    recommendations.add("Start nurse outreach and request a same-day clinical review.");
    escalation.notifyCaregiver = true;
    escalation.notifyClinician = true;
  }

  if (vitals.inactivityMinutes > 180) {
    alerts.push(
      alert(
        "INACTIVITY",
        "No Activity Detected",
        "Extended inactivity detected by smartwatch simulation.",
        "warning",
        true
      )
    );
    recommendations.add("Check patient device status and ask for a brief movement confirmation.");
    escalation.notifyCaregiver = true;
  }

  if (vitals.spo2 < 90 || vitals.heartRate > 130 || vitals.heartRate < 45 || mlPrediction.anomaly) {
    alerts.push(
      alert(
        "EMERGENCY",
        "Emergency Condition",
        "Abnormal vital pattern requires immediate verification.",
        "critical",
        true
      )
    );
    recommendations.add("Escalate to caregiver and clinician immediately.");
    escalation.notifyCaregiver = true;
    escalation.notifyClinician = true;
    escalation.emergencyFlag = true;
  }

  if (vitals.spo2 < 94) recommendations.add("Rest upright and recheck SpO2 in five minutes.");
  if (vitals.temperature && vitals.temperature > 38) recommendations.add("Hydrate and monitor fever trend.");
  if (vitals.sleepHours < 5) recommendations.add("Prioritize rest and review sleep disruption.");
  if (recommendations.size === 0) recommendations.add("Continue routine monitoring.");

  const priority = escalation.emergencyFlag
    ? "emergency"
    : escalation.notifyClinician
    ? "urgent"
    : alerts.length
    ? "watch"
    : "routine";

  return {
    priority,
    alerts,
    recommendations: Array.from(recommendations),
    escalation,
  };
}
