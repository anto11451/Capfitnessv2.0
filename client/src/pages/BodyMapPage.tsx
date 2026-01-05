import { useMemo, useEffect, useState } from "react";
import { getUserById, UserProfile } from "@/lib/googleSheetsApi";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { 
  Activity, 
  Target, 
  Scale, 
  Info, 
  ChevronRight,
  TrendingUp,
  Dumbbell
} from "lucide-react";
import { useAuth } from "@/App";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function BodyMapPage() {
  const { user } = useAuth();
  const [liveProfile, setLiveProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = (user as any)?.user_id || localStorage.getItem('user_id');
    if (!id) {
      setLoading(false);
      return;
    }
    async function fetchProfile() {
      try {
        const data = await getUserById(id!);
        if (data) setLiveProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const userHeight = liveProfile?.height_cm ?? 175;
  const userWeight = liveProfile?.current_weight ?? 70;
  const userGender = liveProfile?.gender ?? "male";
  const userMuscleMass = (liveProfile as any)?.muscle_mass ?? "average";
  const proteinTarget = (liveProfile as any)?.protein_target ?? 150;

  const bmi = userWeight / Math.pow(userHeight / 100, 2);
  const bodyType = determineBodyType(bmi, userMuscleMass);
  const idealWeight = calculateIdealWeight(userHeight, userGender);

  const bodyImages: Record<string, Record<BodyType, string>> = {
    male: { obese: maleObeseImg, skinny: maleSkinnyImg, fit: maleFitImg, muscular: maleMuscularImg },
    female: { obese: femaleObeseImg, skinny: femaleSkinnyImg, fit: femaleFitImg, muscular: femaleMuscularImg },
  };

  const selectedImage = bodyImages[userGender.toLowerCase()]?.[bodyType] || bodyImages.male[bodyType];

  if (loading) {
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
      <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4">
        <header className="space-y-2">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-bold">Analysis Core</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            BODY <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">ANALYSIS</span>
          </h1>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Visual Profile */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Current State</p>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{bodyType}</h2>
                  </div>
                  <div className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                    Live Data
                  </div>
                </div>
                
                <div className="aspect-[3/4] relative flex items-center justify-center">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={selectedImage}
                    alt="Body Analysis"
                    className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,255,157,0.1)]"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Metrics & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard 
                icon={Activity} 
                label="Body Mass Index" 
                value={bmi.toFixed(1)} 
                subValue={bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"}
                color="text-primary"
              />
              <MetricCard 
                icon={Scale} 
                label="Weight vs Goal" 
                value={`${userWeight}kg`} 
                subValue={`Target: ${idealWeight.max}kg`}
                color="text-accent"
              />
              <MetricCard 
                icon={Target} 
                label="Protein Target" 
                value={`${proteinTarget}g`} 
                subValue="Daily optimal intake"
                color="text-secondary"
              />
              <MetricCard 
                icon={TrendingUp} 
                label="Basal Metabolic Rate" 
                value={liveProfile?.calorie_target ? `${liveProfile.calorie_target}kcal` : "TBD"} 
                subValue="Daily maintenance"
                color="text-orange-500"
              />
            </div>

            <Card className="bg-white/[0.02] border-white/5 p-8 rounded-[2rem] space-y-6">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-white">Composition Analysis</h3>
              </div>
              
              <div className="space-y-4">
                <DetailRow label="Height" value={`${userHeight} cm`} />
                <DetailRow label="Muscle Mass" value={userMuscleMass} className="capitalize" />
                <DetailRow label="Gender" value={userGender} className="capitalize" />
                <DetailRow label="Ideal Range" value={`${idealWeight.min}kg - ${idealWeight.max}kg`} />
              </div>

              <div className="pt-6 border-t border-white/5">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "This analysis is calculated based on your current metrics and science-backed formulas. Your journey is unique—consistency in tracking will yield more accurate insights over time."
                </p>
              </div>
            </Card>

            <div className="flex items-center gap-4 p-6 bg-primary/5 border border-primary/10 rounded-3xl">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-tight">Ready to optimize?</p>
                <p className="text-xs text-muted-foreground">Adjust your workout plan based on this analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function MetricCard({ icon: Icon, label, value, subValue, color }: any) {
  return (
    <Card className="bg-white/[0.02] border-white/5 p-6 rounded-3xl space-y-3 hover:bg-white/[0.04] transition-colors">
      <div className={cn("flex items-center gap-2", color)}>
        <Icon className="w-4 h-4" />
        <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
      </div>
      <div>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{subValue}</p>
      </div>
    </Card>
  );
}

function DetailRow({ label, value, className }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-bold text-white", className)}>{value}</span>
    </div>
  );
}
