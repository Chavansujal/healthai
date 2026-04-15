import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    healthDataId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthData" },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
    },
    status: {
      type: String,
      enum: ["open", "acknowledged", "resolved"],
      default: "open",
    },
    notifyCaregiver: { type: Boolean, default: false },
  },
  { timestamps: true }
);

alertSchema.index({ userId: 1, createdAt: -1 });

export const Alert = mongoose.model("Alert", alertSchema);
