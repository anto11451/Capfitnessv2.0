import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BarChart, ChevronRight, CalendarCheck, Loader2, Dumbbell, Target, Flame, Play, CheckCircle2, ArrowLeft, Timer, Zap, Users, Trophy, Scale } from 'lucide-react';
import { getAllPrograms, ProgramDay } from '@/lib/googleSheetsApi';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { exercises as allExercises } from '@/lib/mockData';

interface DetailedExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  weight?: string;
  notes?: string;
  videoUrl?: string;
  instructions?: string[];
  muscleGroup?: string;
}

interface PlanDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  isRest: boolean;
  duration?: string;
  exercises: DetailedExercise[];
}

interface DetailedPlan {
  id: string;
  name: string;
  shortName: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  daysPerWeek: number;
  duration: string;
  goal: string;
  targetAudience: string;
  weeks: number;
  icon: React.ReactNode;
  color: string;
  days: PlanDay[];
  tips: string[];
}

const detailedPlans: DetailedPlan[] = [
  {
    id: 'full-body',
    name: 'Full Body Foundations',
    shortName: 'Full Body',
    description: 'Perfect for beginners. Train every muscle group in each session for balanced development and strength gains.',
    level: 'Beginner',
    daysPerWeek: 3,
    duration: '45-60 min',
    goal: 'Build Strength & Learn Form',
    targetAudience: 'New lifters, those returning after a break',
    weeks: 8,
    icon: <Dumbbell className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-600',
    tips: [
      'Focus on form over weight - master the movement patterns first',
      'Take 48 hours rest between sessions for optimal recovery',
      'Increase weights by 2.5kg when you can complete all reps with good form',
      'Keep a training log to track your progress'
    ],
    days: [
      {
        dayNumber: 1,
        dayName: 'Monday',
        focus: 'Full Body A',
        isRest: false,
        duration: '50 min',
        exercises: [
          { name: 'Barbell Squat', sets: 3, reps: '8-10', rest: '90s', weight: 'Light-Moderate', notes: 'Focus on depth and knee tracking', muscleGroup: 'Legs', instructions: ['Stand with feet shoulder-width apart', 'Keep chest up and core braced', 'Descend until thighs are parallel', 'Drive through heels to stand'] },
          { name: 'Barbell Bench Press', sets: 3, reps: '8-10', rest: '90s', weight: 'Light-Moderate', notes: 'Control the descent', muscleGroup: 'Chest', instructions: ['Lie flat, grip slightly wider than shoulders', 'Lower bar to mid-chest', 'Press up in a slight arc', 'Keep shoulder blades retracted'] },
          { name: 'Barbell Row', sets: 3, reps: '8-10', rest: '90s', weight: 'Light-Moderate', notes: 'Pull to lower chest', muscleGroup: 'Back', instructions: ['Hinge at hips, back flat', 'Pull bar to lower chest', 'Squeeze shoulder blades together', 'Lower with control'] },
          { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90s', weight: 'Light', notes: 'Engage core throughout', muscleGroup: 'Shoulders', instructions: ['Start with bar at shoulder height', 'Press straight overhead', 'Lock out arms at top', 'Lower with control'] },
          { name: 'Plank', sets: 3, reps: '30-45s', rest: '60s', notes: 'Keep hips level', muscleGroup: 'Core', instructions: ['Forearms on ground, body straight', 'Engage core and glutes', 'Keep hips level with shoulders', 'Breathe steadily'] },
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        focus: 'Rest & Recovery',
        isRest: true,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        focus: 'Full Body B',
        isRest: false,
        duration: '50 min',
        exercises: [
          { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: '90s', weight: 'Light-Moderate', notes: 'Feel the hamstring stretch', muscleGroup: 'Hamstrings', instructions: ['Hold bar at hip level', 'Hinge at hips, slight knee bend', 'Lower until hamstring stretch felt', 'Drive hips forward to return'] },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '90s', weight: 'Light-Moderate', notes: 'Full range of motion', muscleGroup: 'Shoulders', instructions: ['Start with dumbbells at shoulders', 'Press overhead', 'Touch dumbbells at top', 'Lower with control'] },
          { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', notes: 'Pull to upper chest', muscleGroup: 'Back', instructions: ['Grip bar slightly wider than shoulders', 'Pull bar to upper chest', 'Squeeze lats at bottom', 'Control the return'] },
          { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', notes: 'Full range without rounding lower back', muscleGroup: 'Legs', instructions: ['Position feet shoulder-width on platform', 'Lower with control', 'Push through full foot', 'Don\'t lock knees at top'] },
          { name: 'Dumbbell Curl', sets: 2, reps: '12-15', rest: '60s', weight: 'Light', notes: 'No swinging', muscleGroup: 'Biceps', instructions: ['Arms at sides, palms forward', 'Curl weights to shoulders', 'Squeeze biceps at top', 'Lower slowly'] },
        ]
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        focus: 'Rest & Recovery',
        isRest: true,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        focus: 'Full Body C',
        isRest: false,
        duration: '50 min',
        exercises: [
          { name: 'Goblet Squat', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', notes: 'Keep elbows inside knees', muscleGroup: 'Legs', instructions: ['Hold dumbbell at chest', 'Squat down, elbows inside knees', 'Keep chest up throughout', 'Drive through heels'] },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90s', weight: 'Light-Moderate', notes: 'Feel upper chest stretch', muscleGroup: 'Chest', instructions: ['Set bench to 30-45 degrees', 'Lower dumbbells to upper chest', 'Press up and together', 'Full stretch at bottom'] },
          { name: 'Cable Row', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', notes: 'Squeeze at contraction', muscleGroup: 'Back', instructions: ['Sit with slight knee bend', 'Pull handle to lower chest', 'Squeeze shoulder blades', 'Control the return'] },
          { name: 'Lateral Raise', sets: 3, reps: '12-15', rest: '60s', weight: 'Light', notes: 'Lead with elbows', muscleGroup: 'Shoulders', instructions: ['Arms at sides, slight elbow bend', 'Raise to shoulder height', 'Lead with elbows, not hands', 'Lower with control'] },
          { name: 'Tricep Pushdown', sets: 2, reps: '12-15', rest: '60s', weight: 'Light', notes: 'Keep elbows pinned', muscleGroup: 'Triceps', instructions: ['Stand facing cable machine', 'Pin elbows to sides', 'Push down until arms straight', 'Squeeze triceps, return slowly'] },
        ]
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        focus: 'Active Recovery',
        isRest: true,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        focus: 'Rest',
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper/Lower Power Split',
    shortName: 'Upper/Lower',
    description: 'Alternate between upper and lower body days for optimal frequency and recovery. Great for building strength and size.',
    level: 'Intermediate',
    daysPerWeek: 4,
    duration: '60-75 min',
    goal: 'Build Muscle & Strength',
    targetAudience: 'Those with 6+ months training experience',
    weeks: 12,
    icon: <Target className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-600',
    tips: [
      'Upper days focus on pushing and pulling movements',
      'Lower days target quads, hamstrings, and glutes',
      'Progressive overload is key - add weight or reps weekly',
      'Get 7-9 hours of sleep for optimal recovery'
    ],
    days: [
      {
        dayNumber: 1,
        dayName: 'Monday',
        focus: 'Upper Power',
        isRest: false,
        duration: '65 min',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '5-6', rest: '2-3min', weight: 'Heavy', notes: 'Focus on explosive press', muscleGroup: 'Chest', instructions: ['Set up with arch and leg drive', 'Lower bar with control', 'Press explosively', 'Lock out at top'] },
          { name: 'Barbell Row', sets: 4, reps: '5-6', rest: '2-3min', weight: 'Heavy', notes: 'Explosive pull, controlled lower', muscleGroup: 'Back', instructions: ['Hinge forward, back flat', 'Pull bar explosively to chest', 'Squeeze at top', 'Lower with control'] },
          { name: 'Overhead Press', sets: 3, reps: '6-8', rest: '2min', weight: 'Heavy', notes: 'Strict form, no leg drive', muscleGroup: 'Shoulders', instructions: ['Bar at front of shoulders', 'Brace core tightly', 'Press straight up', 'Lock out overhead'] },
          { name: 'Weighted Pull-ups', sets: 3, reps: '6-8', rest: '2min', weight: 'Bodyweight +', notes: 'Add weight via belt or vest', muscleGroup: 'Back', instructions: ['Dead hang start', 'Pull until chin over bar', 'Control the descent', 'Full extension at bottom'] },
          { name: 'Barbell Curl', sets: 3, reps: '8-10', rest: '90s', weight: 'Moderate', notes: 'No swinging', muscleGroup: 'Biceps', instructions: ['Stand with bar at thighs', 'Curl to shoulders', 'Keep elbows stationary', 'Lower under control'] },
          { name: 'Skull Crushers', sets: 3, reps: '8-10', rest: '90s', weight: 'Moderate', notes: 'Lower to forehead', muscleGroup: 'Triceps', instructions: ['Lie on bench, arms vertical', 'Lower bar to forehead', 'Keep upper arms still', 'Extend to lockout'] },
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        focus: 'Lower Power',
        isRest: false,
        duration: '70 min',
        exercises: [
          { name: 'Barbell Squat', sets: 4, reps: '5-6', rest: '3min', weight: 'Heavy', notes: 'Below parallel depth', muscleGroup: 'Legs', instructions: ['Bar on upper back, not neck', 'Brace core, break at hips', 'Descend to depth', 'Drive up explosively'] },
          { name: 'Romanian Deadlift', sets: 4, reps: '6-8', rest: '2-3min', weight: 'Heavy', notes: 'Feel the stretch', muscleGroup: 'Hamstrings', instructions: ['Start at top position', 'Push hips back', 'Lower until stretch felt', 'Drive hips forward'] },
          { name: 'Leg Press', sets: 3, reps: '8-10', rest: '2min', weight: 'Heavy', notes: 'Full range of motion', muscleGroup: 'Legs', instructions: ['Feet shoulder-width apart', 'Lower with control', 'Push through whole foot', 'Don\'t lock knees'] },
          { name: 'Walking Lunges', sets: 3, reps: '10 each leg', rest: '90s', weight: 'Moderate', notes: 'Long stride, knee tracking', muscleGroup: 'Legs', instructions: ['Take large step forward', 'Lower back knee to ground', 'Push off front foot', 'Alternate legs'] },
          { name: 'Standing Calf Raise', sets: 4, reps: '10-12', rest: '60s', weight: 'Heavy', notes: 'Full stretch and contraction', muscleGroup: 'Calves', instructions: ['Stand on raised platform', 'Lower heels for full stretch', 'Rise up onto toes', 'Pause at top'] },
          { name: 'Hanging Leg Raise', sets: 3, reps: '10-15', rest: '60s', notes: 'No swinging', muscleGroup: 'Core', instructions: ['Hang from bar', 'Raise legs to parallel', 'Keep core tight', 'Lower with control'] },
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        focus: 'Rest & Recovery',
        isRest: true,
        exercises: []
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        focus: 'Upper Hypertrophy',
        isRest: false,
        duration: '65 min',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '90s', weight: 'Moderate', notes: 'Squeeze chest at top', muscleGroup: 'Chest', instructions: ['30-45 degree incline', 'Lower to upper chest', 'Press up and together', 'Control the movement'] },
          { name: 'Cable Row', sets: 4, reps: '10-12', rest: '90s', weight: 'Moderate', notes: 'Squeeze at contraction', muscleGroup: 'Back', instructions: ['Sit upright', 'Pull to lower chest', 'Squeeze shoulder blades', 'Slow eccentric'] },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', notes: 'Touch at top', muscleGroup: 'Shoulders', instructions: ['Sit or stand', 'Press overhead', 'Touch dumbbells', 'Full range of motion'] },
          { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', notes: 'Wide grip, pull to chest', muscleGroup: 'Back', instructions: ['Wide overhand grip', 'Pull to upper chest', 'Lean back slightly', 'Squeeze lats'] },
          { name: 'Cable Lateral Raise', sets: 3, reps: '12-15', rest: '60s', weight: 'Light', notes: 'Constant tension', muscleGroup: 'Shoulders', instructions: ['Stand beside cable', 'Raise arm to shoulder height', 'Lead with elbow', 'Control down'] },
          { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s', weight: 'Light', notes: 'External rotation at end', muscleGroup: 'Rear Delts', instructions: ['Set cable at face height', 'Pull rope to face', 'Externally rotate', 'Squeeze rear delts'] },
          { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '60s', weight: 'Light-Moderate', notes: 'Alternating', muscleGroup: 'Biceps', instructions: ['Neutral grip', 'Curl to shoulder', 'Keep elbows still', 'Alternate arms'] },
          { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s', weight: 'Light-Moderate', notes: 'Full stretch', muscleGroup: 'Triceps', instructions: ['Hold dumbbell overhead', 'Lower behind head', 'Feel the stretch', 'Extend to lockout'] },
        ]
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        focus: 'Lower Hypertrophy',
        isRest: false,
        duration: '65 min',
        exercises: [
          { name: 'Leg Press', sets: 4, reps: '10-12', rest: '2min', weight: 'Heavy', notes: 'Deep range of motion', muscleGroup: 'Legs', instructions: ['Position feet mid-platform', 'Lower as deep as possible', 'Push through heels', 'Don\'t lock out'] },
          { name: 'Leg Curl', sets: 4, reps: '10-12', rest: '90s', weight: 'Moderate', notes: 'Squeeze at contraction', muscleGroup: 'Hamstrings', instructions: ['Lie face down', 'Curl weight to glutes', 'Squeeze hamstrings', 'Lower with control'] },
          { name: 'Leg Extension', sets: 3, reps: '12-15', rest: '60s', weight: 'Moderate', notes: 'Pause at top', muscleGroup: 'Quads', instructions: ['Sit with back supported', 'Extend legs fully', 'Pause and squeeze', 'Lower slowly'] },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10-12 each', rest: '90s', weight: 'Moderate', notes: 'Rear foot elevated', muscleGroup: 'Legs', instructions: ['Rear foot on bench', 'Lower until thigh parallel', 'Keep torso upright', 'Drive through front heel'] },
          { name: 'Hip Thrust', sets: 3, reps: '10-12', rest: '90s', weight: 'Heavy', notes: 'Squeeze glutes at top', muscleGroup: 'Glutes', instructions: ['Upper back on bench', 'Bar across hips', 'Drive through heels', 'Full hip extension'] },
          { name: 'Seated Calf Raise', sets: 4, reps: '12-15', rest: '60s', weight: 'Moderate', notes: 'Full range', muscleGroup: 'Calves', instructions: ['Sit with pad on thighs', 'Lower heels for stretch', 'Rise up on toes', 'Hold at top'] },
          { name: 'Cable Crunch', sets: 3, reps: '15-20', rest: '60s', weight: 'Moderate', notes: 'Crunch, don\'t pull', muscleGroup: 'Core', instructions: ['Kneel facing cable', 'Hold rope behind head', 'Crunch down', 'Focus on abs, not arms'] },
        ]
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        focus: 'Active Recovery',
        isRest: true,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        focus: 'Rest',
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: 'ppl',
    name: 'Push Pull Legs',
    shortName: 'PPL',
    description: 'The ultimate hypertrophy program. Each muscle group gets maximum attention with optimal frequency and volume.',
    level: 'Advanced',
    daysPerWeek: 6,
    duration: '60-90 min',
    goal: 'Maximum Muscle Growth',
    targetAudience: 'Experienced lifters with 1+ year training',
    weeks: 12,
    icon: <Flame className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-600',
    tips: [
      'Push = Chest, Shoulders, Triceps',
      'Pull = Back, Biceps, Rear Delts',
      'Legs = Quads, Hamstrings, Glutes, Calves',
      'Run twice per week for maximum frequency and growth'
    ],
    days: [
      {
        dayNumber: 1,
        dayName: 'Monday',
        focus: 'Push',
        isRest: false,
        duration: '70 min',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest: '2-3min', weight: 'Heavy', muscleGroup: 'Chest', instructions: ['Arch back, feet planted', 'Lower bar to mid-chest', 'Press up explosively', 'Lock out at top'] },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', rest: '90s', weight: 'Moderate-Heavy', muscleGroup: 'Chest', instructions: ['30-45 degree angle', 'Lower to upper chest', 'Press up and together', 'Squeeze at top'] },
          { name: 'Overhead Press', sets: 4, reps: '6-8', rest: '2min', weight: 'Heavy', muscleGroup: 'Shoulders', instructions: ['Bar at front of shoulders', 'Brace core', 'Press straight up', 'Full lockout'] },
          { name: 'Cable Flyes', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Chest', instructions: ['Set cables high', 'Slight bend in elbows', 'Bring hands together', 'Squeeze chest'] },
          { name: 'Lateral Raise', sets: 4, reps: '12-15', rest: '60s', weight: 'Light', muscleGroup: 'Shoulders', instructions: ['Arms at sides', 'Raise to shoulder height', 'Lead with elbows', 'Control down'] },
          { name: 'Tricep Pushdown', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Triceps', instructions: ['Pin elbows to sides', 'Push down to full extension', 'Squeeze triceps', 'Control return'] },
          { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s', weight: 'Moderate', muscleGroup: 'Triceps', instructions: ['Cable or dumbbell', 'Full stretch at bottom', 'Extend to lockout', 'Keep elbows in'] },
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        focus: 'Pull',
        isRest: false,
        duration: '70 min',
        exercises: [
          { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: '2-3min', weight: 'Bodyweight +', muscleGroup: 'Back', instructions: ['Dead hang start', 'Pull chin over bar', 'Full lat stretch', 'Control descent'] },
          { name: 'Barbell Row', sets: 4, reps: '6-8', rest: '2min', weight: 'Heavy', muscleGroup: 'Back', instructions: ['Hinge forward', 'Pull to lower chest', 'Squeeze shoulder blades', 'Lower with control'] },
          { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Back', instructions: ['Wide grip', 'Pull to upper chest', 'Squeeze lats', 'Full stretch at top'] },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Back', instructions: ['Sit upright', 'Pull to belly button', 'Squeeze', 'Control return'] },
          { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s', weight: 'Light', muscleGroup: 'Rear Delts', instructions: ['Set cable at face height', 'Pull to face', 'External rotation', 'Squeeze rear delts'] },
          { name: 'Barbell Curl', sets: 3, reps: '8-10', rest: '60s', weight: 'Moderate', muscleGroup: 'Biceps', instructions: ['Stand with bar at thighs', 'Curl to shoulders', 'Keep elbows still', 'Lower slowly'] },
          { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Biceps', instructions: ['Neutral grip', 'Curl to shoulder', 'No swinging', 'Control the eccentric'] },
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        focus: 'Legs',
        isRest: false,
        duration: '75 min',
        exercises: [
          { name: 'Barbell Squat', sets: 4, reps: '6-8', rest: '3min', weight: 'Heavy', muscleGroup: 'Legs', instructions: ['Bar on upper back', 'Break at hips and knees', 'Below parallel', 'Drive up explosively'] },
          { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '2min', weight: 'Heavy', muscleGroup: 'Hamstrings', instructions: ['Start at top', 'Push hips back', 'Feel hamstring stretch', 'Drive hips forward'] },
          { name: 'Leg Press', sets: 3, reps: '10-12', rest: '2min', weight: 'Heavy', muscleGroup: 'Legs', instructions: ['Feet shoulder-width', 'Full range of motion', 'Push through heels', 'Don\'t lock knees'] },
          { name: 'Leg Curl', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Hamstrings', instructions: ['Lying or seated', 'Curl to glutes', 'Squeeze at top', 'Slow eccentric'] },
          { name: 'Leg Extension', sets: 3, reps: '12-15', rest: '60s', weight: 'Moderate', muscleGroup: 'Quads', instructions: ['Full extension', 'Pause at top', 'Squeeze quads', 'Control down'] },
          { name: 'Standing Calf Raise', sets: 4, reps: '10-15', rest: '60s', weight: 'Heavy', muscleGroup: 'Calves', instructions: ['Full stretch at bottom', 'Rise up high', 'Pause at top', 'Control down'] },
          { name: 'Hanging Leg Raise', sets: 3, reps: '12-15', rest: '60s', muscleGroup: 'Core', instructions: ['Dead hang', 'Raise legs to parallel', 'Control the movement', 'No swinging'] },
        ]
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        focus: 'Push',
        isRest: false,
        duration: '70 min',
        exercises: [
          { name: 'Incline Barbell Press', sets: 4, reps: '6-8', rest: '2-3min', weight: 'Heavy', muscleGroup: 'Chest', instructions: ['30-45 degree incline', 'Lower to upper chest', 'Press explosively', 'Full lockout'] },
          { name: 'Dumbbell Bench Press', sets: 3, reps: '8-10', rest: '90s', weight: 'Moderate-Heavy', muscleGroup: 'Chest', instructions: ['Dumbbells at chest', 'Press up and together', 'Full stretch at bottom', 'Squeeze at top'] },
          { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Shoulders', instructions: ['Start palms facing you', 'Rotate as you press', 'Full lockout', 'Reverse on the way down'] },
          { name: 'Cable Crossover', sets: 3, reps: '12-15', rest: '60s', weight: 'Light-Moderate', muscleGroup: 'Chest', instructions: ['Set cables low or high', 'Slight forward lean', 'Bring hands together', 'Squeeze chest'] },
          { name: 'Cable Lateral Raise', sets: 3, reps: '12-15', rest: '60s', weight: 'Light', muscleGroup: 'Shoulders', instructions: ['Stand beside cable', 'Raise arm to shoulder height', 'Constant tension', 'Control down'] },
          { name: 'Dips', sets: 3, reps: '8-12', rest: '90s', weight: 'Bodyweight or +', muscleGroup: 'Triceps', instructions: ['Lean forward for chest', 'Stay upright for triceps', 'Full range of motion', 'Control the descent'] },
          { name: 'Cable Tricep Kickback', sets: 3, reps: '12-15', rest: '60s', weight: 'Light', muscleGroup: 'Triceps', instructions: ['Hinge forward', 'Extend arm fully', 'Squeeze triceps', 'Control return'] },
        ]
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        focus: 'Pull',
        isRest: false,
        duration: '70 min',
        exercises: [
          { name: 'T-Bar Row', sets: 4, reps: '6-8', rest: '2min', weight: 'Heavy', muscleGroup: 'Back', instructions: ['Straddle the bar', 'Pull to chest', 'Squeeze back', 'Control down'] },
          { name: 'Close Grip Lat Pulldown', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Back', instructions: ['Neutral or underhand grip', 'Pull to upper chest', 'Squeeze lats', 'Full stretch'] },
          { name: 'One Arm Dumbbell Row', sets: 3, reps: '10-12 each', rest: '60s', weight: 'Moderate-Heavy', muscleGroup: 'Back', instructions: ['One hand on bench', 'Pull dumbbell to hip', 'Squeeze at top', 'Full stretch'] },
          { name: 'Straight Arm Pulldown', sets: 3, reps: '12-15', rest: '60s', weight: 'Light-Moderate', muscleGroup: 'Lats', instructions: ['Arms straight', 'Pull bar to thighs', 'Squeeze lats', 'Control up'] },
          { name: 'Reverse Fly', sets: 3, reps: '15-20', rest: '60s', weight: 'Light', muscleGroup: 'Rear Delts', instructions: ['Slight bend in elbows', 'Raise arms out to sides', 'Squeeze rear delts', 'Control down'] },
          { name: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Biceps', instructions: ['Lie on incline bench', 'Arms hanging down', 'Curl to shoulders', 'Full stretch at bottom'] },
          { name: 'Preacher Curl', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Biceps', instructions: ['Arms on pad', 'Full extension at bottom', 'Curl to shoulders', 'Squeeze at top'] },
        ]
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        focus: 'Legs',
        isRest: false,
        duration: '75 min',
        exercises: [
          { name: 'Front Squat', sets: 4, reps: '6-8', rest: '3min', weight: 'Heavy', muscleGroup: 'Quads', instructions: ['Bar in front rack position', 'Keep elbows high', 'Deep squat', 'Drive up'] },
          { name: 'Stiff Leg Deadlift', sets: 4, reps: '8-10', rest: '2min', weight: 'Heavy', muscleGroup: 'Hamstrings', instructions: ['Minimal knee bend', 'Push hips back', 'Feel deep stretch', 'Drive hips forward'] },
          { name: 'Hack Squat', sets: 3, reps: '10-12', rest: '2min', weight: 'Heavy', muscleGroup: 'Quads', instructions: ['Feet lower on platform', 'Full depth', 'Push through legs', 'Control descent'] },
          { name: 'Good Mornings', sets: 3, reps: '10-12', rest: '90s', weight: 'Light-Moderate', muscleGroup: 'Hamstrings', instructions: ['Bar on back', 'Push hips back', 'Feel stretch', 'Return to standing'] },
          { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '90s', weight: 'Moderate', muscleGroup: 'Legs', instructions: ['Long stride', 'Back knee near ground', 'Push off front foot', 'Stay upright'] },
          { name: 'Seated Calf Raise', sets: 4, reps: '12-15', rest: '60s', weight: 'Moderate', muscleGroup: 'Calves', instructions: ['Full stretch', 'Rise up high', 'Pause at top', 'Slow eccentric'] },
          { name: 'Ab Wheel Rollout', sets: 3, reps: '10-15', rest: '60s', muscleGroup: 'Core', instructions: ['Start on knees', 'Roll out as far as possible', 'Keep core tight', 'Roll back to start'] },
        ]
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        focus: 'Rest & Recovery',
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: 'bro-split',
    name: 'Classic Bro Split',
    shortName: 'Bro Split',
    description: 'The classic bodybuilding split. One muscle group per day for maximum volume and the legendary pump.',
    level: 'Intermediate',
    daysPerWeek: 5,
    duration: '60-75 min',
    goal: 'Maximum Pump & Aesthetics',
    targetAudience: 'Those who love volume training',
    weeks: 12,
    icon: <Trophy className="w-6 h-6" />,
    color: 'from-orange-500 to-red-600',
    tips: [
      'Each muscle group gets dedicated attention and volume',
      'Great for developing mind-muscle connection',
      'Perfect for those who can train 5 days per week',
      'Focus on the pump and time under tension'
    ],
    days: [
      {
        dayNumber: 1,
        dayName: 'Monday',
        focus: 'Chest Day',
        isRest: false,
        duration: '60 min',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '2min', weight: 'Heavy', muscleGroup: 'Chest', instructions: ['Arch back slightly', 'Lower to mid-chest', 'Press explosively', 'Full lockout'] },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Upper Chest', instructions: ['30-45 degree angle', 'Deep stretch at bottom', 'Press up and together', 'Squeeze at top'] },
          { name: 'Decline Bench Press', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Lower Chest', instructions: ['Decline angle', 'Lower to lower chest', 'Press up', 'Control throughout'] },
          { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60s', weight: 'Light-Moderate', muscleGroup: 'Chest', instructions: ['Cables at various heights', 'Slight elbow bend', 'Bring hands together', 'Squeeze chest hard'] },
          { name: 'Dips (Chest Version)', sets: 3, reps: '10-15', rest: '60s', weight: 'Bodyweight', muscleGroup: 'Chest', instructions: ['Lean forward', 'Deep stretch at bottom', 'Press up', 'Keep leaning forward'] },
          { name: 'Push-ups', sets: 3, reps: 'To failure', rest: '60s', muscleGroup: 'Chest', instructions: ['Finish with push-ups', 'Full range of motion', 'Chest to ground', 'Push to lockout'] },
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        focus: 'Back Day',
        isRest: false,
        duration: '65 min',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '5-6', rest: '3min', weight: 'Heavy', muscleGroup: 'Back', instructions: ['Hip-width stance', 'Back flat, hips back', 'Drive through floor', 'Lock out at top'] },
          { name: 'Weighted Pull-ups', sets: 4, reps: '8-10', rest: '2min', weight: 'Bodyweight +', muscleGroup: 'Lats', instructions: ['Dead hang start', 'Pull chin over bar', 'Squeeze lats', 'Full stretch'] },
          { name: 'Barbell Row', sets: 4, reps: '8-10', rest: '90s', weight: 'Heavy', muscleGroup: 'Back', instructions: ['Hinge forward', 'Pull to lower chest', 'Squeeze back', 'Control down'] },
          { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Lats', instructions: ['Wide grip', 'Pull to upper chest', 'Lean back slightly', 'Full stretch at top'] },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Back', instructions: ['Sit upright', 'Pull to belly button', 'Squeeze shoulder blades', 'Slow eccentric'] },
          { name: 'Straight Arm Pulldown', sets: 3, reps: '12-15', rest: '60s', weight: 'Light', muscleGroup: 'Lats', instructions: ['Arms straight', 'Pull bar to thighs', 'Squeeze lats', 'Feel the stretch'] },
        ]
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        focus: 'Shoulder Day',
        isRest: false,
        duration: '60 min',
        exercises: [
          { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2min', weight: 'Heavy', muscleGroup: 'Shoulders', instructions: ['Bar at front of shoulders', 'Brace core', 'Press straight up', 'Full lockout'] },
          { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '90s', weight: 'Moderate', muscleGroup: 'Shoulders', instructions: ['Start palms facing you', 'Rotate as you press', 'Full extension', 'Reverse down'] },
          { name: 'Lateral Raise', sets: 4, reps: '12-15', rest: '60s', weight: 'Light', muscleGroup: 'Side Delts', instructions: ['Arms at sides', 'Raise to shoulder height', 'Lead with elbows', 'Slow descent'] },
          { name: 'Face Pulls', sets: 4, reps: '15-20', rest: '60s', weight: 'Light', muscleGroup: 'Rear Delts', instructions: ['Cable at face height', 'Pull to face', 'External rotation', 'Squeeze rear delts'] },
          { name: 'Reverse Fly', sets: 3, reps: '12-15', rest: '60s', weight: 'Light', muscleGroup: 'Rear Delts', instructions: ['Bend over or use machine', 'Raise arms out', 'Squeeze rear delts', 'Control down'] },
          { name: 'Shrugs', sets: 4, reps: '10-12', rest: '60s', weight: 'Heavy', muscleGroup: 'Traps', instructions: ['Heavy weight', 'Shrug up and hold', 'Don\'t roll shoulders', 'Lower slowly'] },
        ]
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        focus: 'Leg Day',
        isRest: false,
        duration: '75 min',
        exercises: [
          { name: 'Barbell Squat', sets: 4, reps: '8-10', rest: '3min', weight: 'Heavy', muscleGroup: 'Quads', instructions: ['Bar on upper back', 'Break at hips and knees', 'Below parallel', 'Drive up explosively'] },
          { name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '2min', weight: 'Heavy', muscleGroup: 'Hamstrings', instructions: ['Start at top', 'Push hips back', 'Feel stretch', 'Drive hips forward'] },
          { name: 'Leg Press', sets: 4, reps: '10-12', rest: '2min', weight: 'Heavy', muscleGroup: 'Legs', instructions: ['Full range of motion', 'Don\'t lock knees', 'Push through heels', 'Control descent'] },
          { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '90s', weight: 'Moderate', muscleGroup: 'Legs', instructions: ['Long stride', 'Back knee near ground', 'Stay upright', 'Push off front foot'] },
          { name: 'Leg Curl', sets: 4, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Hamstrings', instructions: ['Full range of motion', 'Curl to glutes', 'Squeeze at top', 'Slow eccentric'] },
          { name: 'Leg Extension', sets: 4, reps: '12-15', rest: '60s', weight: 'Moderate', muscleGroup: 'Quads', instructions: ['Full extension', 'Pause at top', 'Squeeze quads', 'Control down'] },
          { name: 'Standing Calf Raise', sets: 4, reps: '12-15', rest: '60s', weight: 'Heavy', muscleGroup: 'Calves', instructions: ['Full stretch at bottom', 'Rise up high', 'Pause at top', 'Control down'] },
        ]
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        focus: 'Arms Day',
        isRest: false,
        duration: '60 min',
        exercises: [
          { name: 'Barbell Curl', sets: 4, reps: '8-10', rest: '90s', weight: 'Moderate-Heavy', muscleGroup: 'Biceps', instructions: ['Stand with bar at thighs', 'Curl to shoulders', 'No swinging', 'Lower slowly'] },
          { name: 'Close Grip Bench Press', sets: 4, reps: '8-10', rest: '90s', weight: 'Heavy', muscleGroup: 'Triceps', instructions: ['Hands shoulder-width', 'Lower to lower chest', 'Press up', 'Lock out'] },
          { name: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Biceps', instructions: ['Lie on incline', 'Arms hanging', 'Curl to shoulders', 'Full stretch'] },
          { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Triceps', instructions: ['Lie on bench', 'Lower to forehead', 'Keep upper arms still', 'Extend to lockout'] },
          { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '60s', weight: 'Moderate', muscleGroup: 'Biceps', instructions: ['Neutral grip', 'Curl to shoulder', 'No swinging', 'Control down'] },
          { name: 'Tricep Pushdown', sets: 3, reps: '12-15', rest: '60s', weight: 'Moderate', muscleGroup: 'Triceps', instructions: ['Pin elbows to sides', 'Push to full extension', 'Squeeze triceps', 'Control return'] },
          { name: 'Preacher Curl', sets: 3, reps: '12-15', rest: '60s', weight: 'Light-Moderate', muscleGroup: 'Biceps', instructions: ['Arms on pad', 'Full extension', 'Curl up', 'Squeeze'] },
          { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s', weight: 'Moderate', muscleGroup: 'Triceps', instructions: ['Full stretch at bottom', 'Extend to lockout', 'Keep elbows in', 'Slow eccentric'] },
        ]
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        focus: 'Active Recovery',
        isRest: true,
        exercises: []
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        focus: 'Rest',
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: 'hiit',
    name: 'HIIT Fat Burner',
    shortName: 'HIIT',
    description: 'High-intensity interval training for maximum fat loss. Short, intense workouts that torch calories and boost metabolism.',
    level: 'Intermediate',
    daysPerWeek: 4,
    duration: '30-45 min',
    goal: 'Fat Loss & Conditioning',
    targetAudience: 'Those focused on cutting and conditioning',
    weeks: 8,
    icon: <Zap className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-600',
    tips: [
      'Work at 80-95% max heart rate during intervals',
      'Keep rest periods short to maintain elevated heart rate',
      'Combine with resistance training for best results',
      'Stay hydrated and fuel properly before sessions'
    ],
    days: [
      {
        dayNumber: 1,
        dayName: 'Monday',
        focus: 'Full Body HIIT',
        isRest: false,
        duration: '35 min',
        exercises: [
          { name: 'Burpees', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Full Body', instructions: ['Start standing', 'Drop to push-up position', 'Perform push-up', 'Jump up explosively'] },
          { name: 'Mountain Climbers', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Core', instructions: ['Start in plank', 'Drive knees to chest', 'Alternate rapidly', 'Keep hips down'] },
          { name: 'Jump Squats', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Legs', instructions: ['Squat down', 'Explode up', 'Land softly', 'Repeat immediately'] },
          { name: 'High Knees', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Cardio', instructions: ['Run in place', 'Drive knees high', 'Pump arms', 'Stay on balls of feet'] },
          { name: 'Jumping Lunges', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Legs', instructions: ['Start in lunge position', 'Jump and switch legs', 'Land softly', 'Repeat'] },
          { name: 'Plank Jacks', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Core', instructions: ['Start in plank', 'Jump feet out and in', 'Keep core tight', 'Maintain hip level'] },
        ]
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        focus: 'Active Recovery',
        isRest: true,
        exercises: []
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        focus: 'Cardio HIIT',
        isRest: false,
        duration: '30 min',
        exercises: [
          { name: 'Sprint Intervals', sets: 8, reps: '20s sprint / 40s walk', rest: '2min after all', muscleGroup: 'Cardio', instructions: ['Sprint at max effort', 'Walk to recover', 'Repeat 8 rounds', 'Stay consistent'] },
          { name: 'Box Jumps', sets: 4, reps: '10 reps', rest: '60s', muscleGroup: 'Legs', instructions: ['Stand facing box', 'Jump onto box', 'Step down', 'Repeat'] },
          { name: 'Battle Ropes', sets: 4, reps: '30s on / 30s off', rest: '60s after set', muscleGroup: 'Full Body', instructions: ['Grip ropes firmly', 'Create alternating waves', 'Use whole body', 'Keep intensity high'] },
          { name: 'Rowing Machine', sets: 3, reps: '500m sprints', rest: '90s', muscleGroup: 'Full Body', instructions: ['Set up properly', 'Push with legs first', 'Pull with arms', 'Maximum effort'] },
        ]
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        focus: 'Rest',
        isRest: true,
        exercises: []
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        focus: 'Upper Body HIIT',
        isRest: false,
        duration: '35 min',
        exercises: [
          { name: 'Push-up Variations', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Chest', instructions: ['Standard push-ups', 'Wide push-ups', 'Diamond push-ups', 'Rotate each round'] },
          { name: 'Dumbbell Thrusters', sets: 4, reps: '12 reps', rest: '45s', muscleGroup: 'Full Body', instructions: ['Hold dumbbells at shoulders', 'Squat down', 'Stand and press overhead', 'One fluid motion'] },
          { name: 'Renegade Rows', sets: 4, reps: '8 each arm', rest: '45s', muscleGroup: 'Back/Core', instructions: ['Plank with dumbbells', 'Row one arm', 'Stay stable', 'Alternate arms'] },
          { name: 'Shadow Boxing', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Cardio', instructions: ['Punch combinations', 'Stay light on feet', 'Maximum intensity', 'Keep guard up'] },
          { name: 'Plank to Push-up', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Core', instructions: ['Start in forearm plank', 'Push up to hands', 'Lower to forearms', 'Alternate leading arm'] },
        ]
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        focus: 'Lower Body HIIT',
        isRest: false,
        duration: '35 min',
        exercises: [
          { name: 'Squat Jumps', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Quads', instructions: ['Deep squat', 'Explode upward', 'Land soft', 'Repeat immediately'] },
          { name: 'Kettlebell Swings', sets: 4, reps: '15 reps', rest: '45s', muscleGroup: 'Full Body', instructions: ['Hinge at hips', 'Swing through legs', 'Drive hips forward', 'Swing to shoulder height'] },
          { name: 'Skater Jumps', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Legs', instructions: ['Jump side to side', 'Land on one leg', 'Touch ground', 'Explode to other side'] },
          { name: 'Wall Sit', sets: 3, reps: '45s hold', rest: '30s', muscleGroup: 'Quads', instructions: ['Back against wall', '90 degree knee angle', 'Hold position', 'Don\'t let thighs rise'] },
          { name: 'Glute Bridges', sets: 4, reps: '30s on / 15s off', rest: '30s after set', muscleGroup: 'Glutes', instructions: ['Lie on back', 'Drive through heels', 'Squeeze glutes at top', 'Lower and repeat'] },
        ]
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        focus: 'Rest',
        isRest: true,
        exercises: []
      }
    ]
  }
];

interface PlanGroup {
  name: string;
  days: ProgramDay[];
  level?: string;
  description?: string;
}

export default function PlansPage() {
  const [, setLocation] = useLocation();
  const [programs, setPrograms] = useState<PlanGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<DetailedPlan | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const handleStartWorkout = (day: PlanDay) => {
    const parseReps = (reps: string): number => {
      const match = reps.match(/(\d+)/);
      return match ? parseInt(match[1]) : 10;
    };
    
    const parseWeight = (weight: string | undefined): number | undefined => {
      if (!weight) return undefined;
      const match = weight.match(/(\d+)/);
      return match ? parseInt(match[1]) : undefined;
    };
    
    const workoutPlan = {
      id: `plan-${selectedPlan?.id}-day-${day.dayNumber}`,
      name: `${selectedPlan?.shortName} - ${day.focus}`,
      type: 'weight' as const,
      exercises: day.exercises.map((ex, idx) => ({
        id: String(idx + 1),
        name: ex.name,
        sets: ex.sets,
        reps: parseReps(ex.reps),
        weight: parseWeight(ex.weight),
      })),
    };
    localStorage.setItem('incomingWorkoutPlan', JSON.stringify(workoutPlan));
    setLocation('/app/workout-partner');
  };

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true);
      try {
        const data = await getAllPrograms();
        if (data) {
          const grouped = data.reduce((acc: Record<string, ProgramDay[]>, day) => {
            const name = day.plan_name || 'Unknown Plan';
            if (!acc[name]) acc[name] = [];
            acc[name].push(day);
            return acc;
          }, {});

          const planGroups: PlanGroup[] = Object.entries(grouped).map(([name, days]) => ({
            name,
            days: days.sort((a, b) => {
              if (a.week_number !== b.week_number) return a.week_number - b.week_number;
              return a.day_number - b.day_number;
            }),
            level: 'Intermediate',
            description: `A comprehensive ${name} program designed for maximum results.`,
          }));

          setPrograms(planGroups);
        }
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  const filteredPlans = difficultyFilter === 'all' 
    ? detailedPlans 
    : detailedPlans.filter(plan => plan.level === difficultyFilter);

  const convertWeight = (weight: string | undefined): string => {
    if (!weight) return '';
    if (weightUnit === 'lbs') {
      if (weight.includes('kg')) {
        const kgMatch = weight.match(/(\d+)/);
        if (kgMatch) {
          const lbs = Math.round(parseFloat(kgMatch[1]) * 2.205);
          return weight.replace(/\d+\s*kg/, `${lbs} lbs`);
        }
      }
    }
    return weight;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  if (selectedPlan) {
    const currentDay = selectedPlan.days.find(d => d.dayNumber === activeDay) || selectedPlan.days[0];
    const trainingDays = selectedPlan.days.filter(d => !d.isRest);
    const completedDays = 0;
    
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedPlan(null)}
              className="text-muted-foreground hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Plans
            </Button>
          </div>

          <div className={`p-6 rounded-2xl bg-gradient-to-r ${selectedPlan.color} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      {selectedPlan.icon}
                    </div>
                    <div>
                      <h1 className="text-3xl font-display font-bold text-white">{selectedPlan.name}</h1>
                      <p className="text-white/80">{selectedPlan.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLevelColor(selectedPlan.level)}`}>
                      {selectedPlan.level}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                      {selectedPlan.daysPerWeek} days/week
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                      {selectedPlan.weeks} weeks
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                      {selectedPlan.duration}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-black/30 rounded-lg p-2">
                    <Scale className="w-4 h-4 text-white/60" />
                    <Label className="text-white/80 text-sm">Weight Unit:</Label>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${weightUnit === 'kg' ? 'text-white font-bold' : 'text-white/60'}`}>KG</span>
                      <Switch 
                        checked={weightUnit === 'lbs'} 
                        onCheckedChange={(checked) => setWeightUnit(checked ? 'lbs' : 'kg')}
                      />
                      <span className={`text-sm ${weightUnit === 'lbs' ? 'text-white font-bold' : 'text-white/60'}`}>LBS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-card/40 border-white/5 p-4">
                <h3 className="font-bold text-white mb-3">Weekly Schedule</h3>
                <div className="space-y-2">
                  {selectedPlan.days.map((day) => (
                    <button
                      key={day.dayNumber}
                      onClick={() => setActiveDay(day.dayNumber)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        activeDay === day.dayNumber 
                          ? 'bg-secondary text-white' 
                          : day.isRest 
                            ? 'bg-black/20 text-muted-foreground hover:bg-white/5' 
                            : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{day.dayName}</p>
                          <p className="text-xs opacity-80">{day.focus}</p>
                        </div>
                        {!day.isRest && (
                          <span className="text-xs px-2 py-1 bg-black/20 rounded">
                            {day.exercises.length} exercises
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="bg-card/40 border-white/5 p-4">
                <h3 className="font-bold text-white mb-3">Pro Tips</h3>
                <ul className="space-y-2">
                  {selectedPlan.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="bg-card/40 border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white">{currentDay.dayName}: {currentDay.focus}</h2>
                      {currentDay.duration && (
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                          <Timer className="w-4 h-4" /> Estimated: {currentDay.duration}
                        </p>
                      )}
                    </div>
                    {!currentDay.isRest && (
                      <Button 
                        className="bg-secondary text-white hover:bg-secondary/80"
                        onClick={() => handleStartWorkout(currentDay)}
                      >
                        <Play className="w-4 h-4 mr-2" /> Start Workout
                      </Button>
                    )}
                  </div>
                </div>

                {currentDay.isRest ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">😴</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Rest Day</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Recovery is when your muscles grow. Focus on sleep, nutrition, and light stretching. 
                      You've earned this rest!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {currentDay.exercises.map((exercise, index) => (
                      <div key={index} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-white">{exercise.name}</h4>
                              {exercise.muscleGroup && (
                                <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-muted-foreground">
                                  {exercise.muscleGroup}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm mb-3">
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Sets:</span>
                                <span className="text-white font-medium">{exercise.sets}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Reps:</span>
                                <span className="text-white font-medium">{exercise.reps}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Rest:</span>
                                <span className="text-white font-medium">{exercise.rest}</span>
                              </div>
                              {exercise.weight && (
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Load:</span>
                                  <span className="text-secondary font-medium">{convertWeight(exercise.weight)}</span>
                                </div>
                              )}
                            </div>

                            {exercise.notes && (
                              <p className="text-sm text-amber-400/80 mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> {exercise.notes}
                              </p>
                            )}

                            {exercise.instructions && exercise.instructions.length > 0 && (
                              <div className="bg-black/20 rounded-lg p-4 mt-3">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Step-by-Step Instructions</p>
                                <ol className="space-y-1">
                                  {exercise.instructions.map((step, i) => (
                                    <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                                      <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs flex-shrink-0">
                                        {i + 1}
                                      </span>
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">TRAINING <span className="text-secondary">PLANS</span></h1>
            <p className="text-muted-foreground">Structured programs designed for maximum hypertrophy and strength.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card/40 rounded-lg p-2 border border-white/5">
              <Label className="text-muted-foreground text-sm">Difficulty:</Label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[140px] bg-black/40 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="detailed" className="space-y-6">
          <TabsList className="bg-black/40 border border-white/10 p-1">
            <TabsTrigger value="detailed" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
              DETAILED PLANS
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
              CUSTOM PLANS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid gap-6">
              {filteredPlans.map((plan) => (
                <Card 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className="relative overflow-hidden bg-card/40 backdrop-blur-md border-white/5 hover:border-secondary/50 transition-all group cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center relative z-10">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg`}>
                      {plan.icon}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-display font-bold text-white">{plan.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getLevelColor(plan.level)}`}>
                          {plan.level}
                        </span>
                      </div>
                      <p className="text-muted-foreground max-w-2xl">{plan.description}</p>
                      
                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Clock className="w-4 h-4 text-secondary" />
                          {plan.weeks} Weeks
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <BarChart className="w-4 h-4 text-secondary" />
                          {plan.daysPerWeek} Days / Week
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Timer className="w-4 h-4 text-secondary" />
                          {plan.duration}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Target className="w-4 h-4 text-secondary" />
                          {plan.goal}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button className="w-full md:w-auto bg-secondary text-white hover:bg-secondary/80 font-bold tracking-wide">
                        VIEW PROGRAM <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                <span className="ml-3 text-muted-foreground">Loading custom plans...</span>
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Custom Plans Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Custom plans from your coach will appear here. Choose from our detailed plans above to get started!
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {programs.map((plan, index) => (
                  <Dialog key={plan.name}>
                    <DialogTrigger asChild>
                      <Card className="relative overflow-hidden bg-card/40 backdrop-blur-md border-white/5 hover:border-secondary/50 transition-all group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center relative z-10">
                          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-[0_0_15px_rgba(188,19,254,0.1)]">
                            <span className="font-display font-bold text-2xl">{index + 1}</span>
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-2xl font-display font-bold text-white">{plan.name}</h3>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/5 text-muted-foreground border border-white/5">
                                {plan.level}
                              </span>
                            </div>
                            <p className="text-muted-foreground max-w-2xl">{plan.description}</p>
                          </div>

                          <div className="flex-shrink-0">
                            <Button className="w-full md:w-auto bg-secondary text-white hover:bg-secondary/80 font-bold tracking-wide">
                              VIEW PROGRAM <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-card border-white/10 text-white h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-display font-bold text-white">{plan.name}</DialogTitle>
                        <DialogDescription>{plan.level}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                          <h4 className="font-bold text-secondary mb-2">Program Overview</h4>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {plan.days.map((day, i) => (
                            <Card key={i} className={`p-4 border-white/10 ${day.is_rest_day ? 'bg-black/20' : 'bg-black/40'}`}>
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-white">
                                  {day.day_name || `Day ${day.day_number}`}
                                </h4>
                                <span className={`text-xs px-2 py-1 rounded ${day.is_rest_day ? 'bg-white/5 text-muted-foreground' : 'bg-secondary/20 text-secondary'}`}>
                                  {day.focus || (day.is_rest_day ? 'Rest Day' : 'Training')}
                                </span>
                              </div>
                              {day.is_rest_day ? (
                                <p className="text-sm text-muted-foreground italic">Recovery and rest</p>
                              ) : (
                                <ul className="space-y-2">
                                  {day.exercises?.map((ex, j) => (
                                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <div className="w-1 h-1 bg-secondary rounded-full mt-2" />
                                      <div>
                                        <span className="text-white">{ex.name}</span>
                                        {(ex.sets || ex.reps) && (
                                          <span className="text-xs ml-2 text-muted-foreground">
                                            {ex.sets && `${ex.sets} sets`} {ex.reps && `x ${ex.reps}`}
                                          </span>
                                        )}
                                      </div>
                                    </li>
                                  )) || <li className="text-sm text-muted-foreground">No exercises listed</li>}
                                </ul>
                              )}
                            </Card>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
