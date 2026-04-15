import mongoose from "mongoose";

const healthDataSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    source: {
      type: String,
      enum: ["manual", "smartwatch-sim"],
      default: "manual",
    },
    heartRate: { type: Number, required: true, min: 25, max: 240 },
    spo2: { type: Number, required: true, min: 50, max: 100 },
    steps: { type: Number, required: true, min: 0 },
    sleepHours: { type: Number, required: true, min: 0, max: 24 },
    temperature: { type: Number, min: 30, max: 45 },
    inactivityMinutes: { type: Number, required: true, min: 0 },
    mlPrediction: {
      riskLevel: { type: String, enum: ["low", "medium", "high"], default: "low" },
      riskScore: { type: Number, default: 0 },
      anomaly: { type: Boolean, default: false },
      modelVersion: { type: String, default: "fallback-rules-v1" },
    },
    agentDecision: {
      priority: { type: String, enum: ["routine", "watch", "urgent", "emergency"], default: "routine" },
      alerts: [
        {
          type: String,
          title: String,
          message: String,
          severity: String,
          notifyCaregiver: Boolean,
        },
      ],
      recommendations: [String],
      escalation: {
        notifyCaregiver: { type: Boolean, default: false },
        notifyClinician: { type: Boolean, default: false },
        emergencyFlag: { type: Boolean, default: false },
      },
    },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

healthDataSchema.index({ userId: 1, timestamp: -1 });

export const HealthData = mongoose.model("HealthData", healthDataSchema);
