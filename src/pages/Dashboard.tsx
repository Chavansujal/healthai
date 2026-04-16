import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  Brain,
  CheckCircle2,
  Clock,
  Footprints,
  HeartPulse,
  Radio,
  ShieldAlert,
  Smartphone,
  Stethoscope,
  Thermometer,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { fetchHealthHistory, postHealthData } from "@/lib/healthApi";
import { createLocalRecord, createSimulatedVitals, seedHealthRecords } from "@/lib/smartwatchSimulator";
import type { AgentAlert, HealthRecord, HealthVitals } from "@/types/health";

const demoUserId = "patient-demo-001";

const defaultForm = {
  heartRate: "84",
  spo2: "97",
  steps: "4200",
  sleepHours: "7.1",
  temperature: "36.8",
  inactivityMinutes: "45",
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const sectionTransition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
};

function riskColor(level: HealthRecord["mlPrediction"]["riskLevel"]) {
  if (level === "high") return "text-destructive bg-destructive/10 border-destructive/20";
  if (level === "medium") return "text-warning bg-warning/10 border-warning/20";
  return "text-success bg-success/10 border-success/20";
}

function alertColor(severity: AgentAlert["severity"]) {
  if (severity === "critical") return "bg-destructive/10 text-destructive border-destructive/20";
  if (severity === "warning") return "bg-warning/10 text-warning border-warning/20";
  return "bg-info/10 text-info border-info/20";
}

function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function getChartData(records: HealthRecord[]) {
  return records.slice(-18).map((record) => ({
    time: formatTime(record.timestamp),
    heartRate: record.heartRate,
    spo2: record.spo2,
    risk: record.mlPrediction.riskScore,
    inactivity: record.inactivityMinutes,
    steps: record.steps,
  }));
}

function SignalWave({ active }: { active: boolean }) {
  return (
    <div className="relative h-16 w-36 overflow-hidden rounded-2xl border border-primary/20 bg-background/70">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <motion.div
        className="absolute left-0 top-1/2 h-0.5 w-full bg-primary"
        animate={{ x: active ? ["-100%", "100%"] : "0%" }}
        transition={{ duration: 2.2, repeat: active ? Infinity : 0, ease: "linear" }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 144 64" aria-hidden="true">
        <motion.path
          d="M0 34 C12 34 12 20 24 20 S36 48 48 48 S60 16 72 16 S84 46 96 46 S108 28 120 28 S132 34 144 34"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: active ? [0.2, 1, 0.2] : 0.55, opacity: active ? [0.45, 1, 0.45] : 0.45 }}
          transition={{ duration: 2.8, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute right-3 top-3 flex items-center gap-1">
        <span className={cn("h-2 w-2 rounded-full", active ? "bg-success animate-live-dot" : "bg-muted-foreground")} />
        <span className="text-[10px] font-bold uppercase text-muted-foreground">
          {active ? "Sync" : "Hold"}
        </span>
      </div>
    </div>
  );
}

function RiskGauge({ score, level }: { score: number; level: HealthRecord["mlPrediction"]["riskLevel"] }) {
  const circumference = 2 * Math.PI * 42;
  const progress = circumference - (score / 100) * circumference;
  const stroke = level === "high" ? "hsl(var(--destructive))" : level === "medium" ? "hsl(var(--warning))" : "hsl(var(--success))";

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="9" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={stroke}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        />
      </svg>
      <motion.div
        key={score}
        initial={{ scale: 0.86, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
      >
        <span className="text-3xl font-extrabold text-foreground">{score}</span>
        <span className="text-xs font-bold uppercase text-muted-foreground">Risk</span>
      </motion.div>
    </div>
  );
}

function VitalsTile({
  icon: Icon,
  label,
  value,
  helper,
  accent,
  delay = 0,
}: {
  icon: typeof HeartPulse;
  label: string;
  value: string;
  helper: string;
  accent: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ ...sectionTransition, delay }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="animated-card glass-card p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <motion.div
          className={cn("h-11 w-11 rounded-xl flex items-center justify-center", accent)}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success animate-live-dot" />
          Live
        </span>
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 text-3xl font-bold text-foreground"
      >
        {value}
      </motion.div>
      <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
      <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", accent.replace("/10", ""))}
          initial={{ width: "20%" }}
          animate={{ width: ["35%", "72%", "46%"] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay }}
        />
      </div>
    </motion.div>
  );
}

function EscalationChip({ active, label }: { active: boolean; label: string }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      className={cn(
        "rounded-lg p-2",
        active ? "bg-coral/10 text-coral shadow-sm" : "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </motion.div>
  );
}

export default function Dashboard() {
  const [records, setRecords] = useState<HealthRecord[]>(() => seedHealthRecords());
  const [streaming, setStreaming] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const latest = records[records.length - 1];
  const chartData = useMemo(() => getChartData(records), [records]);
  const alerts = useMemo(
    () =>
      records
        .flatMap((record) =>
          record.agentDecision.alerts.map((alert) => ({
            ...alert,
            timestamp: record.timestamp,
          }))
        )
        .slice(-6)
        .reverse(),
    [records]
  );

  async function ingestVitals(vitals: HealthVitals) {
    const localRecord = createLocalRecord(vitals);
    setRecords((current) => [...current.slice(-39), localRecord]);

    try {
      const serverRecord = await postHealthData(vitals);
      setApiOnline(true);
      setRecords((current) =>
        [...current.filter((record) => record._id !== localRecord._id), serverRecord]
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .slice(-40)
      );
    } catch {
      setApiOnline(false);
    }
  }

  useEffect(() => {
    fetchHealthHistory(demoUserId)
      .then((history) => {
        if (history.length > 0) {
          setRecords(history.slice(-40));
          setApiOnline(true);
        }
      })
      .catch(() => setApiOnline(false));
  }, []);

  useEffect(() => {
    if (!streaming) return undefined;

    const timer = window.setInterval(() => {
      const nextVitals = createSimulatedVitals(records[records.length - 1]);
      void ingestVitals(nextVitals);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [records, streaming]);

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    await ingestVitals({
      userId: demoUserId,
      source: "manual",
      heartRate: Number(form.heartRate),
      spo2: Number(form.spo2),
      steps: Number(form.steps),
      sleepHours: Number(form.sleepHours),
      temperature: form.temperature ? Number(form.temperature) : undefined,
      inactivityMinutes: Number(form.inactivityMinutes),
      timestamp: new Date().toISOString(),
    });

    setSaving(false);
  }

  return (
    <Layout showFooter={false}>
      <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,hsl(var(--primary)/0.12),transparent)]" />
        <section className="relative border-b border-border bg-card/90 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={sectionTransition}>
                <motion.div
                  className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1 text-sm font-semibold text-primary"
                  animate={{ boxShadow: ["0 0 0 hsl(var(--primary)/0)", "0 0 24px hsl(var(--primary)/0.22)", "0 0 0 hsl(var(--primary)/0)"] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                >
                  <Smartphone className="h-4 w-4" />
                  Smartwatch monitoring workspace
                </motion.div>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                  Vitalguard Command Center
                </h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">
                  Simulated wearable data flows into risk prediction, anomaly detection, and an
                  agentic escalation engine for proactive care.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...sectionTransition, delay: 0.1 }}
                className="flex flex-wrap items-center gap-3"
              >
                <SignalWave active={streaming} />
                <motion.div
                  layout
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold",
                    apiOnline
                      ? "border-success/20 bg-success/10 text-success"
                      : "border-warning/20 bg-warning/10 text-warning"
                  )}
                >
                  {apiOnline ? <Wifi className="h-4 w-4 animate-bounce-gentle" /> : <WifiOff className="h-4 w-4" />}
                  {apiOnline ? "Mongo API online" : "Local demo mode"}
                </motion.div>
                <Button variant={streaming ? "coral" : "outline"} onClick={() => setStreaming((value) => !value)}>
                  <Radio className="h-4 w-4" />
                  {streaming ? "Pause Stream" : "Start Stream"}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container relative mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <VitalsTile
              icon={HeartPulse}
              label="Heart Rate"
              value={`${latest.heartRate} bpm`}
              helper="Continuous pulse from smartwatch simulation"
              accent="bg-destructive/10 text-destructive"
              delay={0}
            />
            <VitalsTile
              icon={Activity}
              label="SpO2"
              value={`${latest.spo2}%`}
              helper="Oxygen saturation trend"
              accent="bg-info/10 text-info"
              delay={0.06}
            />
            <VitalsTile
              icon={Footprints}
              label="Steps"
              value={latest.steps.toLocaleString()}
              helper={`${latest.inactivityMinutes} min inactive`}
              accent="bg-primary/10 text-primary"
              delay={0.12}
            />
            <VitalsTile
              icon={Thermometer}
              label="Sleep"
              value={`${latest.sleepHours}h`}
              helper={`${latest.temperature ?? "--"} C body temperature`}
              accent="bg-secondary/10 text-secondary"
              delay={0.18}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ ...sectionTransition, delay: 0.2 }}
              className="animated-card glass-card p-5"
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Live Vitals Stream</h2>
                  <p className="text-sm text-muted-foreground">
                    Heart rate, SpO2, and risk score update every few seconds.
                  </p>
                </div>
                <motion.div
                  key={`${latest.mlPrediction.riskLevel}-${latest.mlPrediction.riskScore}`}
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn("rounded-xl border px-4 py-2 text-sm font-bold", riskColor(latest.mlPrediction.riskLevel))}
                >
                  {latest.mlPrediction.riskLevel.toUpperCase()} RISK {latest.mlPrediction.riskScore}/100
                </motion.div>
              </div>

              <div className="relative h-[330px] overflow-hidden rounded-xl">
                <div className="pointer-events-none absolute inset-0 z-10 animate-scan-line bg-[linear-gradient(180deg,transparent,hsl(var(--primary)/0.08),transparent)]" />
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="spo2" name="SpO2" stroke="hsl(var(--info))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="risk" name="Risk Score" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ ...sectionTransition, delay: 0.28 }}
              className="animated-card glass-card p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                >
                  <Brain className="h-5 w-5" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Agent Decision</h2>
                  <p className="text-sm text-muted-foreground">Rules plus ML output</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className={cn("rounded-xl border p-4 text-center", riskColor(latest.mlPrediction.riskLevel))}>
                  <RiskGauge score={latest.mlPrediction.riskScore} level={latest.mlPrediction.riskLevel} />
                  <motion.div
                    key={latest.mlPrediction.riskLevel}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-3xl font-bold capitalize"
                  >
                    {latest.mlPrediction.riskLevel}
                  </motion.div>
                  <p className="mt-2 text-sm">Model: {latest.mlPrediction.modelVersion || "ml-service"}</p>
                </div>

                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShieldAlert className="h-4 w-4 text-coral" />
                    Escalation
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                    <EscalationChip active={latest.agentDecision.escalation.notifyCaregiver} label="Caregiver" />
                    <EscalationChip active={latest.agentDecision.escalation.notifyClinician} label="Clinician" />
                    <EscalationChip active={latest.agentDecision.escalation.emergencyFlag} label="Emergency" />
                  </div>
                </div>

                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {latest.agentDecision.recommendations.map((item) => (
                    <motion.div
                      key={item}
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="flex items-start gap-2 rounded-xl bg-success/5 p-3 text-sm text-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <motion.form
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ ...sectionTransition, delay: 0.34 }}
              onSubmit={handleManualSubmit}
              className="animated-card glass-card p-5"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold text-foreground">Manual Vitals Input</h2>
                <p className="text-sm text-muted-foreground">
                  Use this while real smartwatch integrations are pending.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["heartRate", "Heart rate", "bpm"],
                  ["spo2", "SpO2", "%"],
                  ["steps", "Steps", "count"],
                  ["sleepHours", "Sleep hours", "hours"],
                  ["temperature", "Temperature", "C"],
                  ["inactivityMinutes", "Inactivity", "minutes"],
                ].map(([name, label, suffix]) => (
                  <motion.label
                    key={name}
                    className="space-y-2"
                    whileFocusWithin={{ scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    <div className="relative">
                      <Input
                        value={form[name as keyof typeof form]}
                        type="number"
                        step={name === "sleepHours" || name === "temperature" ? "0.1" : "1"}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [name]: event.target.value,
                          }))
                        }
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        {suffix}
                      </span>
                    </div>
                  </motion.label>
                ))}
              </div>

              <Button className="mt-5 w-full" type="submit" disabled={saving}>
                <Stethoscope className={cn("h-4 w-4", saving && "animate-spin")} />
                {saving ? "Analyzing..." : "Submit Vitals"}
              </Button>
            </motion.form>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ ...sectionTransition, delay: 0.4 }}
              className="animated-card glass-card p-5"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Alerts Panel</h2>
                  <p className="text-sm text-muted-foreground">
                    UI alerts and simulated caregiver notifications.
                  </p>
                </div>
                <motion.div
                  animate={alerts.length > 0 ? { rotate: [0, -8, 8, -6, 6, 0] } : { rotate: 0 }}
                  transition={{ duration: 1.4, repeat: alerts.length > 0 ? Infinity : 0, repeatDelay: 1.2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral"
                >
                  <Bell className="h-5 w-5" />
                </motion.div>
              </div>

              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-success/20 bg-success/10 p-4 text-sm font-medium text-success"
                  >
                    No active alerts. Patient is in routine monitoring.
                  </motion.div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {alerts.map((alertItem, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 24, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -24, scale: 0.98 }}
                      transition={{ ...sectionTransition, delay: index * 0.03 }}
                      key={`${alertItem.timestamp}-${alertItem.type}-${index}`}
                      className={cn("rounded-xl border p-4", alertColor(alertItem.severity))}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          animate={{ scale: [1, 1.12, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-bold">{alertItem.title}</h3>
                            <span className="text-xs font-semibold">{formatTime(alertItem.timestamp)}</span>
                          </div>
                          <p className="mt-1 text-sm">{alertItem.message}</p>
                          {alertItem.notifyCaregiver && (
                            <p className="mt-2 text-xs font-semibold">
                              SMS/email notification simulated for caregiver.
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...sectionTransition, delay: 0.46 }}
            className="animated-card glass-card p-5"
          >
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Patient History Graph</h2>
                <p className="text-sm text-muted-foreground">
                  Activity and inactivity help the agent understand deterioration context.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last {chartData.length} readings
              </div>
            </div>

            <div className="relative h-[300px] overflow-hidden rounded-xl">
              <div className="pointer-events-none absolute inset-0 z-10 animate-scan-line bg-[linear-gradient(180deg,transparent,hsl(var(--info)/0.08),transparent)]" />
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="steps" name="Steps" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.16)" strokeWidth={2} />
                  <Area type="monotone" dataKey="inactivity" name="Inactive Minutes" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.16)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
