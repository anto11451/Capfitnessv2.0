// Google Sheets API Service Layer
// All data syncs through the Google Sheets API

const API_URL = 'https://script.google.com/macros/s/AKfycbyaOcyGLPkxYEN2EeQRH0PaIsxxQdek8t4zhb2gfe2lWdtE7wya2llV8Etw1ZmlixPQ/exec';

export interface UserProfile {
  user_id: string;
  email: string;
  password?: string;
  name: string;
  gender: string;
  age: number;
  height_cm: number;
  starting_weight: number;
  current_weight: number;
  goal_weight: number;
  membership_type: string;
  membership_duration: string;
  plan_start_date: string;
  plan_end_date: string;
  next_session_date: string;
  calorie_target: number;
  protein_target: number;
  carbs_target: number;
  fats_target: number;
  workout_schedule_json: string;
  avatar_type: string;
  plan_assigned?: string;
  last_updated?: string;
}

export interface UserProgress {
  progress_id: string;
  user_id: string;
  date: string;
  weight_kg?: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fats_consumed: number;
  calories_burned?: number;
  steps?: number;
  water_ml?: number;
  notes?: string;
}

export interface UserStreak {
  streak_id: string;
  user_id: string;
  date: string;
  workout_done: boolean;
  diet_done: boolean;
  rest_day: boolean;
  streak_status: string;
  notes?: string;
}

export interface GlobalWorkout {
  exercise_id: string;
  name: string;
  category: string;
  muscle_group: string;
  difficulty: string;
  equipment: string;
  sets: string;
  reps: string;
  instructions: string;
  cues: string[];
  video_url: string;
  gif_url?: string;
  thumbnail_url?: string;
}

export interface GlobalRecipe {
  recipe_id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  image_url: string;
  video_url?: string;
  tags: string[];
}

export interface ProgramDay {
  program_id: string;
  plan_name: string;
  week_number: number;
  day_number: number;
  day_name: string;
  focus: string;
  exercises: ProgramExercise[];
  is_rest_day: boolean;
}

export interface ProgramExercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  instructions?: string;
  video_url?: string;
}

// API Response types
interface ApiResponse<T = unknown> {
  ok: boolean;
  error?: string;
  [key: string]: T | boolean | string | undefined;
}

// Helper function for API calls
async function apiCall<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...payload }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.ok && result.error) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    console.error(`API call failed for action ${action}:`, error);
    throw error;
  }
}

// Authentication
export async function login(email: string, password: string): Promise<UserProfile | null> {
  try {
    const result = await apiCall<{ ok: boolean; profile?: UserProfile }>('login', { email, password });
    return result.profile || null;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

// Dashboard
export async function getDashboard(userId: string) {
  try {
    const result = await apiCall<{ ok: boolean; dashboard?: unknown }>('getDashboard', { user_id: userId });
    return result.dashboard;
  } catch (error) {
    console.error('Get dashboard failed:', error);
    return null;
  }
}

// Submit Nutrition (Daily Tracker / Fuel Tracker)
export async function submitNutrition(userId: string, date: string, items: Array<{ name: string; calories: number; protein: number; carbs: number; fats: number }>) {
  try {
    const result = await apiCall<{ ok: boolean; calories?: number; protein?: number; carbs?: number; fats?: number }>('submitNutrition', {
      user_id: userId,
      date,
      items,
    });
    return result;
  } catch (error) {
    console.error('Submit nutrition failed:', error);
    return null;
  }
}

// Submit Progress (Weight, Steps, Water)
export async function submitProgress(userId: string, date: string, data: { weight?: number; steps?: number; water_ml?: number; notes?: string }) {
  try {
    const result = await apiCall<{ ok: boolean }>('submitProgress', {
      user_id: userId,
      date,
      ...data,
    });
    return result;
  } catch (error) {
    console.error('Submit progress failed:', error);
    return null;
  }
}

// Get Program For Date
export async function getProgramForDate(userId: string, date: string): Promise<ProgramDay[] | null> {
  try {
    const result = await apiCall<{ ok: boolean; program?: ProgramDay[]; weekNumber?: number; dayOfWeek?: number }>('getProgramForDate', {
      user_id: userId,
      date,
    });
    return result.program || null;
  } catch (error) {
    console.error('Get program failed:', error);
    return null;
  }
}

// Update Streak
export async function updateStreak(userId: string, date: string, data: { workout_done: boolean; diet_done: boolean; rest_day: boolean; notes?: string }) {
  try {
    const result = await apiCall<{ ok: boolean; streak_status?: string }>('updateStreak', {
      user_id: userId,
      date,
      ...data,
    });
    return result;
  } catch (error) {
    console.error('Update streak failed:', error);
    return null;
  }
}

// Admin Functions
export async function adminAuth(adminUser: string, adminPass: string): Promise<boolean> {
  try {
    const result = await apiCall<{ ok: boolean }>('adminAuth', {
      admin_user: adminUser,
      admin_pass: adminPass,
    });
    return result.ok;
  } catch (error) {
    console.error('Admin auth failed:', error);
    return false;
  }
}

export async function adminAddExercise(adminUser: string, adminPass: string, exercise: Partial<GlobalWorkout>) {
  try {
    const result = await apiCall<{ ok: boolean }>('adminAddExercise', {
      admin_user: adminUser,
      admin_pass: adminPass,
      exercise,
    });
    return result;
  } catch (error) {
    console.error('Add exercise failed:', error);
    return null;
  }
}

export async function adminEditRecipe(adminUser: string, adminPass: string, recipeId: string, updates: Partial<GlobalRecipe>) {
  try {
    const result = await apiCall<{ ok: boolean }>('adminEditRecipe', {
      admin_user: adminUser,
      admin_pass: adminPass,
      recipe_id: recipeId,
      updates,
    });
    return result;
  } catch (error) {
    console.error('Edit recipe failed:', error);
    return null;
  }
}

// Admin User Management
export async function adminCreateUser(adminUser: string, adminPass: string, userData: Partial<UserProfile>) {
  try {
    const result = await apiCall<{ ok: boolean; user_id?: string; generated_password?: string }>('adminCreateUser', {
      admin_user: adminUser,
      admin_pass: adminPass,
      user_data: userData,
    });
    return result;
  } catch (error) {
    console.error('Create user failed:', error);
    return null;
  }
}

export async function adminUpdateUser(adminUser: string, adminPass: string, userId: string, updates: Partial<UserProfile>) {
  try {
    const result = await apiCall<{ ok: boolean }>('adminUpdateUser', {
      admin_user: adminUser,
      admin_pass: adminPass,
      user_id: userId,
      updates,
    });
    return result;
  } catch (error) {
    console.error('Update user failed:', error);
    return null;
  }
}

export async function adminGetAllUsers(adminUser: string, adminPass: string): Promise<UserProfile[] | null> {
  try {
    const result = await apiCall<{ ok: boolean; users?: UserProfile[] }>('adminGetAllUsers', {
      admin_user: adminUser,
      admin_pass: adminPass,
    });
    return result.users || null;
  } catch (error) {
    console.error('Get all users failed:', error);
    return null;
  }
}

// Get all workouts from Global_Workouts
export async function getGlobalWorkouts(): Promise<GlobalWorkout[] | null> {
  try {
    const result = await apiCall<{ ok: boolean; workouts?: GlobalWorkout[] }>('getGlobalWorkouts', {});
    return result.workouts || null;
  } catch (error) {
    console.error('Get workouts failed:', error);
    return null;
  }
}

// Get all recipes from Global_Recipes
export async function getGlobalRecipes(): Promise<GlobalRecipe[] | null> {
  try {
    const result = await apiCall<{ ok: boolean; recipes?: GlobalRecipe[] }>('getGlobalRecipes', {});
    return result.recipes || null;
  } catch (error) {
    console.error('Get recipes failed:', error);
    return null;
  }
}

// Get all programs
export async function getAllPrograms(): Promise<ProgramDay[] | null> {
  try {
    const result = await apiCall<{ ok: boolean; programs?: ProgramDay[] }>('getAllPrograms', {});
    return result.programs || null;
  } catch (error) {
    console.error('Get programs failed:', error);
    return null;
  }
}

// Get user progress for date range
export async function getUserProgress(userId: string, startDate?: string, endDate?: string): Promise<UserProgress[] | null> {
  try {
    const result = await apiCall<{ ok: boolean; progress?: UserProgress[] }>('getUserProgress', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    });
    return result.progress || null;
  } catch (error) {
    console.error('Get user progress failed:', error);
    return null;
  }
}

// Get user streaks
export async function getUserStreaks(userId: string): Promise<UserStreak[] | null> {
  try {
    const result = await apiCall<{ ok: boolean; streaks?: UserStreak[] }>('getUserStreaks', {
      user_id: userId,
    });
    return result.streaks || null;
  } catch (error) {
    console.error('Get user streaks failed:', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const result = await apiCall<{ ok: boolean }>('updateUserProfile', {
      user_id: userId,
      updates,
    });
    return result;
  } catch (error) {
    console.error('Update profile failed:', error);
    return null;
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<UserProfile | null> {
  try {
    const result = await apiCall<{ ok: boolean; user?: UserProfile }>('getUserById', {
      user_id: userId,
    });
    return result.user || null;
  } catch (error) {
    console.error('Get user failed:', error);
    return null;
  }
}
