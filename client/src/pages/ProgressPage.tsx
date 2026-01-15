import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { AlertTriangle, Target, TrendingDown, Clock, Lock } from 'lucide-react';
import { format, differenceInDays, parseISO, addWeeks, isSameDay, startOfDay } from 'date-fns';
import { useAuth } from '@/App';
import { getUserProgress, submitProgress } from '@/lib/googleSheetsApi';

const WEIGHT_HISTORY_CACHE_KEY = 'capsfitness_weight_history_v2';

interface WeightEntry {
  date: string;
  weight: number;
}

export default function ProgressPage() {
  const { user } = useAuth();
  
  // 1. Normalize User Identity
  const userId = useMemo(() => user?.user_id || user?.id || null, [user]);
  
  // 2. Program Start Date Logic
  const programStart = useMemo(() => {
    // Check multiple possible keys coming from Google Sheets
    const startDate = user?.plan_start_date || 
                     user?.programStartDate || 
                     user?.plan_start || 
                     (user as any)?.["plan_start_date"] ||
                     (user as any)?.["Plan Start Date"];

    console.log("ProgressPage Debug - User Object:", user);
    console.log("ProgressPage Debug - Found Start Date Raw:", startDate);
    
    if (startDate) {
      try {
        const parsed = parseISO(startDate);
        if (!isNaN(parsed.getTime())) {
          return startOfDay(parsed);
        }
        
        // Handle potential string formats like "16-12-2025" or "2025-12-16"
        const dateParts = String(startDate).split(/[-/]/);
        if (dateParts.length === 3) {
          // Try YYYY-MM-DD
          let d = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
          if (isNaN(d.getTime())) {
            // Try DD-MM-YYYY
            d = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
          }
          if (!isNaN(d.getTime())) return startOfDay(d);
        }
      } catch (e) {
        console.error("ProgressPage: Invalid start date format:", startDate);
      }
    }
    return null;
  }, [user]);

  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 3. Data Loading & Caching Strategy
  useEffect(() => {
    async function loadData() {
      if (!userId) return;

      // Load from cache first for snappy UI
      const cached = localStorage.getItem(`${WEIGHT_HISTORY_CACHE_KEY}_${userId}`);
      if (cached) {
        try {
          setWeightHistory(JSON.parse(cached));
        } catch (e) {
          localStorage.removeItem(`${WEIGHT_HISTORY_CACHE_KEY}_${userId}`);
        }
      }

      try {
        setLoading(true);
        // Source of Truth: Google Sheets
        const remoteData = await getUserProgress(userId);
        
        if (remoteData) {
          let history: WeightEntry[] = remoteData
            .filter(p => p.weight_kg !== undefined && p.weight_kg !== null)
            .map(p => ({
              date: p.date,
              weight: Number(p.weight_kg)
            }));

          // 5. Starting Weight Handling
          const startingWeight = Number(user?.starting_weight || user?.startingWeight);
          if (history.length === 0 && startingWeight && programStart) {
            history.push({
              date: format(programStart, 'yyyy-MM-dd'),
              weight: startingWeight
            });
          }

          history.sort((a, b) => a.date.localeCompare(b.date));
          
          setWeightHistory(history);
          // Update cache with fresh data
          localStorage.setItem(`${WEIGHT_HISTORY_CACHE_KEY}_${userId}`, JSON.stringify(history));
        }
      } catch (error) {
        console.error("Failed to sync with Google Sheets:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId, programStart, user?.starting_weight, user?.startingWeight]);

  // 4. Weight Logging Logic
  const handleAddWeight = async () => {
    if (!userId || !newWeight || isSubmitting) return;
    
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0 || weight > 500) {
      alert("Please enter a valid weight between 0 and 500kg.");
      return;
    }

    const logDate = selectedDate || format(new Date(), 'yyyy-MM-dd');
    setIsSubmitting(true);

    try {
      // Optimistic Update
      const updatedHistory = [...weightHistory];
      const existingIndex = updatedHistory.findIndex(e => e.date === logDate);
      
      if (existingIndex >= 0) {
        updatedHistory[existingIndex].weight = weight;
      } else {
        updatedHistory.push({ date: logDate, weight });
      }
      updatedHistory.sort((a, b) => a.date.localeCompare(b.date));
      
      setWeightHistory(updatedHistory);
      localStorage.setItem(`${WEIGHT_HISTORY_CACHE_KEY}_${userId}`, JSON.stringify(updatedHistory));
      setNewWeight('');

      // Persist to Source of Truth
      await submitProgress(userId, logDate, { weight });
    } catch (error) {
      console.error("Failed to log weight:", error);
      alert("Failed to save weight. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Time & Trend Calculations
  const calculations = useMemo(() => {
    if (!programStart) return null;

    const today = startOfDay(new Date());
    const daysElapsed = Math.max(0, differenceInDays(today, programStart));
    const weeksElapsed = daysElapsed / 7;
    
    const startingWeight = Number(user?.starting_weight || user?.startingWeight || (weightHistory[0]?.weight) || 0);
    const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : startingWeight;
    const goalWeight = Number(user?.goal_weight || user?.goalWeight || 0);

    const totalChange = currentWeight - startingWeight;
    const totalToGoal = goalWeight - startingWeight;
    
    // 8. Average Weekly Change (>= 7 days required)
    const avgWeeklyChange = weeksElapsed >= 1 ? (totalChange / weeksElapsed) : null;

    // 9. Goal Progress Logic
    let progressPercent = 0;
    if (startingWeight !== goalWeight && totalToGoal !== 0) {
      const progress = (currentWeight - startingWeight) / totalToGoal;
      progressPercent = Math.min(100, Math.max(0, progress * 100));
    }

    // 7. Weekly Tracking Phases (Phase 1 = Week 1, etc.)
    const currentPhase = Math.floor(weeksElapsed) + 1;

    return {
      daysElapsed,
      weeksElapsed,
      currentPhase,
      startingWeight,
      currentWeight,
      goalWeight,
      totalChange,
      avgWeeklyChange,
      progressPercent,
      isGoalReached: (totalToGoal < 0 ? currentWeight <= goalWeight : currentWeight >= goalWeight) && goalWeight !== 0
    };
  }, [programStart, weightHistory, user]);

  // 10. Milestones Logic
  const milestones = useMemo(() => {
    if (!calculations || calculations.startingWeight === 0 || calculations.goalWeight === 0) return [];
    
    const { startingWeight, goalWeight, currentWeight } = calculations;
    const totalToGoal = goalWeight - startingWeight;
    
    if (Math.abs(totalToGoal) < 1) return []; // Hide if change is too small

    const steps = [];
    const numMilestones = 6; // Changed from 4 to 6 milestones
    const stepSize = totalToGoal / numMilestones;

    for (let i = 1; i <= numMilestones; i++) {
      const target = Number((startingWeight + (stepSize * i)).toFixed(1));
      const isDone = totalToGoal < 0 ? currentWeight <= target : currentWeight >= target;
      
      steps.push({
        label: `Reach ${target} kg`,
        done: isDone
      });
    }
    return steps;
  }, [calculations]);

  const chartData = useMemo(() => {
    return weightHistory.map((entry, index) => ({
      name: `W${Math.floor(differenceInDays(parseISO(entry.date), programStart || new Date()) / 7) + 1}`,
      weight: entry.weight,
      fullDate: format(parseISO(entry.date), 'MMM d'),
      fullDateRaw: entry.date
    }));
  }, [weightHistory, programStart]);

  if (!userId) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <Lock className="w-12 h-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
          <p className="text-muted-foreground">Please log in to track your progress.</p>
        </div>
      </Layout>
    );
  }

  if (!programStart) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
            <Clock className="w-10 h-10 text-accent" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold text-white">PROGRAM NOT STARTED</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your personalized fitness journey hasn't officially begun yet. 
              Complete your intake or wait for your coach to activate your plan.
            </p>
          </div>
          <Button onClick={() => window.location.href = '/app'} className="bg-accent text-black font-bold">
            Return to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const {
    daysElapsed,
    currentPhase,
    startingWeight,
    currentWeight,
    goalWeight,
    totalChange,
    avgWeeklyChange,
    progressPercent,
    isGoalReached
  } = calculations!;

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">PROGRESS <span className="text-accent">TRACKER</span></h1>
            <p className="text-muted-foreground">Deterministic data for your transformation.</p>
          </div>
          <div className="flex items-center gap-3 bg-card/40 border border-white/5 p-3 rounded-2xl backdrop-blur-xl">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Active Phase</p>
              <p className="text-xl font-bold text-white">Phase {currentPhase}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Days in</p>
              <p className="text-xl font-bold text-accent">{daysElapsed}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <Card className="lg:col-span-2 bg-card/40 border-white/5 p-6 backdrop-blur-xl flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="text-xl font-bold text-white">Weight Trend</h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-end sm:items-center">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest ml-1">Log Date</p>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={isSubmitting}
                    className="bg-black/20 border-white/10 h-10 w-full sm:w-44 text-white font-medium focus:ring-accent/50"
                  />
                </div>
                
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest ml-1">Weight (kg)</p>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Input
                      type="number"
                      placeholder="00.0"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      disabled={isSubmitting}
                      className="bg-black/20 border-white/10 h-10 w-full sm:w-28 text-accent font-bold placeholder:text-muted-foreground/30"
                    />
                    <Button 
                      onClick={handleAddWeight} 
                      disabled={isSubmitting || !newWeight}
                      className="bg-accent text-black font-bold hover:bg-accent/80 h-10 px-8 shadow-[0_0_15px_rgba(0,243,255,0.2)] active:scale-95 transition-all"
                    >
                      {isSubmitting ? "Syncing..." : "Add Entry"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[350px] w-full mt-auto">
              {weightHistory.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={false}
                      domain={['dataMin - 2', 'dataMax + 2']} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#00f3ff' }}
                      labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) {
                          return format(parseISO(payload[0].payload.fullDateRaw), 'do MMMM');
                        }
                        return label;
                      }}
                      labelStyle={{ color: '#71717a', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#00f3ff" 
                      fillOpacity={1} 
                      fill="url(#colorWeight)" 
                      strokeWidth={3}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                   <p className="text-muted-foreground">Add more logs to see your trend</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
              <div className="space-y-1">
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Avg Change</p>
                 <p className={cn("text-xl font-bold", (avgWeeklyChange || 0) <= 0 ? "text-green-400" : "text-white")}>
                   {avgWeeklyChange !== null ? `${avgWeeklyChange > 0 ? '+' : ''}${avgWeeklyChange.toFixed(1)} kg/wk` : '---'}
                 </p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Total Change</p>
                 <p className="text-xl font-bold text-white">
                   {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)} kg
                 </p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Last Entry</p>
                 <p className="text-xl font-bold text-white">
                   {weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : startingWeight} kg
                 </p>
              </div>
            </div>
          </Card>

          {/* Sidebar Section */}
          <div className="space-y-6">
            <Card className="bg-card/40 border-white/5 p-6 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
               <div className="flex items-center gap-2 mb-4">
                 <Target className="w-4 h-4 text-accent" />
                 <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Goal Progress</h3>
               </div>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-3xl font-display font-bold text-white">{goalWeight} kg</p>
                     <p className="text-[10px] text-muted-foreground uppercase">Target Weight</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xl font-bold text-accent">{Math.round(progressPercent)}%</p>
                     <p className="text-[10px] text-muted-foreground uppercase">Completed</p>
                   </div>
                 </div>

                 <div className="h-3 bg-black/40 rounded-full overflow-hidden p-0.5">
                   <div 
                     className="h-full bg-accent shadow-[0_0_15px_rgba(0,243,255,0.6)] transition-all duration-1000 ease-out rounded-full" 
                     style={{ width: `${progressPercent}%` }}
                   />
                 </div>

                 <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl">
                   <p className="text-xs text-accent-foreground leading-relaxed italic">
                     {isGoalReached 
                        ? "Goal reached! Maintain your success or set a new target."
                        : progressPercent > 50 
                        ? "You're past the halfway mark. Finish strong!"
                        : "Focus on the next 2kg. You have the momentum."}
                   </p>
                 </div>
               </div>
            </Card>

            {milestones.length > 0 && (
              <Card className="bg-card/40 border-white/5 p-6 backdrop-blur-xl">
                 <div className="flex items-center gap-2 mb-6">
                   <TrendingDown className="w-4 h-4 text-accent" />
                   <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Milestones</h3>
                 </div>
                 <div className="space-y-4">
                   {milestones.map((m, i) => (
                     <div key={i} className="flex items-center gap-4">
                       <div className={cn(
                         "w-6 h-6 rounded-lg flex items-center justify-center border transition-all",
                         m.done 
                          ? "bg-accent border-accent text-black shadow-[0_0_10px_rgba(0,243,255,0.3)]" 
                          : "border-white/10 text-transparent bg-white/5"
                       )}>
                         <span className="text-xs font-bold">✓</span>
                       </div>
                       <span className={cn(
                         "text-sm font-medium transition-all",
                         m.done ? "text-white/40 line-through" : "text-white"
                       )}>
                         {m.label}
                       </span>
                     </div>
                   ))}
                 </div>
              </Card>
            )}

            <Card className="bg-yellow-500/5 border-yellow-500/10 p-5 backdrop-blur-xl">
              <div className="flex gap-4">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Consistency Note</h4>
                  <p className="text-[11px] text-yellow-200/60 leading-relaxed">
                    Weight fluctuates based on hydration and salt intake. For high-fidelity tracking, weigh yourself every morning under the same conditions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

