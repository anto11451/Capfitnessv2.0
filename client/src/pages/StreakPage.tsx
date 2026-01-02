import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Flame,
  CheckCircle,
  XCircle,
  Coffee,
  CheckSquare,
  Square,
  Dumbbell as DumbbellIcon,
  Utensils as UtensilsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  format,
  subDays,
  parseISO,
  isToday,
  differenceInDays,
} from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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

const LOCAL_STREAK_KEY = 'capsfitness_streak_v1';

const calculateStreak = (history: DayLog[]) => {
  if (!history || history.length === 0) return { current: 0, longest: 0 };

  // Current streak from today / yesterday backwards
  const sortedDesc = [...history].sort((a, b) => b.date.localeCompare(a.date));

  let current = 0;
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  const hasToday = sortedDesc.some(
    (h) => h.date === today && (h.workoutDone || h.dietDone || h.isRestDay),
  );
  const hasYesterday = sortedDesc.some(
    (h) =>
      h.date === yesterday && (h.workoutDone || h.dietDone || h.isRestDay),
  );

  if (hasToday || hasYesterday) {
    let checkDate = hasToday ? new Date() : subDays(new Date(), 1);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const log = sortedDesc.find((h) => h.date === dateStr);
      if (log && (log.workoutDone || log.dietDone || log.isRestDay)) {
        current++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
  }

  // Longest streak
  const sortedAsc = [...history].sort((a, b) => a.date.localeCompare(b.date));
  let max = 0;
  let currentMax = 0;
  let lastDate: Date | null = null;

  sortedAsc.forEach((log) => {
    if (log.workoutDone || log.dietDone || log.isRestDay) {
      const currentDate = parseISO(log.date);
      if (lastDate) {
        const diff = differenceInDays(currentDate, lastDate);
        if (diff === 1) {
          currentMax++;
        } else if (diff > 1) {
          currentMax = 1;
        }
      } else {
        currentMax = 1;
      }
      lastDate = currentDate;
      if (currentMax > max) max = currentMax;
    }
  });

  return { current, longest: max };
};

export default function StreakPage() {
  const { user } = useAuth();

  const [streakData, setStreakData] = useState<StreakState>({
    currentStreak: 0,
    longestStreak: 0,
    history: [],
    lastLogDate: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    log: DayLog | undefined;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(LOCAL_STREAK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StreakState;
        if (parsed && Array.isArray(parsed.history)) {
          setStreakData(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to read streak from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever streakData changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(streakData));
    } catch (e) {
      console.error('Failed to save streak to localStorage:', e);
    }
  }, [streakData]);

  // Bulk select toggle
  const handleBulkToggle = (dateStr: string) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  };

  const handleEditDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = streakData.history.find((h) => h.date === dateStr);
    setSelectedDay({ date, log });
    setIsDialogOpen(true);
  };

  const handleBulkUpdate = async (
    type: 'workout' | 'diet' | 'rest' | 'perfect' | 'clear',
  ) => {
    if (selectedDays.size === 0) return;

    setLoading(true);

    setStreakData((prev) => {
      const newHistory = [...prev.history];

      Array.from(selectedDays).forEach((dateStr) => {
        if (type === 'clear') {
          const index = newHistory.findIndex((h) => h.date === dateStr);
          if (index >= 0) newHistory.splice(index, 1);
          return;
        }

        let updatedLog: DayLog = {
          date: dateStr,
          workoutDone: type === 'perfect' || type === 'workout',
          dietDone: type === 'perfect' || type === 'diet',
          isRestDay: type === 'rest',
        };

        if (type === 'rest') {
          updatedLog.workoutDone = false;
          updatedLog.dietDone = false;
        }

        const index = newHistory.findIndex((h) => h.date === dateStr);
        if (index >= 0) newHistory[index] = updatedLog;
        else newHistory.push(updatedLog);
      });

      const { current, longest } = calculateStreak(newHistory);

      return {
        ...prev,
        history: newHistory,
        currentStreak: current,
        longestStreak: longest,
        lastLogDate: new Date().toISOString(),
      };
    });

    setSelectedDays(new Set());
    setIsBulkMode(false);
    setIsBulkDialogOpen(false);
    setLoading(false);
  };

  const handleLog = (type: 'workout' | 'diet' | 'rest') => {
    const today = format(new Date(), 'yyyy-MM-dd');

    const existingLog =
      streakData.history.find((h) => h.date === today) || {
        date: today,
        workoutDone: false,
        dietDone: false,
        isRestDay: false,
      };

    let updatedLog = { ...existingLog };

    if (type === 'rest') {
      updatedLog.isRestDay = !updatedLog.isRestDay;
      if (updatedLog.isRestDay) {
        updatedLog.workoutDone = false;
        updatedLog.dietDone = false;
      }
    } else if (type === 'workout') {
      updatedLog.workoutDone = !updatedLog.workoutDone;
      updatedLog.isRestDay = false;
    } else if (type === 'diet') {
      updatedLog.dietDone = !updatedLog.dietDone;
      updatedLog.isRestDay = false;
    }

    setStreakData((prev) => {
      const newHistory = [...prev.history];
      const index = newHistory.findIndex((h) => h.date === today);
      if (index >= 0) newHistory[index] = updatedLog;
      else newHistory.push(updatedLog);

      const { current, longest } = calculateStreak(newHistory);

      return {
        ...prev,
        history: newHistory,
        currentStreak: current,
        longestStreak: longest,
        lastLogDate: new Date().toISOString(),
      };
    });
  };

  const updateDayLog = (type: 'workout' | 'diet' | 'rest') => {
    if (!selectedDay) return;
    const dateStr = format(selectedDay.date, 'yyyy-MM-dd');

    const existingLog =
      streakData.history.find((h) => h.date === dateStr) || {
        date: dateStr,
        workoutDone: false,
        dietDone: false,
        isRestDay: false,
      };

    let updatedLog = { ...existingLog };

    if (type === 'rest') {
      updatedLog.isRestDay = !updatedLog.isRestDay;
      if (updatedLog.isRestDay) {
        updatedLog.workoutDone = false;
        updatedLog.dietDone = false;
      }
    } else if (type === 'workout') {
      updatedLog.workoutDone = !updatedLog.workoutDone;
      updatedLog.isRestDay = false;
    } else if (type === 'diet') {
      updatedLog.dietDone = !updatedLog.dietDone;
      updatedLog.isRestDay = false;
    }

    setStreakData((prev) => {
      const newHistory = [...prev.history];
      const index = newHistory.findIndex((h) => h.date === dateStr);
      if (index >= 0) newHistory[index] = updatedLog;
      else newHistory.push(updatedLog);

      const { current, longest } = calculateStreak(newHistory);

      return {
        ...prev,
        history: newHistory,
        currentStreak: current,
        longestStreak: longest,
        lastLogDate: new Date().toISOString(),
      };
    });

    setSelectedDay((prev) => (prev ? { ...prev, log: updatedLog } : null));
  };

  // Generate last 30 days for calendar
  const calendarDays = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const log = streakData.history.find((h) => h.date === dateStr);
      return { date, log };
    });
  }, [streakData.history]);

  const daysRecorded = streakData.history.length;
  const missedDays =
    30 -
    calendarDays.filter(
      (d) =>
        d.log &&
        (d.log.workoutDone || d.log.dietDone || d.log.isRestDay),
    ).length;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLog = streakData.history.find((h) => h.date === todayStr);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">
              STREAK <span className="text-orange-500">ZONE</span>
            </h1>
            <p className="text-muted-foreground">
              Consistency is the key to greatness.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">
              Current Streak
            </p>
            <p className="text-6xl font-display font-bold text-orange-500 flex items-center gap-2 justify-end">
              {streakData.currentStreak}{' '}
              <Flame className="w-12 h-12 fill-orange-500" />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Daily Log Card */}
          <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              DAILY CHECK-IN
            </h3>
            <div className="space-y-4">
              <Button
                variant="outline"
                className={cn(
                  'w-full mb-4 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300',
                  todayLog?.isRestDay &&
                    'bg-blue-500/20 text-blue-300 border-blue-500',
                )}
                onClick={() => handleLog('rest')}
              >
                <Coffee className="w-4 h-4 mr-2" />
                {todayLog?.isRestDay
                  ? 'REST DAY ACTIVE'
                  : 'MARK AS REST DAY'}
              </Button>

              <div
                className={cn(
                  'flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10',
                  todayLog?.workoutDone &&
                    'border-green-500/50 bg-green-500/5',
                )}
              >
                <div className="flex items-center gap-3">
                  <DumbbellIcon
                    className={cn(
                      'w-6 h-6',
                      todayLog?.workoutDone
                        ? 'text-green-500'
                        : 'text-primary',
                    )}
                  />
                  <span className="font-bold">Did you workout today?</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className={cn(
                      todayLog?.workoutDone
                        ? 'bg-green-500 text-black hover:bg-green-600'
                        : 'bg-green-500/20 text-green-500 hover:bg-green-500/40',
                    )}
                    onClick={() => handleLog('workout')}
                  >
                    {todayLog?.workoutDone ? 'DONE' : 'YES'}
                  </Button>
                </div>
              </div>

              <div
                className={cn(
                  'flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10',
                  todayLog?.dietDone &&
                    'border-green-500/50 bg-green-500/5',
                )}
              >
                <div className="flex items-center gap-3">
                  <UtensilsIcon
                    className={cn(
                      'w-6 h-6',
                      todayLog?.dietDone
                        ? 'text-green-500'
                        : 'text-primary',
                    )}
                  />
                  <span className="font-bold">Did you follow your diet?</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className={cn(
                      todayLog?.dietDone
                        ? 'bg-green-500 text-black hover:bg-green-600'
                        : 'bg-green-500/20 text-green-500 hover:bg-green-500/40',
                    )}
                    onClick={() => handleLog('diet')}
                  >
                    {todayLog?.dietDone ? 'DONE' : 'YES'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                Longest Streak
              </p>
              <p className="text-4xl font-display font-bold text-white">
                {streakData.longestStreak}
              </p>
            </Card>
            <Card className="p-6 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                Days Logged
              </p>
              <p className="text-4xl font-display font-bold text-white">
                {daysRecorded}
              </p>
            </Card>
            <Card className="p-6 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                Missed (30d)
              </p>
              <p className="text-4xl font-display font-bold text-red-500">
                {missedDays}
              </p>
            </Card>
            <Card className="p-6 bg-card/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                Completion
              </p>
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
                  'border-white/10 text-muted-foreground hover:text-white',
                  isBulkMode &&
                    'bg-primary/20 text-primary border-primary',
                )}
                onClick={() => {
                  setIsBulkMode(!isBulkMode);
                  setSelectedDays(new Set());
                }}
              >
                {isBulkMode ? (
                  <CheckSquare className="w-4 h-4 mr-2" />
                ) : (
                  <Square className="w-4 h-4 mr-2" />
                )}
                {isBulkMode ? 'Exit Bulk Mode' : 'Bulk Select'}
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

              let status: 'missed' | 'rest' | 'perfect' | 'partial' = 'missed';
              if (day.log) {
                if (day.log.isRestDay) status = 'rest';
                else if (day.log.workoutDone && day.log.dietDone)
                  status = 'perfect';
                else if (day.log.workoutDone || day.log.dietDone)
                  status = 'partial';
              }

              return (
                <div
                  key={i}
                  className={cn(
                    'flex flex-col items-center gap-1 cursor-pointer transition-all',
                    isBulkMode &&
                      isSelected &&
                      'ring-2 ring-primary ring-offset-2 ring-offset-black rounded-lg',
                  )}
                  onClick={() => {
                    if (isBulkMode) {
                      handleBulkToggle(dateStr);
                    } else {
                      handleEditDay(day.date);
                    }
                  }}
                >
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider',
                      isTodayDate
                        ? 'text-primary font-bold'
                        : 'text-muted-foreground',
                    )}
                  >
                    {dayOfWeek}
                  </span>
                  <div
                    className={cn(
                      'w-full aspect-square rounded-md border transition-all hover:scale-105 flex items-center justify-center relative',
                      status === 'perfect'
                        ? 'bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                        : status === 'rest'
                        ? 'bg-blue-500/50 border-blue-400'
                        : status === 'partial'
                        ? 'bg-yellow-500 border-yellow-400'
                        : 'bg-white/5 border-white/10 hover:border-white/30',
                      isTodayDate && 'ring-2 ring-primary',
                    )}
                  >
                    {isBulkMode && isSelected && (
                      <CheckSquare className="w-4 h-4 text-white absolute" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isTodayDate
                        ? 'text-primary font-bold'
                        : 'text-muted-foreground',
                    )}
                  >
                    {dayNum}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-muted-foreground justify-end">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" /> Perfect Day
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500" /> Partial
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500/50" /> Rest Day
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />{' '}
              Missed
            </div>
          </div>
        </Card>
      </div>

      {/* Single Day Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              Edit Log:{' '}
              {selectedDay && format(selectedDay.date, 'MMM do, yyyy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span>Rest Day</span>
              <Button
                variant={
                  selectedDay?.log?.isRestDay ? 'default' : 'outline'
                }
                className={
                  selectedDay?.log?.isRestDay
                    ? 'bg-blue-600'
                    : 'border-white/10'
                }
                onClick={() => updateDayLog('rest')}
              >
                {selectedDay?.log?.isRestDay ? 'Active' : 'Set'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Workout Completed</span>
              <Button
                variant={
                  selectedDay?.log?.workoutDone ? 'default' : 'outline'
                }
                className={
                  selectedDay?.log?.workoutDone
                    ? 'bg-green-600'
                    : 'border-white/10'
                }
                onClick={() => updateDayLog('workout')}
                disabled={selectedDay?.log?.isRestDay}
              >
                {selectedDay?.log?.workoutDone ? 'Yes' : 'No'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Diet Followed</span>
              <Button
                variant={
                  selectedDay?.log?.dietDone ? 'default' : 'outline'
                }
                className={
                  selectedDay?.log?.dietDone
                    ? 'bg-green-600'
                    : 'border-white/10'
                }
                onClick={() => updateDayLog('diet')}
                disabled={selectedDay?.log?.isRestDay}
              >
                {selectedDay?.log?.dietDone ? 'Yes' : 'No'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              Bulk Update: {selectedDays.size} Days Selected
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Apply the same action to all selected days at once.
            </p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleBulkUpdate('perfect')}
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Mark All as Perfect
              Day
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
              onClick={() => handleBulkUpdate('rest')}
              disabled={loading}
            >
              <Coffee className="w-4 h-4 mr-2" />
              {loading
                ? 'Updating...'
                : `Mark All as Rest Day`}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                onClick={() => handleBulkUpdate('workout')}
                disabled={loading}
              >
                Workout Done
              </Button>
              <Button
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                onClick={() => handleBulkUpdate('diet')}
                disabled={loading}
              >
                Diet Done
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20"
              onClick={() => handleBulkUpdate('clear')}
              disabled={loading}
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
