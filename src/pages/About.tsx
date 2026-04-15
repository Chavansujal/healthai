import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Cpu,
  Network,
  Zap,
  Shield,
  GitBranch,
  Server,
  MessageSquare,
  Database,
  ArrowRight,
  CheckCircle2,
  Clock,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const agenticFeatures = [
  {
    icon: Brain,
    title: "Autonomous Decision Making",
    description:
      "AI agents independently analyze patient data, identify risks, and initiate appropriate care pathways without constant human oversight.",
  },
  {
    icon: Network,
    title: "Multi-Agent Coordination",
    description:
      "Multiple specialized agents work together—monitoring agents detect anomalies, triage agents prioritize cases, and communication agents coordinate outreach.",
  },
  {
    icon: Zap,
    title: "Real-time Adaptation",
    description:
      "Agents continuously learn from outcomes and feedback, improving their predictions and recommendations over time.",
  },
  {
    icon: Shield,
    title: "Explainable Actions",
    description:
      "Every autonomous decision comes with clear reasoning, ensuring clinicians can understand, verify, and trust AI recommendations.",
  },
];

const architectureNodes = [
  { id: "patient", label: "Patient Check-in", icon: MessageSquare, x: 0, y: 50 },
  { id: "ingest", label: "Data Ingestion", icon: Database, x: 25, y: 25 },
  { id: "risk", label: "Risk AI Agent", icon: Brain, x: 50, y: 0 },
  { id: "triage", label: "Triage Agent", icon: GitBranch, x: 50, y: 50 },
  { id: "outreach", label: "Outreach Agent", icon: Zap, x: 50, y: 100 },
  { id: "alert", label: "Alert System", icon: Server, x: 75, y: 25 },
  { id: "dashboard", label: "Care Dashboard", icon: Cpu, x: 100, y: 50 },
];

const hackathonScope = [
  { feature: "Patient Check-in Form", status: "included" },
  { feature: "Rule-based Risk Scoring", status: "included" },
  { feature: "Real-time Dashboard", status: "included" },
  { feature: "Alert Generation", status: "included" },
  { feature: "Explainable AI Panel", status: "included" },
  { feature: "Risk Heatmap", status: "included" },
  { feature: "Smart Outreach (Mock)", status: "included" },
];

const futureFeatures = [
  { feature: "ML-based Risk Prediction", status: "future" },
  { feature: "EHR Integration", status: "future" },
  { feature: "Real SMS/Email via Twilio", status: "future" },
  { feature: "Voice-based Check-ins", status: "future" },
  { feature: "Wearable Device Integration", status: "future" },
  { feature: "Multi-language Support", status: "future" },
  { feature: "HIPAA-compliant Cloud Deploy", status: "future" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-primary text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              About the Technology
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Understanding <span className="gradient-text">Agentic AI</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Agentic AI represents the next evolution in artificial intelligence—
              systems that don't just respond to queries but autonomously take actions
              to achieve goals, making healthcare more proactive than ever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Agentic AI */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Makes AI "Agentic"?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional AI responds to requests. Agentic AI proactively monitors,
              reasons, and acts to achieve healthcare goals.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {agenticFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="glass-card p-8 hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              System Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              How our agentic AI system processes patient data and coordinates care.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 lg:p-12"
          >
            {/* Simple Flow Diagram */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
              {[
                { icon: MessageSquare, label: "Patient\nCheck-in", color: "text-primary" },
                { icon: Database, label: "Data\nIngestion", color: "text-info" },
                { icon: Brain, label: "Risk\nAnalysis", color: "text-coral" },
                { icon: GitBranch, label: "Triage\n& Routing", color: "text-warning" },
                { icon: Zap, label: "Smart\nOutreach", color: "text-success" },
                { icon: Cpu, label: "Care\nDashboard", color: "text-primary" },
              ].map((node, index, arr) => (
                <div key={node.label} className="flex items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className={cn("w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-2", node.color)}>
                      <node.icon className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-medium text-foreground whitespace-pre-line">
                      {node.label}
                    </span>
                  </motion.div>
                  {index < arr.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-muted-foreground hidden lg:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4 text-center">
                Key Data Flows
              </h3>
              <div className="grid sm:grid-cols-3 gap-6 text-sm">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="font-medium text-foreground mb-1">
                    1. Input Processing
                  </div>
                  <p className="text-muted-foreground">
                    Patient responses are validated, normalized, and enriched with
                    historical context.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="font-medium text-foreground mb-1">
                    2. Risk Computation
                  </div>
                  <p className="text-muted-foreground">
                    Multi-factor algorithms analyze symptoms, trends, and
                    patient-specific baselines.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="font-medium text-foreground mb-1">
                    3. Action Orchestration
                  </div>
                  <p className="text-muted-foreground">
                    Appropriate care pathways are triggered based on risk tier
                    and care protocols.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to See It in Action?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Explore our interactive dashboard or try the patient check-in experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  Explore Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/patient-checkin">Try Check-in</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
