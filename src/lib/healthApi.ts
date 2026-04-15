import type { HealthRecord, HealthVitals } from "@/types/health";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function postHealthData(vitals: HealthVitals): Promise<HealthRecord> {
  const response = await fetch(`${API_BASE_URL}/health-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vitals),
  });

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }

  const payload = await response.json();
  return payload.record;
}

export async function fetchHealthHistory(userId: string): Promise<HealthRecord[]> {
  const response = await fetch(`${API_BASE_URL}/health-data/${userId}`);

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }

  return response.json();
}
