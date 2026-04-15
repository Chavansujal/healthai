import type { HealthRecord, HealthVitals } from "@/types/health";
import { localAgentDecision, localRiskPrediction } from "./agentRules";

const userId = "patient-demo-001";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function jitter(base: number, amount: number) {
  return base + (Math.random() * amount * 2 - amount);
}

export function createSimulatedVitals(previous?: HealthRecord): HealthVitals {
  const occasionalStress = Math.random() > 0.82;
  const previousSteps = previous?.steps ?? 3400;

  return {
    userId,
    source: "smartwatch-sim",
    heartRate: Math.round(clamp(jitter(occasionalStress ? 124 : 82, 14), 48, 148)),
    spo2: Math.round(clamp(jitter(occasionalStress ? 91 : 97, 2.5), 86, 100)),
    steps: Math.round(previousSteps + clamp(jitter(160, 120), 0, 380)),
    sleepHours: Number(clamp(jitter(occasionalStress ? 4.4 : 7.1, 0.8), 2, 9).toFixed(1)),
    temperature: Number(clamp(jitter(occasionalStress ? 38.1 : 36.8, 0.5), 35.5, 39.8).toFixed(1)),
    inactivityMinutes: Math.round(clamp(jitter(occasionalStress ? 205 : 52, 35), 0, 320)),
    timestamp: new Date().toISOString(),
  };
}

export function createLocalRecord(vitals: HealthVitals): HealthRecord {
  const mlPrediction = localRiskPrediction(vitals);
  const agentDecision = localAgentDecision(vitals, mlPrediction);

  return {
    ...vitals,
    _id: crypto.randomUUID(),
    mlPrediction,
    agentDecision,
  };
}

export function seedHealthRecords(count = 16): HealthRecord[] {
  const now = Date.now();
  const records: HealthRecord[] = [];

  for (let index = count - 1; index >= 0; index -= 1) {
    const previous = records[records.length - 1];
    const vitals = createSimulatedVitals(previous);
    vitals.timestamp = new Date(now - index * 15 * 60 * 1000).toISOString();
    records.push(createLocalRecord(vitals));
  }

  return records;
}
