import { useMemo, useEffect, useState } from "react";
import { getUserById, UserProfile } from "@/lib/googleSheetsApi";
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
  Info
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/App";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMacroData, NutritionData } from "@/lib/nutritionSync";

// Body type images
import maleObeseImg from "@/assets/body-types/male_obese_body_type.png";
import maleSkinnyImg from "@/assets/body-types/male_skinny_body_type.png";
import maleFitImg from "@/assets/body-types/male_fit_body_type.png";
import maleMuscularImg from "@/assets/body-types/male_muscular_body_type.png";
import femaleObeseImg from "@/assets/body-types/female_obese_body_type.png";
import femaleSkinnyImg from "@/assets/body-types/female_skinny_body_type.png";
import femaleFitImg from "@/assets/body-types/female_fit_body_type.png";
import femaleMuscularImg from "@/assets/body-types/female_muscular_body_type.png";

type BodyType = "obese" | "skinny" | "fit" | "muscular";

function determineBodyType(bmi: number, muscleMass: string = "average"): BodyType {
  if (muscleMass === "high") return "muscular";
  if (bmi >= 30) return "obese";
  if (bmi < 18.5) return "skinny";
  return "fit";
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
  idealWeight,
  protein,
  onAnalysisClick,
}: {
  bodyType: BodyType;
  gender: string;
  bmi: number;
  idealWeight: { min: number; max: number };
  protein: number;
  onAnalysisClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const bodyImages: Record<string, Record<BodyType, string>> = {
    male: { obese: maleObeseImg, skinny: maleSkinnyImg, fit: maleFitImg, muscular: maleMuscularImg },
    female: { obese: femaleObeseImg, skinny: femaleSkinnyImg, fit: femaleFitImg, muscular: femaleMuscularImg },
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
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Target</p>
                  <p className="text-white font-medium">{idealWeight.max}kg</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Daily Protein</p>
                <p className="text-white font-medium">{protein}g</p>
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
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
        className="relative group"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all animate-pulse" />
        <div className="relative w-16 h-16 bg-black border border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all active:scale-90 group-hover:border-primary group-hover:scale-105 overflow-hidden">
          {/* Inner 3D Sphere Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,157,0.4),transparent)]" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary via-accent to-primary animate-[spin_3s_linear_infinite] shadow-[0_0_20px_rgba(0,255,157,0.6)] relative z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(0,255,157,0.1)_50%,transparent_55%)] animate-[pulse_2s_ease-in-out_infinite]" />
        </div>
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [liveProfile, setLiveProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);

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
  const userTargets = useMemo(() => ({
    calories: liveProfile?.calorie_target ?? 2000,
    protein: (liveProfile as any)?.protein_target ?? 150,
  }), [liveProfile]);

  const bmi = userWeight / Math.pow(userHeight / 100, 2);
  const bodyType = determineBodyType(bmi, userMuscleMass);
  const idealWeight = calculateIdealWeight(userHeight, userGender);
  const currentStreak = (user as any)?.current_streak || (liveProfile as any)?.current_streak || 0;
  const nextSession = (user as any)?.next_session_date || (liveProfile as any)?.next_session_date;

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
      <div className="max-w-4xl mx-auto space-y-12 pb-24">
        {/* Minimal Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-primary text-xs uppercase tracking-[0.2em] font-bold">Your Command Center</p>
            <p className="text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase">Logged in as {firstName}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight uppercase">
              Welcome back, <span className="text-primary">{firstName}</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium italic">
              "Consistency is the playground of excellence. Let's make today count."
            </p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Focus & Guidance */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Compass className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Today's Focus</span>
            </div>
            {/* Today's Focus - Coach Tone */}
            <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2rem] relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 text-primary/80">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Coach's Guidance</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white leading-snug">
                    {nextSession ? `Time to crush your session.` : "Today is for recovery, Champ."}
                  </h3>
                  <p className="text-muted-foreground/80 text-sm leading-relaxed">
                    {nextSession 
                      ? "You've been consistent. Let's keep that momentum going and hit those targets today." 
                      : "Rest is just as important as the work. Focus on hydration and mobility today."}
                  </p>
                </div>

                <Button 
                  onClick={() => setLocation('/app/plans')}
                  className="bg-primary text-black hover:bg-white hover:text-black transition-all rounded-full px-8 py-6 h-auto font-bold tracking-tight shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                >
                  START SESSION
                </Button>
              </div>
              <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-primary/10 transition-colors">
                <Zap className="w-24 h-24 rotate-12" />
              </div>
            </Card>

            {/* Calories & Streak Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/[0.02] border-white/5 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Utensils className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Fuel</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{(nutritionData?.calories || userTargets.calories)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Remaining kcal</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setLocation('/app/nutrition')}
                  className="w-full text-xs text-accent hover:bg-accent/10 border border-accent/20 rounded-xl"
                >
                  Log Food
                </Button>
              </Card>

              <Card className="bg-white/[0.02] border-white/5 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-orange-500">
                  <Flame className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Momentum</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{currentStreak}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</p>
                </div>
                <p className="text-[10px] text-orange-500/80 font-medium">
                  {currentStreak === 0 ? "Start your journey today!" : "Keep the fire burning!"}
                </p>
              </Card>
            </div>
          </div>

          {/* Right Column: Body Snapshot */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Info className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Body Snapshot</span>
              </div>
              <Link href="/app/bodymap" className="text-[10px] uppercase tracking-widest text-primary font-bold hover:underline">
                Full Details
              </Link>
            </div>
            
            <ImageBodyMap
              bodyType={bodyType}
              gender={userGender}
              bmi={bmi}
              idealWeight={idealWeight}
              protein={userTargets.protein}
              onAnalysisClick={() => setLocation("/app/bodymap")}
            />

            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Goal</p>
                  <p className="text-sm font-medium text-white">Reaching {idealWeight.max}kg Body Weight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AIGuideOrb />
    </Layout>
  );
}
