import { useMemo, useEffect, useState } from "react";
import { getUserById, UserProfile } from "@/lib/googleSheetsApi";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Flame,
  Utensils,
  Activity,
  ChevronRight,
  Heart,
  Scale,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/App";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMacroData, NutritionData } from "@/lib/nutritionSync";


// ============================
// TODAY FOCUS RESOLVER (SAFE)
// ============================
function getTodayFocus(day: number) {
  switch (day) {
    case 1:
      return "Upper Body Workout";
    case 2:
      return "Lower Body Workout";
    case 3:
      return "Fat Burn & Conditioning";
    case 4:
      return "Upper Body Workout";
    case 5:
      return "Lower Body Workout";
    case 6:
      return "Active Recovery";
    case 7:
      return "Rest Day";
    default:
      return "Workout Day";
  }
}


// Body type images
import maleObeseImg from "@/assets/body-types/male_obese_body_type.png";
import maleSkinnyImg from "@/assets/body-types/male_skinny_body_type.png";
import maleFitImg from "@/assets/body-types/male_fit_body_type.png";
import maleMuscularImg from "@/assets/body-types/male_muscular_body_type.png";
import femaleObeseImg from "@/assets/body-types/female_obese_body_type.png";
import femaleSkinnyImg from "@/assets/body-types/female_skinny_body_type.png";
import femaleFitImg from "@/assets/body-types/female_fit_body_type.png";
import femaleMuscularImg from "@/assets/body-types/female_muscular_body_type.png";

// ============================
// BODY TYPE + SOMATOTYPE LOGIC
// ============================

type BodyType = "obese" | "skinny" | "fit" | "muscular";
type Somatotype = "endomorph" | "ectomorph" | "mesomorph";

function determineBodyType(
  bmi: number,
  muscleMass: string = "average",
): BodyType {
  // Muscular override (important)
  if (muscleMass === "high" && bmi < 30) return "muscular";

  // Overweight + Obese → Obese bucket
  if (bmi >= 25) return "obese";

  if (bmi < 18.5) return "skinny";

  return "fit";
}

function calculateIdealWeight(
  heightCm: number,
  gender: string,
): { min: number; max: number } {
  const heightM = heightCm / 100;
  const minBmi = 18.5;
  const maxBmi = gender === "male" ? 24.9 : 23.9;
  return {
    min: Math.round(minBmi * heightM * heightM),
    max: Math.round(maxBmi * heightM * heightM),
  };
}

function calculateProteinIntake(weight: number, goal: string): number {
  const multiplier =
    goal === "muscle_gain" ? 2.2 : goal === "fat_loss" ? 2.0 : 1.6;
  return Math.round(weight * multiplier);
}

// ============================
// SOMATOTYPE DETECTION (BMI + MUSCLE MASS)
// ============================

function determineSomatotype(bmi: number, muscleMass?: string): Somatotype {
  if (bmi >= 27) return "endomorph";
  if (bmi < 19 && muscleMass !== "high") return "ectomorph";
  return "mesomorph";
}

function getSomatotypeRecommendation(type: Somatotype): string {
  switch (type) {
    case "endomorph":
      return "Focus on caloric deficit, high steps (8–12k/day), HIIT 2–3× weekly, and strength training with supersets. Reduce sugar & refined carbs.";
    case "ectomorph":
      return "Increase calories (+300–500 surplus), focus on heavy compound lifts, keep cardio low, and increase protein + carbs intake.";
    case "mesomorph":
      return "Follow a balanced training plan with progressive overload, moderate cardio, and high protein intake.";
    default:
      return "";
  }
}

// ============================
// IMAGE-BASED BODY TYPE DISPLAY
// ============================

function ImageBodyMap({
  bodyType,
  gender,
  somatotype,
  onAnalysisClick,
}: {
  bodyType: BodyType;
  gender: string;
  somatotype: string;
  onAnalysisClick: () => void;
}) {
  const bodyImages: Record<string, Record<BodyType, string>> = {
    male: {
      obese: maleObeseImg,
      skinny: maleSkinnyImg,
      fit: maleFitImg,
      muscular: maleMuscularImg,
    },
    female: {
      obese: femaleObeseImg,
      skinny: femaleSkinnyImg,
      fit: femaleFitImg,
      muscular: femaleMuscularImg,
    },
  };

  const selectedImage =
    bodyImages[gender.toLowerCase()]?.[bodyType] || bodyImages.male[bodyType];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onClick={onAnalysisClick}
      className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br from-black/60 via-black/40 to-black/20 border border-cyan-500/40 backdrop-blur-lg flex items-center justify-center"
      style={{
        boxShadow: "0 0 30px rgba(0, 234, 255, 0.3), inset 0 0 30px rgba(0, 234, 255, 0.1)",
      }}
    >
      {/* RADIAL GLOW BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 35%, rgba(0, 234, 255, 0.5) 0%, rgba(20, 240, 212, 0.2) 30%, transparent 70%)",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      {/* CORNER BRACKETS (Iron Man Style) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00eaff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#14f0d4" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Top-left corner */}
        <path
          d="M 5 5 L 5 20 M 5 5 L 20 5"
          stroke="url(#cornerGrad)"
          strokeWidth="0.3"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        {/* Top-right corner */}
        <path
          d="M 95 5 L 95 20 M 95 5 L 80 5"
          stroke="url(#cornerGrad)"
          strokeWidth="0.3"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        {/* Bottom-left corner */}
        <path
          d="M 5 95 L 5 80 M 5 95 L 20 95"
          stroke="url(#cornerGrad)"
          strokeWidth="0.3"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        {/* Bottom-right corner */}
        <path
          d="M 95 95 L 95 80 M 95 95 L 80 95"
          stroke="url(#cornerGrad)"
          strokeWidth="0.3"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* HOLOGRAM SCAN LINES */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0, 234, 255, 0.03) 0px, rgba(0, 234, 255, 0.03) 2px, transparent 2px, transparent 4px)",
          pointerEvents: "none",
        }}
      />

      {/* ANIMATED SCAN BEAM (Top to Bottom) */}
      <motion.div
        className="absolute left-0 w-full h-20"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(0, 234, 255, 0.2), transparent)",
          boxShadow: "0 0 20px rgba(20, 240, 212, 0.3)",
          pointerEvents: "none",
        }}
        animate={{ top: ["0%", "85%", "0%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ANIMATED PARTICLES (Enhanced) */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 0.5,
            height: Math.random() * 2 + 0.5,
            backgroundColor: i % 3 === 0 ? "#00eaff" : i % 3 === 1 ? "#14f0d4" : "#7ffcff",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            boxShadow: `0 0 ${Math.random() * 8 + 4}px currentColor`,
            filter: "blur(0.5px)",
          }}
          animate={{
            opacity: [0.1, 0.8, 0],
            scale: [0.6, 1.3, 0.6],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* BODY IMAGE WITH HOLOGRAM EFFECTS */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img
          src={selectedImage}
          alt={`${gender} ${bodyType}`}
          className="h-full object-contain max-w-full drop-shadow-2xl"
          style={{
            filter: "brightness(1.1) contrast(1.15) saturate(0.95) drop-shadow(0 0 30px rgba(0, 234, 255, 0.4))",
          }}
        />
      </motion.div>

      {/* HOLOGRAM RIM EFFECT */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: "inset 0 0 40px rgba(0, 234, 255, 0.15), inset 0 0 80px rgba(20, 240, 212, 0.05)",
        }}
      />

      {/* CATEGORY LABELS */}
      <div className="absolute bottom-4 left-4 flex flex-col space-y-2 z-20">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="px-3 py-1.5 rounded-lg backdrop-blur-md border border-cyan-500/60"
          style={{
            backgroundColor: "rgba(0, 100, 150, 0.25)",
            color: "#00eaff",
            boxShadow: "0 0 15px rgba(0, 234, 255, 0.3)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-wider">
            {bodyType.toUpperCase()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="px-3 py-1 rounded-lg backdrop-blur-md border border-teal-400/60"
          style={{
            backgroundColor: "rgba(20, 150, 150, 0.2)",
            color: "#14f0d4",
            boxShadow: "0 0 12px rgba(20, 240, 212, 0.25)",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest">
            {somatotype.toUpperCase()}
          </p>
        </motion.div>
      </div>

      {/* INTERACTIVE CTA BUTTON */}
      <motion.div
        className="absolute bottom-4 right-4 z-20"
        whileHover={{ scale: 1.08 }}
      >
     
      </motion.div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [liveProfile, setLiveProfile] = useState<UserProfile | null>(null);
const [loadingProfile, setLoadingProfile] = useState(true);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);



  //Fetch fresh profile in Dashboard
  useEffect(() => {
  if (!user?.userId) return;

  async function fetchProfile() {
    try {
      const data = await getUserById(user.userId);
      if (data) setLiveProfile(data);
    } catch (err) {
      console.error("Dashboard profile fetch failed:", err);
    } finally {
      setLoadingProfile(false);
    }
  }

  fetchProfile();
}, [user?.userId]);


  // Listen for nutrition data updates
  useEffect(() => {
    const data = getMacroData();
    setNutritionData(data);

    const handleNutritionUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<NutritionData | null>;
      setNutritionData(customEvent.detail);
    };

    window.addEventListener("nutrition-data-updated", handleNutritionUpdate);
    return () =>
      window.removeEventListener("nutrition-data-updated", handleNutritionUpdate);
  }, []);

  // ----------------------------
  // USER BASIC VALUES
  // ----------------------------
  const firstName = user?.name?.split(" ")[0]?.toUpperCase() || "CHAMP";
  const currentStreak = user?.currentStreak || 0;

const userHeight = liveProfile?.height_cm ?? 175;
const userWeight = liveProfile?.current_weight ?? 70;
const userGender = liveProfile?.gender ?? "male";
const userMuscleMass = liveProfile?.muscle_mass ?? "average";
  const goalWeight = liveProfile?.goal_weight;
const startingWeight = liveProfile?.starting_weight;

const progressStatus =
  goalWeight && userWeight > goalWeight ? "Losing" : "Gaining";

const weightDelta =
  startingWeight
    ? Math.abs(userWeight - startingWeight).toFixed(1)
    : "0.0";



  // ----------------------------
  // BODY CALCULATIONS
  // ----------------------------

const userTargets = useMemo(
  () => ({
    calories: liveProfile?.calorie_target ?? 2000,
    protein: liveProfile?.protein_target ?? 150,
    carbs: liveProfile?.carbs_target ?? 200,
    fats: liveProfile?.fats_target ?? 65,
  }),
  [liveProfile], // ✅ CORRECT
);


  const bmi = userWeight / Math.pow(userHeight / 100, 2);
  const bodyType = determineBodyType(bmi, userMuscleMass);
  const idealWeight = calculateIdealWeight(userHeight, userGender);
  const recommendedProtein = calculateProteinIntake(userWeight, "muscle_gain");

  // SOMATOTYPE PROFILE
  const somatotype = determineSomatotype(bmi, userMuscleMass);
  const somatotypeAdvice = getSomatotypeRecommendation(somatotype);

  // ----------------------------
  // PROGRAM INFO
  // ----------------------------
  const programInfo = useMemo(() => {
    if (!user?.programStartDate || !user?.programEndDate) {
      return { currentDay: 1, totalDays: 90, currentWeek: 1 };
    }
    const start = new Date(user.programStartDate);
    const end = new Date(user.programEndDate);
    const now = new Date();

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const currentDay = Math.max(
      1,
      Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const currentWeek = Math.ceil(currentDay / 7);

    return {
      currentDay: Math.min(currentDay, totalDays),
      totalDays,
      currentWeek,
    };
  }, [user]);
if (loadingProfile) {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">
            Syncing your profile…
          </p>
        </div>
      </div>
    </Layout>
  );
}

  return (
    <Layout>
      <div className="space-y-8">
        {/* ---------------------------------- */}
        {/* WELCOME HEADER */}
        {/* ---------------------------------- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
              WELCOME BACK,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {firstName}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your body is a machine. Keep it tuned.
            </p>
          </div>

          <Link href="/app/streak">
            <Button className="bg-orange-500/10 text-orange-500 border border-orange-500/50 hover:bg-orange-500 hover:text-white transition-all group">
              YOUR STREAK: {currentStreak} DAYS{" "}
              <Flame className="w-4 h-4 ml-2 group-hover:animate-bounce" />
            </Button>
          </Link>
        </div>

        {/* ================================== */}
        {/* PART 1: BODY ANALYSIS (PRIMARY) */}
        {/* ================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/80 to-black/80 p-1">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50" />

          <div className="grid lg:grid-cols-3 gap-8 p-6 lg:p-12">
            {/* LEFT SIDE — BODY STATS + SOMATOTYPE */}
            <div className="lg:col-span-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Body Analysis
              </div>

              <h2 className="text-3xl font-display font-bold">
                YOUR BODY <span className="text-primary">PROFILE</span>
              </h2>

              <p className="text-muted-foreground">
                Your personalized assessment powered by body composition,
                somatotype science and BMI.
              </p>

              {/* BMI */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Heart className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-xs text-muted-foreground">BMI</p>
                  <p className="font-bold text-white">{bmi.toFixed(1)}</p>
                </div>
              </div>

              {/* Ideal Weight */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Scale className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Target Weight</p>
                  <p className="font-bold text-white">
                    {idealWeight.min}-{idealWeight.max} kg
                  </p>
                </div>
              </div>

              {/* Protein */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Daily Protein</p>
                  <p className="font-bold text-white">{recommendedProtein}g</p>
                </div>
              </div>

              {/* SOMATOTYPE */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mt-4">
                <p className="text-sm text-primary font-bold uppercase tracking-wider">
                  {somatotype.toUpperCase()} PROFILE
                </p>
                <p className="text-white mt-1">{somatotypeAdvice}</p>
              </div>

              <Link href="/app/progress">
                <Button className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-bold tracking-wide h-12 px-8">
                  VIEW FULL PROGRESS <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* RIGHT SIDE — IMAGE-BASED BODY TYPE */}
            <div className="lg:col-span-2 relative">
              <ImageBodyMap
                bodyType={bodyType}
                gender={userGender}
                somatotype={somatotype}
                onAnalysisClick={() => setLocation("/app/bodymap")}
              />
            </div>
          </div>
        </section>
                  

        {/* ================================== */}
     
{/* ================================== */}
{/* PART 2: TODAY FOCUS BUTTON */}
{/* ================================== */}

<Link href="/app/plans">
  <Card className="bg-card/40 border-white/5 p-6 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all h-full">
    <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all" />

    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">
          Today's Focus
        </p>

        <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
          {getTodayFocus(programInfo.currentDay)}
          <ChevronRight className="w-5 h-5 text-primary" />
        </h3>

        <p className="text-xs mt-1 text-primary opacity-80">
          Week {programInfo.currentWeek} • Day {programInfo.currentDay}
        </p>
      </div>

      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
        <Activity className="w-6 h-6" />
      </div>
    </div>

    <p className="text-muted-foreground text-sm mb-4">
      {programInfo.currentDay === 7
        ? "Recovery & mobility recommended"
        : "45–60 min session ready"}
    </p>

    <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 font-bold">
      VIEW WORKOUT PLANS
    </Button>
  </Card>
</Link>



        {/* ================================== */}
        {/* PART 3: ACTION BUTTONS (NUTRITION) */}
        {/* ================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/app/nutrition">
            <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 font-bold h-12 neon-glow-primary">
              📊 MACRO CALCULATOR
            </Button>
          </Link>
          <Link href="/app/nutrition?tab=recipes">
            <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 font-bold h-12 neon-glow-primary">
              🥗 RECIPES
            </Button>
          </Link>
          <Link href="/app/nutrition?tab=hacks">
            <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 font-bold h-12 neon-glow-primary">
              💪 PROTEIN HACKS
            </Button>
          </Link>
        </div>

        {/* ================================== */}
        {/* PART 4: FUEL TRACKER (TODAY ONLY) */}
        {/* ================================== */}

        <Link href="/app/nutrition">
          <Card className="bg-card/40 border-primary/20 p-6 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all neon-card">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">
                  Fuel Tracker 
                </p>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                  {nutritionData?.calories || userTargets.calories} kcal{" "}
                  <ChevronRight className="w-5 h-5 text-primary" />
                </h3>
                <p className="text-xs mt-1 text-primary">
                  {nutritionData
                    ? "Data synced with Macro Calculator"
                    : "Submit via Macro Calculator"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Daily Progress</span>
                <span className="text-primary font-bold">
                  {nutritionData
                    ? Math.round(
                        (nutritionData.calories / nutritionData.caloriesGoal) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all neon-glow-primary"
                  style={{
                    width: nutritionData
                      ? `${Math.min((nutritionData.calories / nutritionData.caloriesGoal) * 100, 100)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 font-bold neon-glow-primary">
              OPEN MACRO CALCULATOR
            </Button>
          </Card>
        </Link>

        {/* ================================== */}
        {/* PART 5: PROGRESS SNAPSHOT */}
        {/* ================================== */}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card/40 border-white/5 p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-50" />
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Latest Weight</p>
            <h3 className="text-2xl font-display font-bold text-white">
              {liveProfile?.current_weight ?? userWeight} kg
            </h3>
            <p className="text-xs text-muted-foreground mt-2">
              Goal: {liveProfile?.goal_weight ?? "N/A"} kg
            </p>
          </Card>

          <Card className="bg-card/40 border-white/5 p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-50" />
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Progress</p>
           <h3 className="text-2xl font-display font-bold text-primary">
  {progressStatus}
</h3>

<p className="text-xs text-muted-foreground mt-2">
  {weightDelta} kg from start
</p>

          </Card>
        </div>

        {/* ================================== */}
        {/* PART 6: STREAK DISPLAY */}
        {/* ================================== */}

        <Link href="/app/streak">
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 p-8 relative overflow-hidden group cursor-pointer hover:border-orange-500/50 transition-all">
            <div className="absolute right-0 top-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl opacity-50" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">
                  🔥 Active Streak
                </p>
                <h3 className="text-4xl font-display font-bold text-orange-500">
                  {currentStreak} DAYS
                </h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Keep the momentum going!
                </p>
              </div>
              <div className="text-6xl">🔥</div>
            </div>
          </Card>
        </Link>
      </div>
    </Layout>
  );
}
