import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { AlertTriangle, Target, TrendingDown, Clock } from 'lucide-react';
import { format, differenceInDays, parseISO, addWeeks } from 'date-fns';
import { useAuth } from '@/App';

const WEIGHT_HISTORY_KEY_PREFIX = 'capsfitness_weight_history_';

interface WeightEntry {
  date: string;
  weight: number;
}

export default function ProgressPage() {
  const { user } = useAuth();
  
  const programStart = useMemo(() => {
    if (user?.programStartDate) {
      try {
        const parsed = parseISO(user.programStartDate);
        if (!isNaN(parsed.getTime())) return parsed;
      } catch { /* fallback */ }
    }
    return new Date();
  }, [user?.programStartDate]);
  
  const programEnd = useMemo(() => {
    if (user?.programEndDate) {
      try {
        const parsed = parseISO(user.programEndDate);
        if (!isNaN(parsed.getTime())) return parsed;
      } catch { /* fallback */ }
    }
    return addWeeks(new Date(), 12);
  }, [user?.programEndDate]);
  
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState('');
  
  const userStorageKey = useMemo(() => {
    return user?.email ? `${WEIGHT_HISTORY_KEY_PREFIX}${user.email}` : null;
  }, [user?.email]);
  
  useEffect(() => {
    if (!user || !userStorageKey) {
      setWeightHistory([]);
      return;
    }
    
    const stored = localStorage.getItem(userStorageKey);
    if (stored) {
      setWeightHistory(JSON.parse(stored));
    } else {
      const initialHistory: WeightEntry[] = [
        { date: format(programStart, 'yyyy-MM-dd'), weight: user.startingWeight }
      ];
      if (user.currentWeight !== user.startingWeight) {
        initialHistory.push({ date: format(new Date(), 'yyyy-MM-dd'), weight: user.currentWeight });
      }
      setWeightHistory(initialHistory);
      localStorage.setItem(userStorageKey, JSON.stringify(initialHistory));
    }
  }, [user, userStorageKey, programStart]);
  
  const handleAddWeight = () => {
    if (!userStorageKey) return;
    
    const weight = parseFloat(newWeight);
    if (!isNaN(weight) && weight > 0) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const existingIndex = weightHistory.findIndex(e => e.date === today);
      let updatedHistory: WeightEntry[];
      
      if (existingIndex >= 0) {
        updatedHistory = [...weightHistory];
        updatedHistory[existingIndex].weight = weight;
      } else {
        updatedHistory = [...weightHistory, { date: today, weight }];
      }
      
      updatedHistory.sort((a, b) => a.date.localeCompare(b.date));
      setWeightHistory(updatedHistory);
      localStorage.setItem(userStorageKey, JSON.stringify(updatedHistory));
      setNewWeight('');
    }
  };
  
  const chartData = useMemo(() => {
    return weightHistory.map((entry, index) => ({
      name: `Week ${index + 1}`,
      weight: entry.weight,
      date: entry.date
    }));
  }, [weightHistory]);
  
  const startingWeight = user?.startingWeight || 80;
  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : (user?.currentWeight || 80);
  const goalWeight = user?.goalWeight || 75;
  
  const totalWeightToLose = startingWeight - goalWeight;
  const weightLost = startingWeight - currentWeight;
  const weightRemaining = currentWeight - goalWeight;
  const weightProgressPercent = totalWeightToLose > 0 ? Math.min(100, Math.max(0, (weightLost / totalWeightToLose) * 100)) : 0;
  
  const today = new Date();
  const totalProgramDays = differenceInDays(programEnd, programStart);
  const daysElapsed = differenceInDays(today, programStart);
  const daysRemaining = differenceInDays(programEnd, today);
  const timeProgressPercent = totalProgramDays > 0 ? Math.min(100, Math.max(0, (daysElapsed / totalProgramDays) * 100)) : 0;
  
  const weeksElapsed = Math.max(1, Math.ceil(daysElapsed / 7));
  const avgWeeklyChange = weeksElapsed > 0 ? (weightLost / weeksElapsed).toFixed(1) : '0';
  
  const weeksToGoal = parseFloat(avgWeeklyChange) > 0 ? Math.ceil(weightRemaining / parseFloat(avgWeeklyChange)) : null;
  
  const milestones = useMemo(() => {
    const steps = [];
    const step = totalWeightToLose > 0 ? Math.ceil(totalWeightToLose / 4) : 2;
    for (let i = 1; i <= 4; i++) {
      const targetWeight = startingWeight - (step * i);
      const actualTarget = Math.max(goalWeight, targetWeight);
      steps.push({
        label: `Hit ${actualTarget} kg`,
        done: currentWeight <= actualTarget
      });
      if (actualTarget === goalWeight) break;
    }
    return steps;
  }, [startingWeight, goalWeight, currentWeight, totalWeightToLose]);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">PROGRESS <span className="text-accent">TRACKER</span></h1>
          <p className="text-muted-foreground">Visualize your transformation.</p>
        </div>

        {/* Program Timeline */}
        <Card className="bg-card/40 border-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-white">Program Timeline</h3>
            {user?.planAssigned && (
              <span className="ml-auto px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full">
                {user.planAssigned}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Start Date</p>
              <p className="text-lg font-bold text-white">{format(programStart, 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Days Remaining</p>
              <p className="text-lg font-bold text-accent">{Math.max(0, daysRemaining)} days</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">End Date</p>
              <p className="text-lg font-bold text-white">{format(programEnd, 'MMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">Time Progress</span>
              <span className="text-accent">{Math.round(timeProgressPercent)}%</span>
            </div>
            <div className="h-3 bg-black/40 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-accent/80 to-accent shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-500"
                style={{ width: `${timeProgressPercent}%` }}
              />
              <div className="absolute inset-0 flex justify-between px-1">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div key={mark} className="w-0.5 h-full bg-white/10" />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {daysElapsed} of {totalProgramDays} days completed
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 bg-card/40 border-white/5 p-6 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Weight Trend</h3>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Log weight (kg)"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-32 h-8 text-sm bg-black/20 border-white/10"
                />
                <Button size="sm" onClick={handleAddWeight} className="bg-accent text-black hover:bg-accent/80">
                  Add
                </Button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(190, 100%, 50%)" 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
              <div className="text-center">
                 <p className="text-xs text-muted-foreground uppercase">Avg Change</p>
                 <p className="text-xl font-bold text-accent">{weightLost > 0 ? '-' : ''}{avgWeeklyChange} kg/wk</p>
              </div>
              <div className="text-center">
                 <p className="text-xs text-muted-foreground uppercase">Est. Completion</p>
                 <p className="text-xl font-bold text-white">{weeksToGoal ? `${weeksToGoal} Weeks` : 'N/A'}</p>
              </div>
              <div className="text-center">
                 <p className="text-xs text-muted-foreground uppercase">Total Lost</p>
                 <p className="text-xl font-bold text-white">{weightLost.toFixed(1)} kg</p>
              </div>
            </div>
          </Card>

          {/* Goal Tracker */}
          <div className="space-y-6">
            <Card className="bg-card/40 border-white/5 p-6 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
               <div className="flex items-center gap-2 mb-1">
                 <Target className="w-4 h-4 text-accent" />
                 <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Current Goal</h3>
               </div>
               <p className="text-2xl font-display font-bold text-white mb-4">
                 {user?.planAssigned || 'REACH'} {goalWeight} KG
               </p>
               
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-white">Weight Progress</span>
                   <span className="text-accent">{Math.round(weightProgressPercent)}%</span>
                 </div>
                 <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-accent shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-500" 
                     style={{ width: `${weightProgressPercent}%` }}
                   />
                 </div>
                 <div className="flex justify-between text-xs text-muted-foreground mt-2">
                   <span>{startingWeight} kg (start)</span>
                   <span>{weightRemaining > 0 ? `${weightRemaining.toFixed(1)} kg remaining` : 'Goal reached!'}</span>
                   <span>{goalWeight} kg (goal)</span>
                 </div>
               </div>
               
               <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                 <p className="text-sm italic text-accent-foreground">
                   {weightProgressPercent >= 100 
                     ? '"Congratulations! You\'ve reached your goal!"'
                     : weightProgressPercent >= 75 
                     ? '"Almost there! The finish line is in sight!"'
                     : weightProgressPercent >= 50 
                     ? '"You\'re halfway there! Keep pushing."'
                     : weightProgressPercent >= 25 
                     ? '"Great start! Momentum is building."'
                     : '"Every journey begins with a single step. You\'ve got this!"'}
                 </p>
               </div>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 backdrop-blur-xl">
               <div className="flex items-center gap-2 mb-4">
                 <TrendingDown className="w-4 h-4 text-accent" />
                 <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Milestones</h3>
               </div>
               <div className="space-y-4">
                 {milestones.map((m, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className={cn(
                       "w-5 h-5 rounded-full flex items-center justify-center border",
                       m.done ? "bg-accent border-accent text-black" : "border-white/20 text-transparent"
                     )}>
                       ✓
                     </div>
                     <span className={m.done ? "text-white line-through opacity-50" : "text-white"}>{m.label}</span>
                   </div>
                 ))}
               </div>
            </Card>
            
            {/* Weight Disclaimer */}
            <Card className="bg-yellow-900/20 border-yellow-500/20 p-4 backdrop-blur-xl">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-yellow-500 mb-1">Weight Tracking Disclaimer</h4>
                  <p className="text-xs text-yellow-200/70">
                    Weight can fluctuate daily due to water retention, food intake, and other factors. 
                    For accuracy, weigh yourself at the same time each day (ideally morning, after waking). 
                    Focus on weekly trends rather than daily changes. Consult a healthcare professional 
                    for personalized advice.
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
