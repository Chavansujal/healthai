export type RiskLevel = "low" | "medium" | "high";
export type AlertSeverity = "info" | "warning" | "critical";
export type DataSource = "manual" | "smartwatch-sim";

export interface HealthVitals {
  userId: string;
  source: DataSource;
  heartRate: number;
  spo2: number;
  steps: number;
  sleepHours: number;
  temperature?: number;
  inactivityMinutes: number;
  timestamp: string;
}

export interface MlPrediction {
  riskLevel: RiskLevel;
  riskScore: number;
  anomaly: boolean;
  modelVersion?: string;
}

export interface AgentAlert {
  type: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  notifyCaregiver: boolean;
}

export interface AgentDecision {
  priority: "routine" | "watch" | "urgent" | "emergency";
  alerts: AgentAlert[];
  recommendations: string[];
  escalation: {
    notifyCaregiver: boolean;
    notifyClinician: boolean;
    emergencyFlag: boolean;
  };
}

export interface HealthRecord extends HealthVitals {
  _id?: string;
  mlPrediction: MlPrediction;
  agentDecision: AgentDecision;
}
