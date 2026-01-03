import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle,
  Target,
  Dumbbell,
  Scale,
  Flame,
  Trophy,
  CheckCircle2,
  RotateCcw
} from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";

interface Question {
  id: number;
  question: string;
  options: { text: string; value: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Do you feel like you're working hard but the scale just won't budge?",
    options: [
      { text: "Yes, it's incredibly frustrating", value: "q1_frustrating" },
      { text: "I see some changes, but they're slow", value: "q1_slow" },
      { text: "I'm actually looking to gain size", value: "q1_muscle" },
      { text: "I'm just starting out", value: "q1_health" },
    ],
  },
  {
    id: 2,
    question: "How many times have you started a 'new routine' only to lose steam in 3 weeks?",
    options: [
      { text: "More times than I can count", value: "q2_many" },
      { text: "A few times, I need better structure", value: "q2_some" },
      { text: "I'm consistent, but plateaued", value: "q2_plateau" },
      { text: "I've never really tried a real plan", value: "q2_never" },
    ],
  },
  {
    id: 3,
    question: "If you had a coach guiding your every move, how much faster would you reach your goal?",
    options: [
      { text: "10x faster, I need that accountability", value: "q3_10x" },
      { text: "Significantly, I'm tired of guessing", value: "q3_significant" },
      { text: "I just need a clear roadmap", value: "q3_roadmap" },
      { text: "I'm curious to see the difference", value: "q3_curious" },
    ],
  },
  {
    id: 4,
    question: "What's the #1 thing holding you back from the body you want?",
    options: [
      { text: "Confusing nutrition/dieting", value: "q4_nutrition" },
      { text: "Lack of a proven workout system", value: "q4_system" },
      { text: "Life is too busy/stressful", value: "q4_busy" },
      { text: "Not knowing where to start", value: "q4_start" },
    ],
  },
  {
    id: 5,
    question: "Does your current lifestyle actually support the results you're chasing?",
    options: [
      { text: "Honestly? No, I need a total reset", value: "q5_reset" },
      { text: "Somewhat, but it's a mess", value: "q5_mess" },
      { text: "I try, but I'm always exhausted", value: "q5_exhausted" },
      { text: "I'm ready to make it work", value: "q5_ready" },
    ],
  },
  {
    id: 6,
    question: "When you look in the mirror 6 months from now, what do you want to see?",
    options: [
      { text: "A lean, toned, confident version of me", value: "q6_lean" },
      { text: "Clear muscle definition and strength", value: "q6_muscle" },
      { text: "Someone who finally took control", value: "q6_control" },
      { text: "Improved health and energy levels", value: "q6_health" },
    ],
  },
  {
    id: 7,
    question: "Are you ready to stop 'trying' and start 'training' with a real plan?",
    options: [
      { text: "I'm 100% ready, let's do this", value: "q7_100" },
      { text: "I'm cautious but interested", value: "q7_interested" },
      { text: "I need to know it's built for me", value: "q7_built" },
      { text: "I've waited long enough", value: "q7_waited" },
    ],
  },
  {
    id: 8,
    question: "If we built your exact roadmap today, would you follow it?",
    options: [
      { text: "Show me the path, I'm in", value: "q8_in" },
      { text: "Yes, I need the structure", value: "q8_structure" },
      { text: "I'm ready to commit to myself", value: "q8_commit" },
      { text: "Let's see what you've got", value: "q8_see" },
    ],
  },
];

interface ResultType {
  type: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  tips: string[];
}

const resultTypes: Record<string, ResultType> = {
  "fat_loss_beginner": {
    type: "fat_loss_beginner",
    title: "The Fat Loss Plateau",
    description: "Your results suggest you're stuck in a common cycle where effort doesn't match the scale. This isn't your fault—it's a roadmap issue.",
    icon: Flame,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    tips: [
      "We've identified 3 major gaps in your current calorie-to-activity ratio.",
      "Your profile shows a high potential for transformation once the 'guessing' is removed.",
      "A specifically structured Indian diet plan would likely trigger the metabolic shift you've been missing.",
    ],
  },
  "fat_loss_intermediate": {
    type: "fat_loss_intermediate",
    title: "The Consistency Gap",
    description: "You have the foundation, but your data shows a 'plateau risk'. You're doing the work, but without precise calibration, you're spinning your wheels.",
    icon: Flame,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    tips: [
      "Your experience level requires advanced 'Progressive Overload' that most apps can't provide.",
      "There's a specific way to align your nutrition with your training intensity that we need to fix.",
      "One-to-one guidance would likely shave 4 months off your current timeline.",
    ],
  },
  "muscle_gain_beginner": {
    type: "muscle_gain_beginner",
    title: "The Growth Barrier",
    description: "You're ready to grow, but your current approach likely lacks the 'Skeletal Loading' required for real muscle hypertrophy.",
    icon: Dumbbell,
    color: "text-accent",
    bgColor: "bg-accent/20",
    tips: [
      "Your body type requires a very specific surplus-to-stimulus ratio.",
      "Random gym workouts are likely wasting your 'newbie gains' window.",
      "A custom-built roadmap will ensure every rep you do actually counts towards your goal.",
    ],
  },
  "muscle_gain_intermediate": {
    type: "muscle_gain_intermediate",
    title: "The Performance Peak",
    description: "You've hit the limit of what 'general advice' can do. To reach the next level of definition and strength, you need surgical precision in your programming.",
    icon: Dumbbell,
    color: "text-accent",
    bgColor: "bg-accent/20",
    tips: [
      "We've identified opportunities to optimize your recovery-to-output ratio.",
      "Your current split is likely leaving 'gains' on the table due to lack of personalization.",
      "Professional coaching is the missing link between 'looking fit' and 'looking elite'.",
    ],
  },
  "balanced_fitness": {
    type: "balanced_fitness",
    title: "The Clarity Search",
    description: "You're looking for health, but the 'noise' of the fitness industry is making it harder than it needs to be. You need a path that fits your life, not the other way around.",
    icon: Target,
    color: "text-primary",
    bgColor: "bg-primary/20",
    tips: [
      "A sustainable approach exists, but it requires a plan built around your actual schedule.",
      "We can remove the 'analysis paralysis' by giving you exactly what to do each day.",
      "Your journey starts with a single, clear, professionally-guided roadmap.",
    ],
  },
};

function calculateResult(answers: Record<number, string>): ResultType {
  let fatLossScore = 0;
  let muscleScore = 0;
  let beginnerScore = 0;
  let advancedScore = 0;

  // Question 1: Goal
  if (answers[1] === "q1_frustrating" || answers[1] === "q1_slow") fatLossScore += 3;
  if (answers[1] === "q1_muscle") muscleScore += 3;

  // Question 2: Experience
  if (answers[2] === "q2_many" || answers[2] === "q2_never") beginnerScore += 3;
  if (answers[2] === "q2_some") beginnerScore += 1;
  if (answers[2] === "q2_plateau") advancedScore += 2;

  // Question 3: Commitment
  if (answers[3] === "q3_10x" || answers[3] === "q3_significant") advancedScore += 1;
  if (answers[3] === "q3_roadmap") beginnerScore += 1;

  // Question 4: Barrier
  if (answers[4] === "q4_nutrition" || answers[4] === "q4_start") beginnerScore += 1;

  // Question 8: Commitment to follow
  if (answers[8] === "q8_in" || answers[8] === "q8_structure") advancedScore += 1;

  const isBeginner = beginnerScore > advancedScore;
  const isFatLoss = fatLossScore >= muscleScore;

  if (fatLossScore === 0 && muscleScore === 0) {
    return resultTypes["balanced_fitness"];
  }

  if (isFatLoss && isBeginner) return resultTypes["fat_loss_beginner"];
  if (isFatLoss && !isBeginner) return resultTypes["fat_loss_intermediate"];
  if (!isFatLoss && isBeginner) return resultTypes["muscle_gain_beginner"];
  return resultTypes["muscle_gain_intermediate"];
}

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<ResultType | null>(null);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => {
        const calculatedResult = calculateResult(newAnswers);
        setResult(calculatedResult);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <PageWrapper>
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!started ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Button variant="ghost" onClick={() => setLocation("/")} className="mb-8 hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>

                <Card className="bg-card/80 backdrop-blur-sm border border-primary/30 neon-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent pointer-events-none" />
                  <CardHeader className="relative text-center space-y-4 pb-6">
                    <motion.div 
                      className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <HelpCircle className="w-10 h-10 text-primary" />
                    </motion.div>
                    <CardTitle className="text-3xl font-display">Fitness Quiz</CardTitle>
                    <CardDescription className="text-base">
                      Answer 8 quick questions to discover your ideal fitness approach
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                        <div className="text-2xl font-display font-bold text-primary">8</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                      </div>
                      <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                        <div className="text-2xl font-display font-bold text-accent">2-3</div>
                        <div className="text-sm text-muted-foreground">Minutes</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>You'll discover:</p>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          Your ideal fitness focus (fat loss, muscle gain, balanced)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          Whether you should start beginner or intermediate
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          Personalized tips for your situation
                        </li>
                      </ul>
                    </div>

                    <Button 
                      onClick={() => setStarted(true)} 
                      className="w-full neon-glow bg-primary hover:bg-primary/90 py-6 text-lg"
                    >
                      Start Quiz
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className={`bg-card/80 backdrop-blur-sm border ${result.bgColor.replace('bg-', 'border-').replace('/20', '/30')} overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${result.bgColor.replace('bg-', 'from-')} to-transparent pointer-events-none`} />
                  <CardHeader className="relative text-center space-y-4 pb-6">
                    <motion.div 
                      className={`w-20 h-20 rounded-2xl ${result.bgColor} flex items-center justify-center mx-auto`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <result.icon className={`w-10 h-10 ${result.color}`} />
                    </motion.div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">Your Result</span>
                      </div>
                      <CardTitle className={`text-3xl font-display ${result.color}`}>{result.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{result.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-display font-semibold text-lg">What we've discovered:</h3>
                      <ul className="space-y-2">
                        {result.tips.map((tip, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
                          >
                            <CheckCircle2 className={`w-5 h-5 ${result.color} shrink-0 mt-0.5`} />
                            <span className="text-sm text-foreground/90">{tip}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <p className="text-sm text-muted-foreground mt-4 italic">
                        These aren't full stops—they're the exact gaps we fix in your custom program.
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button 
                        onClick={() => setLocation("/intake")} 
                        className="w-full neon-glow bg-primary hover:bg-primary/90 py-7 text-xl font-bold text-black rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                      >
                        Enroll Now to Fix This
                        <ChevronRight className="w-6 h-6 ml-2" />
                      </Button>
                      <button 
                        onClick={handleRestart}
                        className="w-full text-center text-xs text-muted-foreground hover:text-white mt-4 uppercase tracking-widest"
                      >
                        Restart Assessment
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-2 bg-muted/50" />
                    <div 
                      className="absolute top-0 left-0 h-2 rounded-full bg-primary neon-glow transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-card/80 backdrop-blur-sm border border-primary/30 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                      <CardHeader className="relative">
                        <CardTitle className="text-xl font-display">
                          {questions[currentQuestion].question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative space-y-3">
                        {questions[currentQuestion].options.map((option, index) => {
                          const isSelected = answers[questions[currentQuestion].id] === option.value;
                          return (
                            <motion.button
                              key={option.value}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleAnswer(option.value)}
                              className={`
                                w-full p-4 rounded-xl text-left transition-all
                                ${isSelected 
                                  ? "bg-primary/20 border-primary/50 neon-border" 
                                  : "bg-background/50 border border-border/30 hover:border-primary/30 hover:bg-primary/5"
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`
                                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                                  ${isSelected ? "border-primary bg-primary" : "border-muted-foreground"}
                                `}>
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                                </div>
                                <span className={isSelected ? "text-foreground font-medium" : "text-foreground/80"}>
                                  {option.text}
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}

                        <div className="flex justify-between pt-4">
                          <Button 
                            variant="ghost" 
                            onClick={handleBack}
                            disabled={currentQuestion === 0}
                            className="hover:bg-muted/50"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={handleRestart}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Start Over
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
