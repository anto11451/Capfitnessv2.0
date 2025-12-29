import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, CheckCircle, XCircle, Calendar as CalendarIcon, Trophy, Coffee, Edit3, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, isSameDay, parseISO, isToday } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/App';

interface DayLog {
  date: string;
  workoutDone: boolean;
  dietDone: boolean;
  isRestDay?: boolean;
}

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  history: DayLog[];
  lastLogDate: string;
}

const STREAK_HISTORY_KEY = 'capsfitness_streak_history';

export default function StreakPage() {
  const { user, updateStreak } = useAuth();
  
  const loadHistoryFromStorage = (): DayLog[] => {
    const stored = localStorage.getItem(STREAK_HISTORY_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  };
  
  const [streakData, setStreakData] = useState<StreakState>(() => {
    const storedHistory = loadHistoryFromStorage();
    return {
      currentStreak: user?.currentStreak || 0,
      longestStreak: user?.currentStreak || 0,
      history: storedHistory,
      lastLogDate: new Date().toISOString()
    };
  });
  const [selectedDay, setSelectedDay] = useState<{ date: Date, log: DayLog | undefined } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

  const calculateStreak = (history: DayLog[]): { current: number; longest: number } => {
    if (history.length === 0) {
      return { current: user?.currentStreak || 0, longest: user?.currentStreak || 0 };
    }
    
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakBroken = false;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = subDays(today, i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const log = sortedHistory.find(h => h.date === dateStr);
      
      const isValidDay = log && (log.isRestDay || (log.workoutDone && log.dietDone));
      
      if (isValidDay) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        if (!streakBroken) {
          currentStreak = tempStreak;
          streakBroken = true;
        }
        tempStreak = 0;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    if (!streakBroken) {
      currentStreak = tempStreak;
    }
    
    return { current: currentStreak, longest: longestStreak };
  };

  useEffect(() => {
    localStorage.setItem(STREAK_HISTORY_KEY, JSON.stringify(streakData.history));
    
    const { current, longest } = calculateStreak(streakData.history);
    
    if (current !== streakData.currentStreak || longest !== streakData.longestStreak) {
      setStreakData(prev => ({
        ...prev,
        currentStreak: current,
        longestStreak: longest
      }));
    }
    
    if (current !== user?.currentStreak) {
      updateStreak(current);
    }
  }, [streakData.history]);

  // Generate last 30 days for calendar
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = streakData.history.find(h => h.date === dateStr);
    return { date, log };
  });

  const handleLog = (type: 'workout' | 'diet' | 'rest') => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    setStreakData(prev => {
      const existingLogIndex = prev.history.findIndex(h => h.date === today);
      let newHistory = [...prev.history];
      
      if (existingLogIndex >= 0) {
        const log = { ...newHistory[existingLogIndex] };
        if (type === 'rest') {
          log.isRestDay = !log.isRestDay;
          // If rest day is active, clear other flags? Or keep them?
          // User said "Count as a valid day without requiring workout or diet"
        } else if (type === 'workout') {
          log.workoutDone = !log.workoutDone;
          log.isRestDay = false; // Disable rest if logging activity
        } else if (type === 'diet') {
          log.dietDone = !log.dietDone;
          log.isRestDay = false;
        }
        newHistory[existingLogIndex] = log;
      } else {
        // Create new log
        newHistory.push({
          date: today,
          workoutDone: type === 'workout',
          dietDone: type === 'diet',
          isRestDay: type === 'rest'
        });
      }

      // Recalculate current streak based on today's status
      // Logic: Workout+Diet = continue. Rest = continue.
      const todayLog = newHistory.find(h => h.date === today);
      let streakChange = 0;
      
      if (todayLog) {
        if (todayLog.isRestDay || (todayLog.workoutDone && todayLog.dietDone)) {
           // If we just completed it, increment? 
           // For simplicity in this mock, we assume the previous streak was correct
           // and we just ensure today is counted.
           // In real app, we'd traverse back from today.
           streakChange = 0; // Keeping static for mock stability unless we do full traverse
        }
      }

      return {
        ...prev,
        history: newHistory,
        lastLogDate: new Date().toISOString()
      };
    });
  };

  const handleEditDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = streakData.history.find(h => h.date === dateStr);
    setSelectedDay({ date, log });
    setIsDialogOpen(true);
  };

  const handleBulkToggle = (dateStr: string) => {
    setSelectedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateStr)) {
        newSet.delete(dateStr);
      } else {
        newSet.add(dateStr);
      }
      return newSet;
    });
  };

  const handleBulkUpdate = (type: 'workout' | 'diet' | 'rest' | 'perfect' | 'clear') => {
    setStreakData(prev => {
      let newHistory = [...prev.history];
      
      selectedDays.forEach(dateStr => {
        const existingLogIndex = newHistory.findIndex(h => h.date === dateStr);
        
        if (type === 'clear') {
          if (existingLogIndex >= 0) {
            newHistory.splice(existingLogIndex, 1);
          }
          return;
        }
        
        let log: DayLog;
        if (existingLogIndex >= 0) {
          log = { ...newHistory[existingLogIndex] };
        } else {
          log = { date: dateStr, workoutDone: false, dietDone: false, isRestDay: false };
        }
        
        if (type === 'perfect') {
          log.workoutDone = true;
          log.dietDone = true;
          log.isRestDay = false;
        } else if (type === 'rest') {
          log.isRestDay = true;
          log.workoutDone = false;
          log.dietDone = false;
        } else if (type === 'workout') {
          log.workoutDone = true;
          log.isRestDay = false;
        } else if (type === 'diet') {
          log.dietDone = true;
          log.isRestDay = false;
        }
        
        if (existingLogIndex >= 0) {
          newHistory[existingLogIndex] = log;
        } else {
          newHistory.push(log);
        }
      });
      
      return { ...prev, history: newHistory, lastLogDate: new Date().toISOString() };
    });
    
    setSelectedDays(new Set());
    setIsBulkMode(false);
    setIsBulkDialogOpen(false);
  };

  const updateDayLog = (type: 'workout' | 'diet' | 'rest') => {
    if (!selectedDay) return;
    const dateStr = format(selectedDay.date, 'yyyy-MM-dd');

    setStreakData(prev => {
      const existingLogIndex = prev.history.findIndex(h => h.date === dateStr);
      let newHistory = [...prev.history];
      
      if (existingLogIndex >= 0) {
        const log = { ...newHistory[existingLogIndex] };
        if (type === 'rest') {
          log.isRestDay = !log.isRestDay;
        } else if (type === 'workout') {
          log.workoutDone = !log.workoutDone;
          log.isRestDay = false;
        } else if (type === 'diet') {
          log.dietDone = !log.dietDone;
          log.isRestDay = false;
        }
        newHistory[existingLogIndex] = log;
      } else {
        newHistory.push({
          date: dateStr,
          workoutDone: type === 'workout',
          dietDone: type === 'diet',
          isRestDay: type === 'rest'
        });
      }

      return { ...prev, history: newHistory };
    });
    
    // Update local selected state for immediate UI feedback in dialog
    setSelectedDay(prev => {
      if (!prev) return null;
      // Re-find the log we just updated (simulated)
      // Actually we need to toggle the local state to match logic above
      // This is complex to sync perfectly without a reducer, but for mock:
      const currentLog = prev.log || { date: dateStr, workoutDone: false, dietDone: false, isRestDay: false };
      let updatedLog = { ...currentLog };
      
      if (type === 'rest') updatedLog.isRestDay = !updatedLog.isRestDay;
      if (type === 'workout') { updatedLog.workoutDone = !updatedLog.workoutDone; updatedLog.isRestDay = false; }
      if (type === 'diet') { updatedLog.dietDone = !updatedLog.dietDone; updatedLog.isRestDay = false; }
      
      return { ...prev, log: updatedLog };
    });
  };

  // Calculate Display Stats
  const daysRecorded = streakData.history.length;
  // Calculate missed days in the last 30 days (simple calc)
  const missedDays = 30 - calendarDays.filter(d => d.log && (d.log.workoutDone || d.log.dietDone || d.log.isRestDay)).length;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLog = streakData.history.find(h => h.date === todayStr);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">STREAK <span className="text-orange-500">ZONE</span></h1>
            <p className="text-muted-foreground">Consistency is the key to greatness.</p>
          </div>
          <div className="text-right">
             <p className="text-sm text-muted-foreground uppercase tracking-widest">Current Streak</p>
             <p className="text-6xl font-display font-bold text-orange-500 flex items-center gap-2 justify-end">
               {streakData.currentStreak} <Flame className="w-12 h-12 fill-orange-500" />
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Daily Log Card */}
          <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">DAILY CHECK-IN</h3>
            <div className="space-y-4">
              
              <Button 
                 variant="outline" 
                 className={cn(
                   "w-full mb-4 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300",
                   todayLog?.isRestDay && "bg-blue-500/20 text-blue-300 border-blue-500"
                 )}
                 onClick={() => handleLog('rest')}
              >
                <Coffee className="w-4 h-4 mr-2" /> 
                {todayLog?.isRestDay ? "REST DAY ACTIVE" : "MARK AS REST DAY"}
              </Button>

              <div className={cn("flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10", todayLog?.workoutDone && "border-green-500/50 bg-green-500/5")}>
                <div className="flex items-center gap-3">
                  <DumbbellIcon className={cn("w-6 h-6", todayLog?.workoutDone ? "text-green-500" : "text-primary")} />
                  <span className="font-bold">Did you workout today?</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={cn(
                      todayLog?.workoutDone ? "bg-green-500 text-black hover:bg-green-600" : "bg-green-500/20 text-green-500 hover:bg-green-500/40"
                    )}
                    onClick={() => handleLog('workout')}
                  >
                    {todayLog?.workoutDone ? "DONE" : "YES"}
                  </Button>
                </div>
              </div>

              <div className={cn("flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10", todayLog?.dietDone && "border-green-500/50 bg-green-500/5")}>
                <div className="flex items-center gap-3">
                  <UtensilsIcon className={cn("w-6 h-6", todayLog?.dietDone ? "text-green-500" : "text-primary")} />
                  <span className="font-bold">Did you follow your diet?</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={cn(
                      todayLog?.dietDone ? "bg-green-500 text-black hover:bg-green-600" : "bg-green-500/20 text-green-500 hover:bg-green-500/40"
                    )}
                    onClick={() => handleLog('diet')}
                  >
                    {todayLog?.dietDone ? "DONE" : "YES"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Longest Streak</p>
              <p className="text-4xl font-display font-bold text-white">{streakData.longestStreak}</p>
            </Card>
            <Card className="p-6 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Days Logged</p>
              <p className="text-4xl font-display font-bold text-white">{daysRecorded}</p>
            </Card>
            <Card className="p-6 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Missed (30d)</p>
              <p className="text-4xl font-display font-bold text-red-500">{missedDays}</p>
            </Card>
            <Card className="p-6 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Completion</p>
              <p className="text-4xl font-display font-bold text-green-500">
                {Math.round((daysRecorded / 30) * 100)}%
              </p>
            </Card>
          </div>
        </div>

        {/* Calendar Heatmap */}
        <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Activity History</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "border-white/10 text-muted-foreground hover:text-white",
                  isBulkMode && "bg-primary/20 text-primary border-primary"
                )}
                onClick={() => {
                  setIsBulkMode(!isBulkMode);
                  setSelectedDays(new Set());
                }}
              >
                {isBulkMode ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
                {isBulkMode ? "Exit Bulk Mode" : "Bulk Select"}
              </Button>
              {isBulkMode && selectedDays.size > 0 && (
                <Button
                  size="sm"
                  className="bg-primary text-black hover:bg-primary/80"
                  onClick={() => setIsBulkDialogOpen(true)}
                >
                  Update {selectedDays.size} Days
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-3">
            {calendarDays.map((day, i) => {
              const dateStr = format(day.date, 'yyyy-MM-dd');
              const isSelected = selectedDays.has(dateStr);
              const dayOfWeek = format(day.date, 'EEE');
              const dayNum = format(day.date, 'd');
              const isTodayDate = isToday(day.date);
              
              let status = 'missed';
              if (day.log) {
                if (day.log.isRestDay) status = 'rest';
                else if (day.log.workoutDone && day.log.dietDone) status = 'perfect';
                else if (day.log.workoutDone || day.log.dietDone) status = 'partial';
              }
              
              return (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-col items-center gap-1 cursor-pointer transition-all",
                    isBulkMode && isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-black rounded-lg"
                  )}
                  onClick={() => {
                    if (isBulkMode) {
                      handleBulkToggle(dateStr);
                    } else {
                      handleEditDay(day.date);
                    }
                  }}
                >
                  <span className={cn(
                    "text-[10px] uppercase tracking-wider",
                    isTodayDate ? "text-primary font-bold" : "text-muted-foreground"
                  )}>
                    {dayOfWeek}
                  </span>
                  <div className={cn(
                    "w-full aspect-square rounded-md border transition-all hover:scale-105 flex items-center justify-center relative",
                    status === 'perfect' ? "bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]" :
                    status === 'rest' ? "bg-blue-500/50 border-blue-400" :
                    status === 'partial' ? "bg-yellow-500 border-yellow-400" :
                    "bg-white/5 border-white/10 hover:border-white/30",
                    isTodayDate && "ring-2 ring-primary"
                  )}>
                    {isBulkMode && isSelected && (
                      <CheckSquare className="w-4 h-4 text-white absolute" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isTodayDate ? "text-primary font-bold" : "text-muted-foreground"
                  )}>
                    {dayNum}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-muted-foreground justify-end">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500" /> Perfect Day</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500" /> Partial</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/50" /> Rest Day</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Missed</div>
          </div>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit Log: {selectedDay && format(selectedDay.date, 'MMM do, yyyy')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span>Rest Day</span>
              <Button 
                variant={selectedDay?.log?.isRestDay ? "default" : "outline"}
                className={selectedDay?.log?.isRestDay ? "bg-blue-600" : "border-white/10"}
                onClick={() => updateDayLog('rest')}
              >
                {selectedDay?.log?.isRestDay ? "Active" : "Set"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Workout Completed</span>
              <Button 
                variant={selectedDay?.log?.workoutDone ? "default" : "outline"}
                className={selectedDay?.log?.workoutDone ? "bg-green-600" : "border-white/10"}
                onClick={() => updateDayLog('workout')}
                disabled={selectedDay?.log?.isRestDay}
              >
                {selectedDay?.log?.workoutDone ? "Yes" : "No"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Diet Followed</span>
              <Button 
                variant={selectedDay?.log?.dietDone ? "default" : "outline"}
                className={selectedDay?.log?.dietDone ? "bg-green-600" : "border-white/10"}
                onClick={() => updateDayLog('diet')}
                disabled={selectedDay?.log?.isRestDay}
              >
                {selectedDay?.log?.dietDone ? "Yes" : "No"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bulk Update: {selectedDays.size} Days Selected</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Apply the same action to all selected days at once.
            </p>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleBulkUpdate('perfect')}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Mark All as Perfect Day
            </Button>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleBulkUpdate('rest')}
            >
              <Coffee className="w-4 h-4 mr-2" /> Mark All as Rest Day
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                onClick={() => handleBulkUpdate('workout')}
              >
                Workout Done
              </Button>
              <Button 
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                onClick={() => handleBulkUpdate('diet')}
              >
                Diet Done
              </Button>
            </div>
            <Button 
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20"
              onClick={() => handleBulkUpdate('clear')}
            >
              <XCircle className="w-4 h-4 mr-2" /> Clear All Logs
            </Button>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              className="text-muted-foreground"
              onClick={() => setIsBulkDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function DumbbellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </svg>
  )
}

function UtensilsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}
