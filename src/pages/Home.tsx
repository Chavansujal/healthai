import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  Brain,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Clock,
  Bell,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const stats = [
  { value: "40%", label: "Reduction in ER Visits", icon: TrendingUp },
  { value: "24/7", label: "Patient Monitoring", icon: Clock },
  { value: "3min", label: "Average Response Time", icon: Zap },
  { value: "98%", label: "Patient Satisfaction", icon: Users },
];

const problems = [
  {
    title: "Missed Early Warning Signs",
    description:
      "Traditional care models react to crises rather than preventing them, leading to worse outcomes.",
    icon: AlertTriangle,
    color: "text-coral",
  },
  {
    title: "Overwhelmed Care Teams",
    description:
      "Nurses spend 40% of time on documentation, leaving less time for actual patient care.",
    icon: HeartPulse,
    color: "text-warning",
  },
  {
    title: "Fragmented Communication",
    description:
      "Critical patient information gets lost between care transitions and handoffs.",
    icon: Stethoscope,
    color: "text-info",
  },
];

const features = [
  {
    icon: Brain,
    title: "Autonomous Risk Detection",
    description:
      "AI agents continuously analyze patient data to identify deterioration patterns before they become critical.",
  },
  {
    icon: Bell,
    title: "Smart Alert Orchestration",
    description:
      "Intelligent routing ensures the right care team member gets the right alert at the right time.",
  },
  {
    icon: Shield,
    title: "Explainable Decisions",
    description:
      "Every AI recommendation includes clear reasoning, building trust with clinicians and patients.",
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description:
      "Continuous vital sign tracking with predictive analytics for proactive interventions.",
  },
];

const timeline = [
  {
    step: "01",
    title: "Patient Check-in",
    description:
      "Patients complete a simple daily health questionnaire via web or mobile.",
  },
  {
    step: "02",
    title: "AI Analysis",
    description:
      "Agentic AI processes responses and vital data to calculate personalized risk scores.",
  },
  {
    step: "03",
    title: "Risk Stratification",
    description:
      "Patients are categorized into risk tiers for appropriate care pathway routing.",
  },
  {
    step: "04",
    title: "Smart Outreach",
    description:
      "Automated, personalized outreach via email/SMS for high-risk patients.",
  },
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

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-coral/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Activity className="w-4 h-4" />
              <span>Healthcare Agent</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              
              <span>We have made only a model that how we are going to implement our problem statement
                    this includes very few features of our PS </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Proactive Care with{" "}
              <span className="gradient-text">Agentic AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Autonomous AI agents that monitor, predict, and coordinate patient
              care—reducing ER visits, improving outcomes, and empowering care teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  Explore Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/patient-checkin">
                  Try Patient Check-in
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                SOC 2 Ready
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Real-time Processing
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="stat-card text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              The Healthcare Challenge
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Current healthcare systems are reactive, not proactive. We're changing that.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                variants={fadeInUp}
                className="glass-card p-8 hover-lift"
              >
                <div className={`w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 ${problem.color}`}>
                  <problem.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-24 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A seamless flow from patient input to proactive care intervention.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-muted/20 -translate-y-1/2" />

            <div className="grid lg:grid-cols-4 gap-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.step}
                  variants={fadeInUp}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Powered by Agentic AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Autonomous agents that think, learn, and act to deliver better patient outcomes.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="feature-card group cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-coral/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Patient Care?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join the healthcare revolution with Agentic AI Nurse. Request a demo
              or explore our features today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="coral" size="xl" asChild>
                <Link to="/contact">
                  Request Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
