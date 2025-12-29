export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string;
  videoUrl: string;
  cues: string[];
  instructions: string;
  secondaryMuscles?: string[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  daysPerWeek: number;
  level: string;
  description: string;
  duration: string;
  schedule?: { day: string; focus: string; exercises: string[] }[];
}

export interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image: string;
  ingredients: string[];
  instructions?: string[];
  tags: string[];
  videoUrl?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  goal: string;
  activityLevel: string;
  experience: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string; // ISO date string
  history: {
    date: string;
    workoutDone: boolean;
    dietDone: boolean;
    isRestDay?: boolean; // New field for rest day
  }[];
}

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyLog {
  date: string;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatsConsumed: number;
  workoutCompleted?: boolean;
}

export interface AdminData {
  dailyTargets: DailyTargets;
  currentPlanId: string;
  nextSessionDate: string;
  programStartDate: string;
  programEndDate: string;
  todaysWorkout: {
    focus: string;
    exercises: {
      id: string;
      name: string;
      sets: number;
      reps: string;
      rest: string;
    }[];
    duration: string;
  };
}
