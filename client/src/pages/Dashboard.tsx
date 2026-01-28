import { useMemo, useEffect, useState } from "react";
import { getUserById, UserProfile, calculateBodyFatPercentage } from "@/lib/googleSheetsApi";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Flame,
  Utensils,
  Activity,
  ChevronRight,
  Heart,
  Scale,
  Zap,
  Plus,
  Compass,
  Target,
  Dumbbell,
  Coffee,
  Info,
  CheckCircle,
  Calendar as CalendarIcon,
  HeartPulse
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/App";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMacroData, NutritionData } from "@/lib/nutritionSync";
import { format, parseISO, startOfDay } from "date-fns";

// Body type images
import maleObeseImg from "@/assets/body-types/male_obese_body_type.png";
import maleSkinnyImg from "@/assets/body-types/male_skinny_body_type.png";
import maleFitImg from "@/assets/body-types/male_fit_body_type.png";
import maleMuscularImg from "@/assets/body-types/male_muscular_body_type.png";
import femaleObeseImg from "@/assets/body-types/female_obese_body_type.png";
import femaleSkinnyImg from "@/assets/body-types/female_skinny_body_type.png";
import femaleFitImg from "@/assets/body-types/female_fit_body_type.png";
import femaleMuscularImg from "@/assets/body-types/female_muscular_body_type.png";
import femaleoverweightImg from "@/assets/body-types/Female_overweight.png";
import maleoverweightImg from "@/assets/body-types/Male_overweight.png";

type BodyType = "obese" | "skinny" | "overweight" |"fit" | "muscular";

function determineBodyType(
  bmi: number,
  muscleMass: "low" | "average" | "high" = "average"
): BodyType {

  // Muscular override (but only if BMI isn't extreme)
  if (muscleMass === "high" && bmi < 30) {
    return "muscular";
  }

  if (bmi < 18.5) {
    return "skinny";
  }

  if (bmi >= 18.5 && bmi < 25) {
    return "fit";
  }

  if (bmi >= 25 && bmi < 30) {
    return "overweight";
  }

  return "obese";
}

function calculateIdealWeight(heightCm: number, gender: string) {
  const heightM = heightCm / 100;
  const minBmi = 18.5;
  const maxBmi = gender === "male" ? 24.9 : 23.9;
  return {
    min: Math.round(minBmi * heightM * heightM),
    max: Math.round(maxBmi * heightM * heightM),
  };
}

function calculateProteinIntake(weight: number, goal: string): number {
  const multiplier = goal === "muscle_gain" ? 2.2 : goal === "fat_loss" ? 2.0 : 1.6;
  return Math.round(weight * multiplier);
}

function ImageBodyMap({
  bodyType,
  gender,
  bmi,
  bodyFat,
  idealWeight,
  protein,
  onAnalysisClick,
}: {
  bodyType: BodyType;
  gender: string;
  bmi: number;
  bodyFat: number | null;
  idealWeight: { min: number; max: number };
  protein: number;
  onAnalysisClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const bodyImages: Record<string, Record<BodyType, string>> = {
    male: { obese: maleObeseImg, skinny: maleSkinnyImg, fit: maleFitImg, muscular: maleMuscularImg,  overweight: maleoverweightImg, },
    female: { obese: femaleObeseImg, skinny: femaleSkinnyImg, fit: femaleFitImg, muscular: femaleMuscularImg,  overweight: femaleoverweightImg, },
  };

  const selectedImage = bodyImages[gender.toLowerCase()]?.[bodyType] || bodyImages.male[bodyType];

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onAnalysisClick}
    >
      <div className="relative aspect-[3/4] w-full max-w-[240px] mx-auto rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 transition-all duration-500 group-hover:border-primary/30">
        <img
          src={selectedImage}
          alt="Body Snapshot"
          className="w-full h-full object-contain p-4 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
        />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col justify-center p-6 space-y-4"
            >
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</p>
                <p className="text-primary font-display font-bold text-lg uppercase">{bodyType}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">BMI</p>
                  <p className="text-white font-medium">{bmi.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Body Fat</p>
                  <p className="text-white font-medium">{bodyFat !== null ? `${bodyFat.toFixed(1)}%` : '--'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Target</p>
                  <p className="text-white font-medium">{idealWeight.max || 70}kg</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Daily Protein</p>
                <p className="text-white font-medium">{protein || 150}g</p>
              </div>
              <div className="pt-2">
                <Button 
                  size="sm"
                  className="w-full text-[10px] h-7 bg-primary text-black font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnalysisClick();
                  }}
                >
                  VIEW FULL ANALYSIS
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AIGuideOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [stage, setStage] = useState<'main' | 'train' | 'eat'>('main');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showConfirmation, setShowConfirmation] = useState<{ label: string, path: string } | null>(null);

  const actions = {
    main: [
      { label: "Train today", icon: Dumbbell, color: "text-primary", onClick: () => setStage('train') },
      { label: "Eat something", icon: Utensils, color: "text-accent", onClick: () => setStage('eat') },
      { label: "Check progress", icon: Target, color: "text-secondary", onClick: () => setLocation('/app/progress') },
      { label: "I'm confused", icon: Compass, color: "text-white/60", onClick: () => setLocation('/app/guide') },
    ],
    train: [
      { label: "Full Workout", icon: Zap, onClick: () => setLocation('/app/plans') },
      { label: "20-min Short", icon: Activity, onClick: () => setLocation('/app/plans') },
      { label: "Recovery / Rest", icon: Coffee, onClick: () => setLocation('/app/streak') },
      { label: "← Back", icon: ArrowLeft, onClick: () => setStage('main') },
    ],
    eat: [
      { label: "Protein Hacks", icon: Zap, onClick: () => setLocation('/app/nutrition?tab=hacks') },
      { label: "Recipes", icon: Utensils, onClick: () => setLocation('/app/nutrition?tab=recipes') },
      { label: "← Back", icon: ArrowLeft, onClick: () => setStage('main') },
    ]
  } as Record<string, any[]>;

  const handleVoiceCommand = (command: string) => {
    const cmd = command.toLowerCase();
    if (cmd.includes("workout")) {
      setShowConfirmation({ label: "Open Workouts", path: "/app/workouts" });
    } else if (cmd.includes("nutrition") || cmd.includes("eat")) {
      setShowConfirmation({ label: "Open Nutrition", path: "/app/nutrition" });
    } else if (cmd.includes("partner")) {
      setShowConfirmation({ label: "Open Workout Partner", path: "/app/workout-partner" });
    } else if (cmd.includes("dashboard") || cmd.includes("home")) {
      setShowConfirmation({ label: "Open Dashboard", path: "/app" });
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("Listening...");
    };
    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript;
      setTranscript(command);
      handleVoiceCommand(command);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <motion.div 
      drag
      dragConstraints={{ left: -500, right: 0, top: -500, bottom: 0 }}
      whileDrag={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl min-w-[200px] overflow-hidden"
            >
              {isListening ? (
                <div className="p-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 animate-ping mx-auto" />
                  <p className="text-sm font-medium text-white">{transcript}</p>
                </div>
              ) : showConfirmation ? (
                <div className="p-4 space-y-4">
                  <p className="text-sm text-white font-medium text-center">{showConfirmation.label}?</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-[10px]"
                      onClick={() => setShowConfirmation(null)}
                    >CANCEL</Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary text-black text-[10px] font-bold"
                      onClick={() => {
                        setLocation(showConfirmation.path);
                        setShowConfirmation(null);
                        setIsOpen(false);
                      }}
                    >YES</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {actions[stage].map((action: any, i: number) => (
                    <button
                      key={i}
                      onClick={action.onClick}
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                    >
                      <action.icon className={cn("w-4 h-4", action.color || "text-white/80")} />
                      <span className="text-sm font-medium text-white/90 group-hover:text-white">{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onMouseDown={(e) => {
            const timer = setTimeout(startListening, 500);
            (e.currentTarget as any)._voiceTimer = timer;
          }}
          onMouseUp={(e) => clearTimeout((e.currentTarget as any)._voiceTimer)}
          onClick={() => { setIsOpen(!isOpen); setStage('main'); setShowConfirmation(null); }}
          className="relative group cursor-grab active:cursor-grabbing"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all animate-pulse" />
          <div className="relative w-16 h-16 bg-black border border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all active:scale-90 group-hover:border-primary group-hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,157,0.4),transparent)]" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary via-accent to-primary animate-[spin_3s_linear_infinite] shadow-[0_0_20px_rgba(0,255,157,0.6)] relative z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(0,255,157,0.1)_50%,transparent_55%)] animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [liveProfile, setLiveProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [streakData, setStreakData] = useState<any>(null);

  useEffect(() => {
    // Load initial streak data
    const localStreak = localStorage.getItem('capsfitness_streak_v1');
    if (localStreak) {
      setStreakData(JSON.parse(localStreak));
    }
    
    const handleStreakUpdate = (e: any) => setStreakData(e.detail);
    window.addEventListener("streak-data-updated", handleStreakUpdate);
    return () => window.removeEventListener("streak-data-updated", handleStreakUpdate);
  }, []);

  const planDates = useMemo(() => {
    if (!liveProfile?.plan_start_date || !liveProfile?.plan_end_date) return null;
    try {
      return {
        start: startOfDay(parseISO(liveProfile.plan_start_date)),
        end: startOfDay(parseISO(liveProfile.plan_end_date))
      };
    } catch (e) {
      return null;
    }
  }, [liveProfile]);

  const streakDaysCount = useMemo(() => {
    if (!planDates || !streakData?.history) return 0;
    return streakData.history.filter((h: any) => {
      const d = parseISO(h.date);
      return d >= planDates.start && d <= planDates.end && (h.workoutDone || h.dietDone || h.isRestDay);
    }).length;
  }, [planDates, streakData]);

  useEffect(() => {
    // Check user_id from the user object
    const id = (user as any)?.user_id || localStorage.getItem('user_id');
    
    if (!id) {
      console.log("No user ID found in user object or localStorage, skipping profile fetch");
      setLoadingProfile(false);
      return;
    }
    
    async function fetchProfile() {
      try {
        const idToFetch = (user as any)?.user_id || localStorage.getItem('user_id');
        console.log("Fetching profile for user ID:", idToFetch);
        const data = await getUserById(idToFetch!);
        console.log("Profile data received:", data);
        if (data) {
          setLiveProfile(data);
          // Sync ID to local storage for persistence if needed
          localStorage.setItem('user_id', data.user_id);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    setNutritionData(getMacroData());
    const handleUpdate = (e: any) => setNutritionData(e.detail);
    window.addEventListener("nutrition-data-updated", handleUpdate);
    return () => window.removeEventListener("nutrition-data-updated", handleUpdate);
  }, []);

  const firstName = (user as any)?.name?.split(" ")[0]?.toUpperCase() || (liveProfile as any)?.name?.split(" ")[0]?.toUpperCase() || "CHAMP";
  const userHeight = liveProfile?.height_cm ?? 175;
  const userWeight = liveProfile?.current_weight ?? 70;
  const userGender = liveProfile?.gender ?? "male";
  const userMuscleMass = (liveProfile as any)?.muscle_mass ?? "average";

  const bmi = userWeight / Math.pow(userHeight / 100, 2);
  const bodyFat = calculateBodyFatPercentage(
    userGender,
    userHeight,
    (liveProfile as any)?.waist_cm,
    (liveProfile as any)?.neck_cm,
    (liveProfile as any)?.hip_cm
  );
  const idealWeight = calculateIdealWeight(userHeight, userGender);
  const bodyType = determineBodyType(bmi, userMuscleMass);

  const userTargets = useMemo(() => {
    // Priority: 1. Synced macro data (real-time calculator results), 2. Profile from Sheets
    const syncedMacros = getMacroData();
    if (syncedMacros) {
      return {
        calories: syncedMacros.caloriesGoal || liveProfile?.calorie_target || 2000,
        protein: (liveProfile as any)?.protein_target || syncedMacros.proteinGoal || 150,
        goalWeight: (liveProfile as any)?.goal_weight || idealWeight.max || 70
      };
    }
    return {
      calories: liveProfile?.calorie_target || 2000,
      protein: (liveProfile as any)?.protein_target || 150,
      goalWeight: (liveProfile as any)?.goal_weight || idealWeight.max || 70
    };
  }, [liveProfile, nutritionData, idealWeight]);
  
  // Use synced streak data or profile fallback
  const currentStreak = streakData?.currentStreak || (user as any)?.current_streak || (liveProfile as any)?.current_streak || 0;
  const nextSession = (user as any)?.next_session_date || (liveProfile as any)?.next_session_date;

  // Plan Start Date from Google Sheets (liveProfile)
  const planStartDateDisplay = liveProfile?.plan_start_date ? 
    new Date(liveProfile.plan_start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 
    "NOT SET";

  // Debug logs to verify user object
  console.log("Dashboard User Object:", user);
  console.log("Dashboard Live Profile:", liveProfile);

  if (loadingProfile && !liveProfile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 pb-24 sm:pb-32 pt-2 sm:pt-4 px-3 sm:px-4">
        {/* Premium Header */}
        <header className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-1 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(0,255,157,0.5)]" />
                <p className="text-primary text-[10px] uppercase tracking-[0.4em] font-black">Command Center V2.0</p>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white leading-none tracking-tight uppercase"
              >
                HELLO, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-gradient-x">{firstName}</span>
              </motion.h1>
            </div>
            
            <div className="flex flex-col items-end gap-2 bg-white/[0.03] backdrop-blur-md border border-white/5 p-4 rounded-3xl min-w-[180px]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                <p className="text-primary/80 text-[10px] font-bold tracking-[0.2em] uppercase">Phase: Alpha One</p>
              </div>
              <p className="text-white/40 text-[9px] font-medium tracking-widest uppercase">Start: {planStartDateDisplay}</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Action Section */}
          <div className="lg:col-span-8 space-y-8">
            {/* Primary Focus Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="relative rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,157,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-5 sm:p-10 relative z-10 space-y-5 sm:space-y-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight truncate">
                      {nextSession ? `READY FOR TAKEOFF?` : "RECOVERY PROTOCOL ACTIVE"}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">
                      {nextSession ? "Your next milestone is waiting. Let's push boundaries today." : "Optimal recovery leads to peak performance. Stay hydrated."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setLocation('/app/plans')}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-4 sm:p-3 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-primary to-emerald-400 text-black shadow-[0_10px_30px_rgba(0,255,157,0.3)] transition-all group min-w-0 touch-manipulation active:scale-95"
                  >
                    <div className="w-11 h-11 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-black/10 flex items-center justify-center backdrop-blur-md shrink-0">
                      <Dumbbell className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-pulse" />
                    </div>
                    <span className="text-[10px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider text-center truncate w-full px-1">Deploy</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setLocation('/app/bodymap')}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-4 sm:p-3 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-primary/30 hover:bg-white/[0.05] transition-all group min-w-0 touch-manipulation active:scale-95 active:bg-white/[0.08]"
                  >
                    <div className="w-11 h-11 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Zap className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="text-[10px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider text-center text-white/80 group-hover:text-white truncate w-full px-1">Analyse</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setLocation('/app/workout-partner')}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-4 sm:p-3 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-accent/30 hover:bg-white/[0.05] transition-all group min-w-0 touch-manipulation active:scale-95 active:bg-white/[0.08]"
                  >
                    <div className="w-11 h-11 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                      <HeartPulse className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent" />
                    </div>
                    <span className="text-[10px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider text-center text-white/80 group-hover:text-white truncate w-full px-1">Partner</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Card 
                onClick={() => setLocation('/app/nutrition')}
                className="bg-white/[0.02] border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] space-y-4 md:space-y-6 hover:border-accent/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-accent">
                    <div className="p-2 bg-accent/10 rounded-xl">
                      <Utensils className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black">Bio-Fuel</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl md:text-4xl font-display font-black text-white leading-none">
                        {Math.max(0, userTargets.calories - (nutritionData?.calories || 0))}
                      </p>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mt-1 md:mt-2">KCAL LEFT</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl md:text-2xl font-display font-bold text-white/80 leading-none">
                        {Math.max(0, userTargets.protein - (nutritionData?.protein || 0))}G
                      </p>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mt-1 md:mt-2">PROTEIN</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (nutritionData?.calories || 0) / userTargets.calories * 100)}%` }}
                      className="h-full bg-accent shadow-[0_0_10px_rgba(255,0,85,0.5)]" 
                    />
                  </div>
                </div>
              </Card>

              <Card 
                onClick={() => setLocation('/app/streak')}
                className="bg-white/[0.02] border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] space-y-4 md:space-y-6 hover:border-orange-500/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-orange-500">
                    <div className="p-2 bg-orange-500/10 rounded-xl">
                      <Flame className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black">Momentum</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-5xl md:text-6xl font-display font-black text-white leading-none">{streakDaysCount}</p>
                  <div className="pb-1">
                    <p className="text-[10px] md:text-xs font-bold text-orange-500 uppercase">Days</p>
                    <p className="text-[8px] md:text-[9px] text-muted-foreground uppercase tracking-widest">Active</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={cn(
                      "flex-1 h-1 rounded-full transition-all duration-1000",
                      i < (streakDaysCount % 7) ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-white/5"
                    )} />
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Side Content Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <ImageBodyMap
                bodyType={bodyType}
                gender={userGender}
                bmi={bmi}
                bodyFat={bodyFat}
                idealWeight={ { min: 0, max: userTargets.goalWeight } }
                protein={userTargets.protein}
                onAnalysisClick={() => setLocation("/app/bodymap")}
              />
            </div>

            {/* Goal Progress Card */}
            <Card className="bg-gradient-to-br from-white/[0.03] to-transparent border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Target className="w-20 h-20" />
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">MISSION TARGET</p>
                    <p className="text-xl font-black text-white">{userTargets.goalWeight} KG</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">Current Progress</span>
                    <span className="text-primary">{Math.round((userWeight / userTargets.goalWeight) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (userWeight / userTargets.goalWeight) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-primary to-accent" 
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <AIGuideOrb />
    </Layout>
  );
}
