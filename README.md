# Vitalguard

Vitalguard is a full-stack healthcare monitoring prototype that combines smartwatch-style vitals, MongoDB persistence, machine-learning risk prediction, anomaly detection, and a modular agent decision engine.

## System Flow

```text
Smartwatch simulation / manual input
  -> React dashboard
  -> Node.js + Express API
  -> MongoDB time-series-style health records
  -> Python FastAPI ML service
  -> Agent decision engine
  -> Dashboard alerts + simulated SMS/email escalation
```

The React app works in local demo mode even when the backend is offline. When the API, MongoDB, and ML service are running, dashboard submissions are persisted and enriched with model predictions.

## Features

- Manual vitals input for heart rate, SpO2, steps, sleep hours, temperature, and inactivity.
- Simulated real-time smartwatch stream on the dashboard.
- MongoDB health records with timestamps and source labels.
- REST API:
  - `POST /api/health-data`
  - `GET /api/health-data/:userId`
  - `GET /api/risk-score/:userId`
- Python FastAPI ML service with Random Forest risk prediction and Isolation Forest anomaly detection.
- Agentic decision engine for high-risk alerts, inactivity alerts, emergency flags, recommendations, and caregiver escalation.
- Modern React dashboard with charts, alert panel, risk display, and patient history graph.

## Folder Structure

```text
src/
  lib/
    agentRules.ts              # frontend fallback rules for offline demos
    healthApi.ts               # React -> Express API client
    smartwatchSimulator.ts     # smartwatch-style vitals generator
  pages/
    Dashboard.tsx              # command center UI
  types/
    health.ts                  # shared frontend health types

server/
  src/
    app.js                     # Express app entry
    config/db.js               # MongoDB connection
    controllers/               # API request handlers
    models/                    # Mongoose schemas
    routes/                    # REST routes
    services/
      agentDecisionEngine.js   # modular rule-based agent
      mlClient.js              # Node -> Python ML API client
      notificationService.js   # simulated SMS/email routing

ml-service/
  main.py                      # FastAPI ML service
  requirements.txt             # Python dependencies
```

## Run Locally

Install Node dependencies:

```sh
npm install
```

Start MongoDB locally, then configure the backend:

```sh
copy server\.env.example server\.env
```

Start the Python ML service:

```sh
cd ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Start the Node API in a second terminal:

```sh
npm run server
```

Start the React app in a third terminal:

```sh
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`, and go to `/dashboard`.

## API Payload Example

```json
{
  "userId": "patient-demo-001",
  "source": "manual",
  "heartRate": 118,
  "spo2": 91,
  "steps": 1200,
  "sleepHours": 4.5,
  "temperature": 38.2,
  "inactivityMinutes": 190
}
```

## Production-Level Improvements

1. Add authentication, role-based access, and audit logging for clinicians, caregivers, and patients.
2. Move vitals ingestion to WebSockets or MQTT for true device streaming.
3. Use MongoDB time-series collections or a dedicated time-series database for high-volume wearable data.
4. Replace synthetic ML training with clinically reviewed datasets and model monitoring.
5. Add alert deduplication, acknowledgement workflows, and SLA timers.
6. Integrate Twilio/SendGrid for real notifications after consent and compliance review.
7. Add HIPAA-ready controls: encryption, access logs, retention policies, and PHI minimization.
8. Containerize React, Node, MongoDB, and FastAPI with Docker Compose.
9. Add CI checks for frontend build, backend tests, Python tests, and dependency scanning.

This project is a clinical decision-support prototype, not a medical device. Real deployment requires clinician validation, privacy review, and regulatory assessment.
