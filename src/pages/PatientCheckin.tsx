import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ThermometerSun,
  Heart,
  Droplets,
  Pill,
  Moon,
  Smile,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Question {
  id: string;
  icon: React.ElementType;
  question: string;
  type: "scale" | "options" | "yesno";
  options?: { value: string | number; label: string }[];
}

const questions: Question[] = [
  {
    id: "energy",
    icon: Activity,
    question: "How would you rate your energy level today?",
    type: "scale",
  },
  {
    id: "breathing",
    icon: ThermometerSun,
    question: "Have you experienced any shortness of breath?",
    type: "options",
    options: [
      { value: "none", label: "Not at all" },
      { value: "mild", label: "Mild" },
      { value: "moderate", label: "Moderate" },
      { value: "severe", label: "Severe" },
    ],
  },
  {
    id: "heartrate",
    icon: Heart,
    question: "Have you noticed any irregular heartbeat or palpitations?",
    type: "yesno",
  },
  {
    id: "swelling",
    icon: Droplets,
    question: "Do you have any swelling in your legs, ankles, or feet?",
    type: "options",
    options: [
      { value: "none", label: "None" },
      { value: "slight", label: "Slight" },
      { value: "noticeable", label: "Noticeable" },
      { value: "significant", label: "Significant" },
    ],
  },
  {
    id: "medication",
    icon: Pill,
    question: "Did you take all your medications as prescribed today?",
    type: "yesno",
  },
  {
    id: "sleep",
    icon: Moon,
    question: "How well did you sleep last night?",
    type: "scale",
  },
  {
    id: "mood",
    icon: Smile,
    question: "How would you rate your overall mood today?",
    type: "scale",
  },
];

interface RiskResult {
  score: number;
  level: "low" | "moderate" | "elevated" | "high";
  message: string;
  recommendations: string[];
}

function calculateRisk(answers: Record<string, string | number>): RiskResult {
  let riskPoints = 0;

  // Energy level (1-5, lower = more risk)
  if (answers.energy) {
    riskPoints += (6 - Number(answers.energy)) * 5;
  }

  // Breathing issues
  const breathingRisk: Record<string, number> = {
    none: 0,
    mild: 10,
    moderate: 25,
    severe: 40,
  };
  riskPoints += breathingRisk[answers.breathing as string] || 0;

  // Irregular heartbeat
  if (answers.heartrate === "yes") {
    riskPoints += 20;
  }

  // Swelling
  const swellingRisk: Record<string, number> = {
    none: 0,
    slight: 10,
    noticeable: 20,
    significant: 35,
  };
  riskPoints += swellingRisk[answers.swelling as string] || 0;

  // Medication compliance
  if (answers.medication === "no") {
    riskPoints += 15;
  }

  // Sleep quality
  if (answers.sleep) {
    riskPoints += (6 - Number(answers.sleep)) * 3;
  }

  // Mood
  if (answers.mood) {
    riskPoints += (6 - Number(answers.mood)) * 2;
  }

  // Normalize to 0-100
  const score = Math.min(100, Math.round(riskPoints));

  let level: RiskResult["level"];
  let message: string;
  let recommendations: string[];

  if (score < 25) {
    level = "low";
    message =
      "Great news! Your responses indicate you're doing well today. Keep up the excellent self-care!";
    recommendations = [
      "Continue your current medication routine",
      "Maintain your sleep schedule",
      "Stay active with light exercise",
    ];
  } else if (score < 50) {
    level = "moderate";
    message =
      "You're doing okay, but we noticed a few areas that need attention. Consider the recommendations below.";
    recommendations = [
      "Monitor your symptoms closely today",
      "Ensure you stay hydrated",
      "Rest if you're feeling fatigued",
      "Contact your care team if symptoms worsen",
    ];
  } else if (score < 75) {
    level = "elevated";
    message =
      "Some of your responses indicate elevated concern. We recommend reaching out to your care team today.";
    recommendations = [
      "Schedule a check-in call with your nurse",
      "Monitor your vitals more frequently today",
      "Avoid strenuous activities",
      "Prepare a list of current symptoms for your care team",
    ];
  } else {
    level = "high";
    message =
      "Your responses indicate significant symptoms that need immediate attention. Your care team has been alerted.";
    recommendations = [
      "Your care coordinator will contact you shortly",
      "Have your emergency contacts readily available",
      "Rest and avoid exertion",
      "If you experience severe symptoms, call 911",
    ];
  }

  return { score, level, message, recommendations };
}

export default function PatientCheckin() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const handleAnswer = (value: string | number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and calculate risk
      const result = calculateRisk(answers);
      setRiskResult(result);
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentAnswer = answers[currentQuestion?.id];
  const canProceed = currentAnswer !== undefined;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl"
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Daily Check-in</span>
                  <span className="text-foreground font-medium">
                    {currentStep + 1} of {questions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8 mb-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <currentQuestion.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Answer Options */}
                {currentQuestion.type === "scale" && (
                  <div className="flex items-center justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(value)}
                        className={cn(
                          "flex-1 aspect-square rounded-2xl border-2 text-2xl font-bold transition-all hover:scale-105",
                          currentAnswer === value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "yesno" && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-lg font-semibold transition-all hover:scale-102",
                          currentAnswer === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "options" && currentQuestion.options && (
                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={String(option.value)}
                        onClick={() => handleAnswer(option.value)}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-center transition-all hover:scale-102",
                          currentAnswer === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        )}
                      >
                        <span className="font-semibold">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "scale" && (
                  <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                )}
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                <Button
                  variant="hero"
                  onClick={handleNext}
                  disabled={!canProceed}
                >
                  {currentStep === questions.length - 1 ? "Submit" : "Next"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl text-center"
            >
              {/* Result Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={cn(
                  "w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center",
                  riskResult?.level === "low"
                    ? "bg-success/10"
                    : riskResult?.level === "moderate"
                    ? "bg-warning/10"
                    : riskResult?.level === "elevated"
                    ? "bg-coral/10"
                    : "bg-destructive/10"
                )}
              >
                {riskResult?.level === "low" ? (
                  <CheckCircle2
                    className="w-12 h-12 text-success"
                  />
                ) : (
                  <AlertTriangle
                    className={cn(
                      "w-12 h-12",
                      riskResult?.level === "moderate"
                        ? "text-warning"
                        : riskResult?.level === "elevated"
                        ? "text-coral"
                        : "text-destructive"
                    )}
                  />
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-foreground mb-4"
              >
                Thank You for Checking In!
              </motion.h1>

              {/* Risk Score Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 mb-6"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-muted-foreground">Risk Score:</span>
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      riskResult?.level === "low"
                        ? "text-success"
                        : riskResult?.level === "moderate"
                        ? "text-warning"
                        : riskResult?.level === "elevated"
                        ? "text-coral"
                        : "text-destructive"
                    )}
                  >
                    {riskResult?.score}
                  </span>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-semibold capitalize",
                      riskResult?.level === "low"
                        ? "bg-success/10 text-success"
                        : riskResult?.level === "moderate"
                        ? "bg-warning/10 text-warning"
                        : riskResult?.level === "elevated"
                        ? "bg-coral/10 text-coral"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {riskResult?.level}
                  </span>
                </div>
                <p className="text-muted-foreground">{riskResult?.message}</p>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 text-left mb-8"
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Recommendations for Today
                </h3>
                <ul className="space-y-3">
                  {riskResult?.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button variant="hero" size="lg" asChild>
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setCurrentStep(0);
                    setAnswers({});
                    setIsSubmitted(false);
                    setRiskResult(null);
                  }}
                >
                  Start New Check-in
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
