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
import { getUserStreaks, updateStreak } from '@/lib/googleSheetsApi';

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

const BASE_LOCAL_STREAK_KEY = 'capsfitness_streak_v1';

const getLocalKeyForUser = (userId: string | number | undefined) =>
  userId ? `${BASE_LOCAL_STREAK_KEY}_${userId}` : BASE_LOCAL_STREAK_KEY;

const normalizeDate = (raw: string) => {
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split('-');
    return `${yyyy}-${mm}-${dd}`;
  }
  return raw;
};

const calculateStreak = (history: DayLog[]) => {
  if (!history || history.length === 0) return { current: 0, longest: 0 };

  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

  let current = 0;

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  const hasToday = sorted.some(
    (h) => h.date === today && (h.workoutDone || h.dietDone || h.isRestDay),
  );
  const hasYesterday = sorted.some(
    (h) =>
      h.date === yesterday && (h.workoutDone || h.dietDone || h.isRestDay),
  );

  if (hasToday || hasYesterday) {
    let checkDate = hasToday ? new Date() : subDays(new Date(), 1);
    // walk backwards while consecutive days have activity
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const log = sorted.find((h) => h.date === dateStr);
      if (log && (log.workoutDone || log.dietDone || log.isRestDay)) {
        current++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
  }

  // Longest streak
  const allSorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  let max = 0;
  let currentMax = 0;
  let lastDate: Date | null = null;

  allSorted.forEach((log) => {
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

  // ---- LOAD FROM LOCALSTORAGE FIRST ----
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const key = getLocalKeyForUser(user?.id);
    const raw = window.localStorage.getItem(key);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StreakState;
        if (parsed && Array.isArray(parsed.history)) {
          setStreakData(parsed);
        }
      } catch (e) {
        console.error('Failed to parse streak localStorage:', e);
      }
    }

    setLoading(false);
  }, [user?.id]);

  // ---- OPTIONAL: SYNC FROM API IF YOU WANT (SAFE) ----
  useEffect(() => {
    const fetchFromApi = async () => {
      if (!user?.id) return;
      try {
        const streaks = await getUserStreaks(user.id);
        if (!Array.isArray(streaks)) return;

        const map = new Map<string, DayLog>();

        streaks.forEach((s: any) => {
          if (
            s.workout_done === undefined &&
            s.diet_done === undefined &&
            s.rest_day === undefined
          )
            return;

          const date = normalizeDate(s.date);
          if (!date) return;

          map.set(date, {
            date,
            workoutDone: Boolean(s.workout_done),
            dietDone: Boolean(s.diet_done),
            isRestDay: Boolean(s.rest_day),
          });
        });

        const history = Array.from(map.values());
        const { current, longest } = calculateStreak(history);

        const freshState: StreakState = {
          currentStreak: current,
          longestStreak: longest,
          history,
          lastLogDate: new Date().toISOString(),
        };

        setStreakData(freshState);

        // persist to localStorage (guarded)
        if (typeof window !== 'undefined') {
          const key = getLocalKeyForUser(user.id);
          window.localStorage.setItem(key, JSON.stringify(freshState));
        }
      } catch (error) {
        console.error('Failed to load streak data from API:', error);
      }
    };

    fetchFromApi();
  }, [user?.id]);

  // ---- SAVE TO LOCALSTORAGE WHENEVER STREAKDATA CHANGES ----
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = getLocalKeyForUser(user?.id);
    try {
      window.localStorage.setItem(key, JSON.stringify(streakData));
    } catch (e) {
      console.error('Failed to save streak to localStorage:', e);
    }
  }, [streakData, user?.id]);

  // ---- BULK SELECTION ----
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

  // ---- BULK UPDATE ----
  const handleBulkUpdate = async (
    type: 'workout' | 'diet' | 'rest' | 'perfect' | 'clear',
  ) => {
    if (!user?.id || selectedDays.size === 0) return;

    setLoading(true);

    try {
      const results = await Promise.all(
        Array.from(selectedDays).map(async (dateStr) => {
          let updatedLog: DayLog;

          if (type === 'clear') {
            updatedLog = {
              date: dateStr,
              workoutDone: false,
              dietDone: false,
              isRestDay: false,
            };
          } else {
            updatedLog = {
              date: dateStr,
              workoutDone: type === 'perfect' || type === 'workout',
              dietDone: type === 'perfect' || type === 'diet',
              isRestDay: type === 'rest',
            };
            if (type === 'rest') {
              updatedLog.workoutDone = false;
              updatedLog.dietDone = false;
            }
          }

          // API call
          const result = await updateStreak(user.id, dateStr, {
            workout_done: updatedLog.workoutDone,
            diet_done: updatedLog.dietDone,
            rest_day: updatedLog.isRestDay,
          });

          return { date: dateStr, log: updatedLog, ok: result?.ok };
        }),
      );

      setStreakData((prev) => {
        const newHistory = [...prev.history];
        results.forEach((res) => {
          if (!res.ok) return;

          const index = newHistory.findIndex((h) => h.date === res.date);
          if (type === 'clear') {
            if (index >= 0) newHistory.splice(index, 1);
          } else {
            if (index >= 0) newHistory[index] = res.log;
            else newHistory.push(res.log);
          }
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
    } catch (error) {
      console.error('Failed to bulk update streaks:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---- SINGLE DAY (TODAY) TOGGLE ----
  const handleLog = async (type: 'workout' | 'diet' | 'rest') => {
    if (!user?.id) return;
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

    try {
      const result = await updateStreak(user.id, today, {
        workout_done: updatedLog.workoutDone,
        diet_done: updatedLog.dietDone,
        rest_day: updatedLog.isRestDay,
      });

      if (result?.ok) {
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
      }
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  };

  // ---- EDIT SPECIFIC DAY ----
  const updateDayLog = async (type: 'workout' | 'diet' | 'rest') => {
    if (!selectedDay || !user?.id) return;
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

    try {
      const result = await updateStreak(user.id, dateStr, {
        workout_done: updatedLog.workoutDone,
        diet_done: updatedLog.dietDone,
        rest_day: updatedLog.isRestDay,
      });

      if (result?.ok) {
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

        setSelectedDay((prev) =>
          prev ? { ...prev, log: updatedLog } : null,
        );
      }
    } catch (error) {
      console.error('Failed to update log:', error);
    }
  };

  // ---- CALENDAR DAYS (LAST 30) ----
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

  if (!user?.id) {
    return (
      <Layout>
        <div className="p-8 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">STREAK ZONE</h1>
          <p className="text-muted-foreground">
            Please sign in to start tracking your streaks.
          </p>
        </div>
      </Layout>
    );
  }

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

        {/* Rest of the JSX is the same as before (daily check-in, stats grid, calendar, dialogs) */}
        {/* ... paste the JSX from the previous working version here ... */}
      </div>
    </Layout>
  );
}
