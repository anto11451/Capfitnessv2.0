import { useMemo } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Zap, ChevronRight, Scale, Dumbbell } from 'lucide-react';

interface BodyAnalysisProps {
  weight?: number;
  height?: number;
  bodyFat?: number;
  muscleMass?: string;
  gender?: string;
}

type SomatoType = 'skinny' | 'fit' | 'muscular' | 'obese';

function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

function determineSomatotype(bmi: number, muscleMass?: string): SomatoType {
  if (muscleMass === 'high' || muscleMass === 'very-high') {
    if (bmi < 18.5) return 'fit';
    if (bmi < 30) return 'muscular';
    return 'muscular';
  }
  
  if (muscleMass === 'moderate') {
    if (bmi < 18.5) return 'skinny';
    if (bmi < 27) return 'fit';
    return 'obese';
  }
  
  if (bmi < 18.5) return 'skinny';
  if (bmi < 25) return 'fit';
  if (bmi < 30) return 'obese';
  return 'obese';
}

function getIdealWeightRange(heightCm: number, gender: string): { min: number; max: number } {
  const heightM = heightCm / 100;
  const minBMI = 18.5;
  const maxBMI = gender === 'female' ? 24 : 25;
  
  return {
    min: Math.round(minBMI * heightM * heightM),
    max: Math.round(maxBMI * heightM * heightM),
  };
}

function getRecommendedProtein(weight: number, muscleMass?: string): number {
  const multiplier = muscleMass === 'high' || muscleMass === 'very-high' ? 2.2 : 1.8;
  return Math.round(weight * multiplier);
}

const somatypeStyles: Record<SomatoType, { gradient: string; label: string; description: string }> = {
  skinny: {
    gradient: 'from-blue-400 via-cyan-400 to-blue-500',
    label: 'Ectomorph',
    description: 'Focus on caloric surplus & strength training'
  },
  fit: {
    gradient: 'from-green-400 via-emerald-400 to-green-500',
    label: 'Mesomorph',
    description: 'Maintain with balanced training & nutrition'
  },
  muscular: {
    gradient: 'from-purple-400 via-pink-400 to-purple-500',
    label: 'Athletic',
    description: 'Elite conditioning - keep pushing limits'
  },
  obese: {
    gradient: 'from-orange-400 via-red-400 to-orange-500',
    label: 'Endomorph',
    description: 'Focus on cardio & caloric deficit'
  }
};

function HolographicBody({ somatype }: { somatype: SomatoType }) {
  const bodyWidths: Record<SomatoType, { chest: string; waist: string; hips: string }> = {
    skinny: { chest: 'w-12', waist: 'w-8', hips: 'w-10' },
    fit: { chest: 'w-16', waist: 'w-10', hips: 'w-14' },
    muscular: { chest: 'w-20', waist: 'w-12', hips: 'w-16' },
    obese: { chest: 'w-20', waist: 'w-20', hips: 'w-20' }
  };

  const widths = bodyWidths[somatype];
  const style = somatypeStyles[somatype];

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute inset-0 blur-3xl opacity-30">
        <div className={`w-full h-full bg-gradient-to-b ${style.gradient}`} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-b ${style.gradient} opacity-80 shadow-lg shadow-current`} />
        
        <div className="flex flex-col items-center -mt-1">
          <div className={`${widths.chest} h-6 rounded-t-2xl bg-gradient-to-b ${style.gradient} opacity-70`} />
          <div className={`${widths.waist} h-8 bg-gradient-to-b ${style.gradient} opacity-60`} />
          <div className={`${widths.hips} h-6 rounded-b-xl bg-gradient-to-b ${style.gradient} opacity-50`} />
        </div>
        
        <div className="flex gap-4 -mt-1">
          <div className={`w-3 h-20 rounded-b-full bg-gradient-to-b ${style.gradient} opacity-40`} />
          <div className={`w-3 h-20 rounded-b-full bg-gradient-to-b ${style.gradient} opacity-40`} />
        </div>
      </div>
      
      <div className="absolute inset-0 animate-pulse opacity-20">
        <div className={`w-full h-full bg-gradient-to-t ${style.gradient} blur-2xl`} />
      </div>
    </div>
  );
}

function MiniProgressGraph({ current, target }: { current: number; target: number }) {
  const percentage = Math.min((current / target) * 100, 100);
  const bars = [20, 35, 50, 40, 65, 55, 75, percentage];
  
  return (
    <div className="flex items-end gap-1 h-12">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-2 rounded-t transition-all ${
            i === bars.length - 1 
              ? 'bg-gradient-to-t from-primary to-accent animate-pulse' 
              : 'bg-white/20'
          }`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

export default function BodyAnalysis({ 
  weight = 70, 
  height = 175, 
  bodyFat,
  muscleMass,
  gender = 'male'
}: BodyAnalysisProps) {
  const analysis = useMemo(() => {
    const bmi = calculateBMI(weight, height);
    const somatype = determineSomatotype(bmi, muscleMass);
    const idealWeight = getIdealWeightRange(height, gender);
    const proteinTarget = getRecommendedProtein(weight, muscleMass);
    
    return { bmi, somatype, idealWeight, proteinTarget };
  }, [weight, height, muscleMass, gender]);

  const style = somatypeStyles[analysis.somatype];

  return (
    <Link href="/app/progress">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/80 to-black/80 p-1 cursor-pointer group hover:border-primary/30 transition-all">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50" />
        
        <div className="grid lg:grid-cols-3 gap-6 p-6 lg:p-8">
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="relative w-40 h-56">
              <HolographicBody somatype={analysis.somatype} />
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Body Analysis
                </div>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors">
                  {style.label} <span className="text-lg text-muted-foreground font-normal">Profile</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{style.description}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-3 bg-white/5 border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase">Ideal Weight</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {analysis.idealWeight.min}-{analysis.idealWeight.max} <span className="text-xs text-muted-foreground">kg</span>
                </p>
              </Card>

              <Card className="p-3 bg-white/5 border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground uppercase">Current</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {weight} <span className="text-xs text-muted-foreground">kg</span>
                </p>
              </Card>

              <Card className="p-3 bg-primary/10 border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Dumbbell className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary uppercase">Protein Target</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {analysis.proteinTarget} <span className="text-xs">g/day</span>
                </p>
              </Card>

              <Card className="p-3 bg-white/5 border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground uppercase">Progress</span>
                </div>
                <MiniProgressGraph current={weight} target={analysis.idealWeight.max} />
              </Card>
            </div>

            <Button className="w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 font-bold group-hover:bg-primary group-hover:text-black transition-all">
              <Target className="w-4 h-4 mr-2" />
              VIEW FULL PROGRESS TRACKER
            </Button>
          </div>
        </div>
      </section>
    </Link>
  );
}
