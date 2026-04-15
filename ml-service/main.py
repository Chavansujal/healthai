from typing import Optional

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


class HealthPayload(BaseModel):
    heartRate: float = Field(..., ge=25, le=240)
    spo2: float = Field(..., ge=50, le=100)
    steps: float = Field(..., ge=0)
    sleepHours: float = Field(..., ge=0, le=24)
    temperature: Optional[float] = Field(default=36.8, ge=30, le=45)
    inactivityMinutes: float = Field(..., ge=0)


app = FastAPI(title="Agentic AI Nurse ML Service", version="1.0.0")


def generate_training_data(seed: int = 42):
    rng = np.random.default_rng(seed)
    normal = np.column_stack(
        [
            rng.normal(78, 12, 600),
            rng.normal(97, 1.5, 600),
            rng.normal(5500, 2200, 600),
            rng.normal(7, 1.3, 600),
            rng.normal(36.8, 0.35, 600),
            rng.normal(70, 45, 600),
        ]
    )
    medium = np.column_stack(
        [
            rng.normal(104, 14, 300),
            rng.normal(93.5, 2.0, 300),
            rng.normal(2600, 1400, 300),
            rng.normal(5.2, 1.4, 300),
            rng.normal(37.5, 0.55, 300),
            rng.normal(150, 70, 300),
        ]
    )
    high = np.column_stack(
        [
            rng.normal(132, 18, 240),
            rng.normal(88.5, 3.5, 240),
            rng.normal(900, 800, 240),
            rng.normal(3.4, 1.2, 240),
            rng.normal(38.7, 0.9, 240),
            rng.normal(260, 90, 240),
        ]
    )

    x = np.vstack([normal, medium, high])
    x[:, 1] = np.clip(x[:, 1], 50, 100)
    x[:, 2] = np.clip(x[:, 2], 0, None)
    x[:, 3] = np.clip(x[:, 3], 0, 24)
    x[:, 4] = np.clip(x[:, 4], 30, 45)
    x[:, 5] = np.clip(x[:, 5], 0, None)
    y = np.array([0] * len(normal) + [1] * len(medium) + [2] * len(high))
    return x, y


def payload_to_features(payload: HealthPayload):
    return np.array(
        [
            [
                payload.heartRate,
                payload.spo2,
                payload.steps,
                payload.sleepHours,
                payload.temperature or 36.8,
                payload.inactivityMinutes,
            ]
        ]
    )


x_train, y_train = generate_training_data()
risk_model = Pipeline(
    [
        ("scaler", StandardScaler()),
        ("classifier", RandomForestClassifier(n_estimators=120, random_state=42)),
    ]
)
risk_model.fit(x_train, y_train)

anomaly_model = Pipeline(
    [
        ("scaler", StandardScaler()),
        ("isolation_forest", IsolationForest(contamination=0.08, random_state=42)),
    ]
)
anomaly_model.fit(x_train[y_train == 0])


@app.get("/health")
def health():
    return {"status": "ok", "service": "agentic-ai-nurse-ml"}


@app.post("/predict")
def predict(payload: HealthPayload):
    features = payload_to_features(payload)
    probabilities = risk_model.predict_proba(features)[0]
    class_index = int(np.argmax(probabilities))
    risk_labels = ["low", "medium", "high"]
    risk_score = float((probabilities[1] * 55) + (probabilities[2] * 100))
    anomaly = bool(anomaly_model.predict(features)[0] == -1)

    if anomaly and risk_score < 70:
        risk_score = min(100.0, risk_score + 20)
        class_index = max(class_index, 1)

    if risk_score >= 70:
        class_index = 2
    elif risk_score >= 35:
        class_index = 1
    else:
        class_index = 0

    return {
        "risk_level": risk_labels[class_index],
        "risk_score": round(risk_score, 2),
        "anomaly": anomaly,
        "model_version": "random-forest-isolation-forest-demo-v1",
        "probabilities": {
            "low": round(float(probabilities[0]), 4),
            "medium": round(float(probabilities[1]), 4),
            "high": round(float(probabilities[2]), 4),
        },
    }
