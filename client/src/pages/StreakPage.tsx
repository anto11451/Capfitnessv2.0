import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Flame,
  CheckCircle,
  CheckSquare,
  Square,
  Trophy,
  Lock,
  Gift,
  Map as MapIcon,
  Info,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  format,
  parseISO,
  eachDayOfInterval,
  startOfDay,
  subDays,
  isToday,
  isWithinInterval,
  differenceInDays
} from 'date-fns';
import { useAuth } from '@/App';
import { getUserById, UserProfile } from '@/lib/googleSheetsApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const LOCAL_STREAK_KEY = 'capsfitness_streak_v1';

const REWARDS = [
  { id: 1, trophiesNeeded: 3, label: "Bronze Badge", description: "You've shown early consistency!" },
  { id: 2, trophiesNeeded: 6, label: "Silver Badge", description: "Halfway through the first phase." },
  { id: 3, trophiesNeeded: 9, label: "Gold Badge", description: "You are becoming unstoppable." },
  { id: 4, trophiesNeeded: 12, label: "Diamond Badge", description: "Legendary status achieved." },
];

interface DayLog {
  date: string;
  workoutDone: boolean;
  dietDone: boolean;
  isRestDay?: boolean;
}

export default function StreakPage() {
  const { user } = useAuth();
  const [liveProfile, setLiveProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<DayLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{date: Date, log?: DayLog} | null>(null);

  const userId = (user as any)?.user_id || localStorage.getItem('user_id');

  // Load Data
  useEffect(() => {
    async function loadData() {
      if (!userId) return;
      try {
        const profile = await getUserById(userId);
        if (profile) setLiveProfile(profile);
        
        const saved = localStorage.getItem(LOCAL_STREAK_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.history)) setHistory(parsed.history);
        }
      } catch (e) {
        console.error("Failed to load streak data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  // Save Data
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify({ history }));
      window.dispatchEvent(new CustomEvent('streak-data-updated', { detail: { history } }));
    }
  }, [history]);

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

  // Generate calendar days based on plan dates
  const calendarDays = useMemo(() => {
    if (!planDates) return [];
    
    // Show the entire plan duration
    const days = eachDayOfInterval({ start: planDates.start, end: planDates.end });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = history.find(h => h.date === dateStr);
      return { date: day, log };
    });
  }, [planDates, history]);

  const streakDays = useMemo(() => {
    if (!planDates) return [];
    return history.filter(h => {
      const d = parseISO(h.date);
      return d >= planDates.start && d <= planDates.end && (h.workoutDone || h.dietDone || h.isRestDay);
    }).map(h => h.date);
  }, [planDates, history]);

  const totalStreakCount = streakDays.length;
  const trophyCount = Math.floor(totalStreakCount / 3);

  const handleBulkToggle = (dateStr: string) => {
    setSelectedDays(prev => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  };

  const handleBulkUpdate = (type: 'perfect' | 'rest' | 'clear') => {
    setHistory(prev => {
      const next = [...prev];
      selectedDays.forEach(dateStr => {
        const idx = next.findIndex(h => h.date === dateStr);
        if (type === 'clear') {
          if (idx >= 0) next.splice(idx, 1);
        } else {
          const log = {
            date: dateStr,
            workoutDone: type === 'perfect',
            dietDone: type === 'perfect',
            isRestDay: type === 'rest'
          };
          if (idx >= 0) next[idx] = log;
          else next.push(log);
        }
      });
      return next;
    });
    setSelectedDays(new Set());
    setIsBulkMode(false);
    setIsBulkDialogOpen(false);
  };

  const updateDayLog = (type: 'workout' | 'diet' | 'rest') => {
    if (!selectedDay) return;
    const dateStr = format(selectedDay.date, 'yyyy-MM-dd');
    setHistory(prev => {
      const next = [...prev];
      const idx = next.findIndex(h => h.date === dateStr);
      const current = idx >= 0 ? next[idx] : { date: dateStr, workoutDone: false, dietDone: false, isRestDay: false };
      
      const updated = { ...current };
      if (type === 'rest') {
        updated.isRestDay = !updated.isRestDay;
        if (updated.isRestDay) { updated.workoutDone = false; updated.dietDone = false; }
      } else if (type === 'workout') {
        updated.workoutDone = !updated.workoutDone;
        updated.isRestDay = false;
      } else if (type === 'diet') {
        updated.dietDone = !updated.dietDone;
        updated.isRestDay = false;
      }

      if (idx >= 0) next[idx] = updated;
      else next.push(updated);
      return next;
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!planDates) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12">
          <Card className="p-12 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white uppercase">Program Not Started</h2>
              <p className="text-muted-foreground max-w-md">
                Streak tracking begins once your plan start and end dates are set in Google Sheets.
              </p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Reliable Progress</span>
            </div>
            <h1 className="text-5xl font-display font-bold text-white uppercase leading-none">
              CONSISTENCY <span className="text-orange-500">MAP</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Logging from {format(planDates.start, 'MMM do')} to {format(planDates.end, 'MMM do')}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[120px] text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Logs</p>
              <p className="text-3xl font-display font-bold text-white">{totalStreakCount}</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 min-w-[120px] text-center">
              <p className="text-[10px] text-orange-500 uppercase tracking-widest mb-1">Trophies</p>
              <p className="text-3xl font-display font-bold text-orange-500">{trophyCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Log & History */}
            <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Plan Schedule</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("border-white/10", isBulkMode && "bg-primary/20 border-primary text-primary")}
                    onClick={() => { setIsBulkMode(!isBulkMode); setSelectedDays(new Set()); }}
                  >
                    {isBulkMode ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
                    {isBulkMode ? "Exit Bulk" : "Bulk Select"}
                  </Button>
                  {isBulkMode && selectedDays.size > 0 && (
                    <Button size="sm" className="bg-primary text-black" onClick={() => setIsBulkDialogOpen(true)}>
                      Update {selectedDays.size}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {calendarDays.map((day, i) => {
                  const dateStr = format(day.date, 'yyyy-MM-dd');
                  const isSelected = selectedDays.has(dateStr);
                  const isTodayDate = isToday(day.date);
                  const hasLog = day.log && (day.log.workoutDone || day.log.dietDone || day.log.isRestDay);

                  return (
                    <div 
                      key={i} 
                      onClick={() => isBulkMode ? handleBulkToggle(dateStr) : (setSelectedDay({date: day.date, log: day.log}), setIsDayDialogOpen(true))}
                      className={cn(
                        "aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 relative",
                        hasLog ? "bg-primary border-primary shadow-[0_0_10px_rgba(0,255,157,0.3)]" : "bg-white/5 border-white/10",
                        isTodayDate && "ring-2 ring-primary ring-offset-2 ring-offset-black",
                        isBulkMode && isSelected && "ring-2 ring-white"
                      )}
                    >
                      <span className="text-[10px] text-white/40 font-bold">{format(day.date, 'd')}</span>
                      {hasLog && <CheckCircle className="w-4 h-4 text-black mt-1" />}
                      {isBulkMode && isSelected && <div className="absolute inset-0 bg-primary/20 rounded-xl" />}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Journey Map */}
            <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-10">
                <MapIcon className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">The Transformation Journey</h3>
              </div>

              <div className="relative space-y-12">
                <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-orange-500/50 to-white/5" />
                {[...Array(15)].map((_, i) => {
                  const dayNum = (i + 1) * 3;
                  const isCompleted = trophyCount > i;
                  const isCurrent = trophyCount === i;
                  const isReward = (i + 1) % 3 === 0;

                  return (
                    <div key={i} className="flex items-center gap-6 relative z-10">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2",
                        isCompleted ? "bg-primary border-primary text-black shadow-[0_0_15px_rgba(0,255,157,0.4)]" :
                        isCurrent ? "bg-black border-orange-500 text-orange-500 animate-pulse" :
                        "bg-black border-white/10 text-white/20"
                      )}>
                        {isReward ? <Gift className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-bold uppercase", isCompleted ? "text-white" : "text-muted-foreground/40")}>
                          {isReward ? `REWARD UNLOCK` : `TROPHY ${i + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground/60">{dayNum} Consistency Days</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-8">
             <Card className="p-1 bg-card/40 border-white/5 backdrop-blur-xl aspect-square relative overflow-hidden rounded-[2.5rem]">
               <img 
                 src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                 className="w-full h-full object-cover grayscale transition-all duration-1000"
                 style={{ 
                   filter: `grayscale(1) brightness(${0.2 + (trophyCount * 0.1)})`,
                   clipPath: `inset(${Math.max(0, 100 - (trophyCount * 10))}% 0 0 0)` 
                 }}
               />
               <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1">Visual Completion</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, trophyCount * 10)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white">{Math.min(100, trophyCount * 10)}%</span>
                    </div>
                  </div>
               </div>
             </Card>

             <div className="space-y-4">
                {REWARDS.map(reward => {
                  const isUnlocked = trophyCount >= reward.trophiesNeeded;
                  return (
                    <Card key={reward.id} className={cn("p-5 transition-all duration-500", isUnlocked ? "bg-primary/10 border-primary/20" : "opacity-50")}>
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isUnlocked ? "bg-primary text-black shadow-[0_0_10px_rgba(0,255,157,0.2)]" : "bg-white/5")}>
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold uppercase text-sm">{reward.label}</h4>
                          <p className="text-xs text-muted-foreground">{reward.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
             </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white">
          <DialogHeader><DialogTitle>Edit Log: {selectedDay && format(selectedDay.date, 'MMM do')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <Button className={cn("w-full justify-start h-12 font-bold", selectedDay?.log?.workoutDone && "bg-primary text-black")} variant="outline" onClick={() => updateDayLog('workout')}>Workout Done</Button>
            <Button className={cn("w-full justify-start h-12 font-bold", selectedDay?.log?.dietDone && "bg-primary text-black")} variant="outline" onClick={() => updateDayLog('diet')}>Diet Followed</Button>
            <Button className={cn("w-full justify-start h-12 font-bold", selectedDay?.log?.isRestDay && "bg-blue-600 text-white")} variant="outline" onClick={() => updateDayLog('rest')}>Rest Day</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white">
          <DialogHeader><DialogTitle>Bulk Update {selectedDays.size} Days</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button className="bg-primary text-black h-12 font-bold" onClick={() => handleBulkUpdate('perfect')}>Mark as Perfect Days</Button>
            <Button className="bg-blue-600 h-12 font-bold text-white" onClick={() => handleBulkUpdate('rest')}>Mark as Rest Days</Button>
            <Button variant="destructive" className="h-12 font-bold" onClick={() => handleBulkUpdate('clear')}>Clear All Logs</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
