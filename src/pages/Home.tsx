import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BellRing,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  Layers3,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const heroMetrics = [
  { label: "Live vitals channels", value: "12", tone: "text-primary" },
  { label: "Avg. response window", value: "2.8m", tone: "text-coral" },
  { label: "High-risk escalations", value: "99.2%", tone: "text-success" },
];

const outcomeStats = [
  {
    value: "24/7",
    title: "Continuous monitoring",
    description: "Signals keep flowing so care teams do not wait for manual follow-ups.",
    icon: Waves,
  },
  {
    value: "3x",
    title: "Faster escalation",
    description: "Agent workflows spot deterioration patterns before they turn into emergencies.",
    icon: Zap,
  },
  {
    value: "360°",
    title: "Unified patient view",
    description: "Check-ins, vitals, alerts, and outreach stay in one coordinated workspace.",
    icon: Layers3,
  },
  {
    value: "98%",
    title: "Action clarity",
    description: "Recommendations are paired with reasoning so teams can trust what happens next.",
    icon: ShieldCheck,
  },
];

const pillars = [
  {
    title: "Sense early",
    eyebrow: "Detection Layer",
    description:
      "Wearables, patient check-ins, and historical behavior combine into a live health signal instead of isolated readings.",
    icon: HeartPulse,
    accent: "from-primary/20 to-primary/5",
  },
  {
    title: "Decide clearly",
    eyebrow: "Reasoning Layer",
    description:
      "Risk scoring, anomaly detection, and explainable rules collaborate to recommend the next safest action.",
    icon: Brain,
    accent: "from-coral/20 to-coral/5",
  },
  {
    title: "Act instantly",
    eyebrow: "Execution Layer",
    description:
      "The right person gets the right alert with context, urgency, and a clear escalation path.",
    icon: BellRing,
    accent: "from-success/20 to-success/5",
  },
];

const experienceSteps = [
  {
    step: "01",
    title: "Collect",
    description: "Watch telemetry and patient input arrive in a single monitoring stream.",
  },
  {
    step: "02",
    title: "Interpret",
    description: "Agentic logic scores risk, flags anomalies, and explains the reasoning.",
  },
  {
    step: "03",
    title: "Coordinate",
    description: "Caregivers and clinicians see prioritized action instead of raw noise.",
  },
  {
    step: "04",
    title: "Respond",
    description: "Outreach and escalation happen faster, with less manual triage overhead.",
  },
];

const capabilities = [
  "Smartwatch-style live vitals simulation",
  "Risk-aware alert routing",
  "Caregiver and clinician escalation logic",
  "Patient self check-in workflow",
  "Explainable decision summaries",
  "Visual monitoring dashboard",
];

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

function FloatingSignal({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0], rotate: [0, 2, 0, -2, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
      className={cn(
        "absolute rounded-full border border-white/30 bg-white/50 backdrop-blur-xl shadow-lg",
        className
      )}
    />
  );
}

function MonitoringCard() {
  const bars = [62, 86, 54, 92, 74, 65, 98, 70, 56, 88, 60, 76];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.7 }}
      className="relative mx-auto w-full max-w-[560px] rounded-[32px] border border-white/50 bg-white/70 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl"
    >
      <div className="absolute inset-x-10 -top-8 h-20 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,250,249,0.94))] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <span className="h-2 w-2 rounded-full bg-success animate-live-dot" />
              Monitoring live
            </div>
            <h3 className="mt-4 text-xl font-bold text-foreground">
              Ward overview
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time signal quality, risk movement, and escalation readiness.
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 6, 0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          >
            <Activity className="h-6 w-6" />
          </motion.div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl bg-secondary p-4 text-secondary-foreground">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-secondary-foreground/70">
              <span>Vitals stream</span>
              <span>02:14 PM</span>
            </div>
            <div className="mt-6 flex items-end gap-2">
              {bars.map((bar, index) => (
                <motion.div
                  key={index}
                  className="w-full rounded-full bg-primary/70"
                  initial={{ height: 18 }}
                  animate={{ height: [`${Math.max(16, bar - 20)}px`, `${bar}px`, `${Math.max(20, bar - 8)}px`] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.08,
                  }}
                />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["84 bpm", "Heart rate"],
                ["97%", "SpO2"],
                ["Low", "Current risk"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-3">
                  <div className="text-lg font-bold">{value}</div>
                  <div className="text-xs text-secondary-foreground/70">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Agent action
                  </p>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    Clinician review suggested
                  </p>
                </div>
                <div className="rounded-2xl bg-coral/10 p-3 text-coral">
                  <BellRing className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Elevated temperature with reduced sleep trend over the last two windows.
              </p>
            </div>

            <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-success/10 p-3 text-success">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Decision confidence</p>
                  <p className="text-xs text-muted-foreground">Explanation attached to every action</p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-success"
                  initial={{ width: "44%" }}
                  animate={{ width: ["44%", "82%", "68%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_34%),radial-gradient(circle_at_80%_20%,hsl(var(--coral)/0.16),transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--accent)/0.35)_45%,hsl(var(--background)))]" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <FloatingSignal className="left-[6%] top-40 h-20 w-20" />
        <FloatingSignal className="right-[10%] top-56 h-12 w-12" delay={1.2} />
        <FloatingSignal className="bottom-24 left-[14%] h-16 w-16" delay={2.1} />

        <div className="container relative mx-auto px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.55 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl"
              >
                <Sparkles className="h-4 w-4" />
                Autonomous care coordination for modern monitoring teams
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="mt-6 max-w-3xl text-5xl font-extrabold leading-[0.94] text-foreground sm:text-6xl lg:text-7xl"
              >
                A more alive,
                <span className="gradient-text block">beautiful command center</span>
                for proactive patient care.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.7 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
              >
                Vitalguard turns watch signals, patient check-ins, and care team logic
                into a live clinical workflow that looks premium, feels responsive, and makes
                the next action obvious.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <Button variant="hero" size="xl" asChild>
                  <Link to="/dashboard">
                    Open Command Center
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/patient-checkin">Try Patient Check-in</Link>
                </Button>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="mt-10 grid gap-3 sm:grid-cols-3"
              >
                {heroMetrics.map((metric) => (
                  <motion.div
                    key={metric.label}
                    variants={sectionReveal}
                    className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl"
                  >
                    <div className={cn("text-2xl font-extrabold", metric.tone)}>{metric.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 2, 0, -2, 0], y: [0, -8, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 top-20 hidden rounded-3xl border border-border/60 bg-white/80 p-4 shadow-xl backdrop-blur-xl md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-success/10 p-3 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Low-risk patient</div>
                    <div className="text-xs text-muted-foreground">Routine outreach deferred</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: [0, -3, 0, 3, 0], y: [0, 8, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute -right-3 bottom-10 hidden rounded-3xl border border-border/60 bg-secondary p-4 text-secondary-foreground shadow-xl md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3 text-primary">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Escalation ETA 02:47</div>
                    <div className="text-xs text-secondary-foreground/70">
                      Clinician queue updated
                    </div>
                  </div>
                </div>
              </motion.div>

              <MonitoringCard />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/50 py-6 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-4 md:grid-cols-4"
          >
            {outcomeStats.map((stat) => (
              <motion.div
                key={stat.title}
                variants={sectionReveal}
                className="rounded-3xl border border-border/60 bg-background/80 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-extrabold text-foreground">{stat.value}</div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 text-base font-semibold text-foreground">{stat.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.08),transparent_28%),radial-gradient(circle_at_78%_30%,hsl(var(--info)/0.10),transparent_24%)]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary">
              <Brain className="h-4 w-4" />
              Built for signal, not noise
            </div>
            <h2 className="mt-5 text-4xl font-bold text-foreground sm:text-5xl">
              Three layers working together in one experience
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              The homepage now matches the product story: clinically calm, visually rich, and
              strongly animated without feeling chaotic.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14 grid gap-6 lg:grid-cols-3"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                variants={sectionReveal}
                className="animated-card overflow-hidden rounded-[28px] border border-border/60 bg-card/75 backdrop-blur-xl"
              >
                <div className={cn("h-2 bg-gradient-to-r", pillar.accent)} />
                <div className="p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {pillar.eyebrow}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold text-foreground">{pillar.title}</h3>
                    </div>
                    <motion.div
                      animate={{ y: [0, -4, 0], rotate: [0, 4, 0, -4, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.45,
                      }}
                      className="rounded-3xl bg-primary/10 p-4 text-primary"
                    >
                      <pillar.icon className="h-7 w-7" />
                    </motion.div>
                  </div>
                  <p className="mt-5 text-base leading-7 text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <Stethoscope className="h-4 w-4" />
                Product flow
              </div>
              <h2 className="mt-5 text-4xl font-bold text-foreground">
                From incoming vitals to coordinated action
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                This system is strongest when the interface tells the same story as the platform:
                collect signals, reason fast, and guide the response clearly.
              </p>

              <div className="mt-8 rounded-[28px] border border-border/60 bg-secondary p-6 text-secondary-foreground shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-secondary-foreground/70">
                      Included capabilities
                    </p>
                    <p className="mt-1 text-2xl font-bold">Prototype stack</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {capabilities.map((capability, index) => (
                    <motion.div
                      key={capability}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      <span className="text-sm">{capability}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="relative"
            >
              <div className="absolute left-6 top-6 bottom-6 hidden w-px bg-gradient-to-b from-primary via-border to-transparent md:block" />
              <div className="space-y-5">
                {experienceSteps.map((item, index) => (
                  <motion.div
                    key={item.step}
                    variants={sectionReveal}
                    className="relative rounded-[28px] border border-border/60 bg-card/80 p-6 backdrop-blur-xl"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{
                          duration: 3.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.25,
                        }}
                        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-extrabold text-primary-foreground"
                      >
                        {item.step}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                          <ChevronRight className="hidden h-5 w-5 text-muted-foreground sm:block" />
                        </div>
                        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--secondary))_0%,hsl(222_47%_11%)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_24%),radial-gradient(circle_at_85%_20%,rgba(251,146,60,0.16),transparent_22%)]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto max-w-4xl rounded-[36px] border border-white/10 bg-white/5 p-8 text-center text-secondary-foreground shadow-[0_28px_90px_rgba(2,6,23,0.38)] backdrop-blur-2xl sm:p-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Elevated landing experience
            </div>
            <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
              Explore the prototype with a homepage that finally feels premium
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-secondary-foreground/75">
              Open the dashboard, submit a patient check-in, or keep refining the visual system.
              The new homepage is stronger, more animated, and much closer to a polished product.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="coral" size="xl" asChild>
                <Link to="/dashboard">
                  Launch Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/about">See Platform Story</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
