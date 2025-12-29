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
    question: "What is your primary fitness goal?",
    options: [
      { text: "Lose body fat", value: "fatloss" },
      { text: "Build muscle mass", value: "muscle" },
      { text: "Get stronger", value: "strength" },
      { text: "Improve overall health", value: "health" },
    ],
  },
  {
    id: 2,
    question: "How would you describe your current fitness level?",
    options: [
      { text: "Complete beginner (never exercised regularly)", value: "beginner" },
      { text: "Some experience (exercised occasionally)", value: "intermediate" },
      { text: "Experienced (regular gym-goer)", value: "advanced" },
      { text: "Very experienced (years of training)", value: "expert" },
    ],
  },
  {
    id: 3,
    question: "How many days per week can you commit to training?",
    options: [
      { text: "1-2 days", value: "1-2" },
      { text: "3-4 days", value: "3-4" },
      { text: "5-6 days", value: "5-6" },
      { text: "Every day", value: "7" },
    ],
  },
  {
    id: 4,
    question: "What's your current relationship with food?",
    options: [
      { text: "I eat whatever I want, not tracking anything", value: "untracked" },
      { text: "I try to eat healthy but struggle with consistency", value: "trying" },
      { text: "I'm somewhat aware of my nutrition", value: "aware" },
      { text: "I track my food and macros regularly", value: "tracking" },
    ],
  },
  {
    id: 5,
    question: "How much sleep do you typically get?",
    options: [
      { text: "Less than 5 hours", value: "poor" },
      { text: "5-6 hours", value: "low" },
      { text: "7-8 hours", value: "good" },
      { text: "More than 8 hours", value: "excellent" },
    ],
  },
  {
    id: 6,
    question: "What's your biggest challenge with fitness?",
    options: [
      { text: "Staying consistent", value: "consistency" },
      { text: "Knowing what to do", value: "knowledge" },
      { text: "Finding time", value: "time" },
      { text: "Seeing results", value: "results" },
    ],
  },
  {
    id: 7,
    question: "How do you prefer to exercise?",
    options: [
      { text: "At home with minimal equipment", value: "home" },
      { text: "At a gym with full equipment", value: "gym" },
      { text: "Outdoor activities (running, sports)", value: "outdoor" },
      { text: "Mix of everything", value: "mixed" },
    ],
  },
  {
    id: 8,
    question: "What's your body type tendency?",
    options: [
      { text: "Naturally thin, hard to gain weight (Ectomorph)", value: "ecto" },
      { text: "Naturally athletic, gain muscle easily (Mesomorph)", value: "meso" },
      { text: "Naturally larger, gain weight easily (Endomorph)", value: "endo" },
      { text: "Not sure", value: "unsure" },
    ],
  },
  {
    id: 9,
    question: "How patient are you with results?",
    options: [
      { text: "I want results as fast as possible", value: "impatient" },
      { text: "I can wait a few weeks", value: "moderate" },
      { text: "I understand it takes months", value: "patient" },
      { text: "I'm in this for the long haul (years)", value: "committed" },
    ],
  },
  {
    id: 10,
    question: "Have you tried fitness programs before?",
    options: [
      { text: "No, this is my first time", value: "first" },
      { text: "Yes, but I quit after a short time", value: "quit" },
      { text: "Yes, with some success but want better results", value: "some_success" },
      { text: "Yes, I've achieved my goals before", value: "success" },
    ],
  },
  {
    id: 11,
    question: "What motivates you most?",
    options: [
      { text: "Looking good", value: "appearance" },
      { text: "Feeling strong and capable", value: "strength" },
      { text: "Health and longevity", value: "health" },
      { text: "Performance and athletic ability", value: "performance" },
    ],
  },
  {
    id: 12,
    question: "How do you handle setbacks?",
    options: [
      { text: "I tend to give up easily", value: "give_up" },
      { text: "I take breaks but eventually come back", value: "break" },
      { text: "I adjust my approach and keep going", value: "adjust" },
      { text: "Setbacks motivate me to work harder", value: "motivated" },
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
    title: "Fat Loss Beginner",
    description: "You're starting your fat loss journey! Focus on building habits and learning the basics of nutrition and exercise.",
    icon: Flame,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    tips: [
      "Start with a moderate calorie deficit (300-500 calories below maintenance)",
      "Focus on protein intake (1.6g per kg of body weight)",
      "Begin with 3 strength training sessions per week",
      "Walk 8,000-10,000 steps daily",
      "Track your food for awareness, even if not perfectly",
    ],
  },
  "fat_loss_intermediate": {
    type: "fat_loss_intermediate",
    title: "Fat Loss Intermediate",
    description: "You have some experience and understand the basics. Time to dial in your approach for better results!",
    icon: Flame,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    tips: [
      "Consider carb cycling or strategic refeeds",
      "Increase training intensity with progressive overload",
      "Add 2-3 HIIT sessions per week",
      "Focus on sleep and stress management",
      "Be patient - the last pounds are the hardest",
    ],
  },
  "muscle_gain_beginner": {
    type: "muscle_gain_beginner",
    title: "Muscle Gain Beginner",
    description: "You're ready to build muscle! Focus on learning proper form and establishing a solid training foundation.",
    icon: Dumbbell,
    color: "text-accent",
    bgColor: "bg-accent/20",
    tips: [
      "Start with a full-body program 3x per week",
      "Focus on compound movements (squat, deadlift, bench, row)",
      "Eat in a slight calorie surplus (200-300 calories)",
      "Prioritize protein (2g per kg of body weight)",
      "Master form before increasing weight",
    ],
  },
  "muscle_gain_intermediate": {
    type: "muscle_gain_intermediate",
    title: "Muscle Gain Intermediate",
    description: "You've built a foundation and are ready for more advanced techniques to maximize muscle growth!",
    icon: Dumbbell,
    color: "text-accent",
    bgColor: "bg-accent/20",
    tips: [
      "Consider a push/pull/legs or upper/lower split",
      "Implement progressive overload systematically",
      "Add isolation exercises for lagging body parts",
      "Periodize your training (deload weeks)",
      "Optimize sleep for recovery and growth hormone",
    ],
  },
  "balanced_fitness": {
    type: "balanced_fitness",
    title: "Balanced Fitness Type",
    description: "You're looking for overall health and fitness rather than extreme transformation. A sustainable, balanced approach is perfect for you!",
    icon: Target,
    color: "text-primary",
    bgColor: "bg-primary/20",
    tips: [
      "Combine strength training with cardio/activities you enjoy",
      "Focus on eating whole, nutritious foods without strict tracking",
      "Prioritize consistency over intensity",
      "Include flexibility and mobility work",
      "Make fitness a lifestyle, not a phase",
    ],
  },
};

function calculateResult(answers: Record<number, string>): ResultType {
  let fatLossScore = 0;
  let muscleScore = 0;
  let beginnerScore = 0;
  let advancedScore = 0;

  if (answers[1] === "fatloss") fatLossScore += 3;
  if (answers[1] === "muscle" || answers[1] === "strength") muscleScore += 3;

  if (answers[2] === "beginner") beginnerScore += 3;
  if (answers[2] === "intermediate") beginnerScore += 1;
  if (answers[2] === "advanced" || answers[2] === "expert") advancedScore += 2;

  if (answers[3] === "1-2") beginnerScore += 1;
  if (answers[3] === "5-6" || answers[3] === "7") advancedScore += 1;

  if (answers[4] === "untracked" || answers[4] === "trying") beginnerScore += 1;
  if (answers[4] === "tracking") advancedScore += 1;

  if (answers[8] === "ecto") muscleScore += 1;
  if (answers[8] === "endo") fatLossScore += 1;

  if (answers[9] === "impatient") beginnerScore += 1;
  if (answers[9] === "committed" || answers[9] === "patient") advancedScore += 1;

  if (answers[10] === "first" || answers[10] === "quit") beginnerScore += 2;
  if (answers[10] === "success" || answers[10] === "some_success") advancedScore += 1;

  if (answers[12] === "give_up") beginnerScore += 1;
  if (answers[12] === "motivated" || answers[12] === "adjust") advancedScore += 1;

  const isBeginner = beginnerScore > advancedScore;
  const isFatLoss = fatLossScore >= muscleScore;

  if (fatLossScore <= 1 && muscleScore <= 1) {
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
                      Answer 12 quick questions to discover your ideal fitness approach
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                        <div className="text-2xl font-display font-bold text-primary">12</div>
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
                      <h3 className="font-display font-semibold text-lg">Personalized Tips For You:</h3>
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
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <Button variant="outline" onClick={handleRestart} className="hover:bg-muted/50">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake Quiz
                      </Button>
                      <Button 
                        onClick={() => setLocation("/intake")} 
                        className="neon-glow bg-primary hover:bg-primary/90"
                      >
                        Get Started
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
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
