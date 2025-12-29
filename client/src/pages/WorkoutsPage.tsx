import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, PlayCircle, Video, Loader2, Dumbbell, Flame, Heart, Stretch } from 'lucide-react';
import { getGlobalWorkouts, GlobalWorkout } from '@/lib/googleSheetsApi';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const fallbackExercises: GlobalWorkout[] = [
  // LEGS - 12 exercises
  {
    exercise_id: 'leg-1',
    name: 'Barbell Back Squat',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Squat Rack',
    sets: '4',
    reps: '8-10',
    instructions: 'Position the barbell on your upper back, not your neck. Stand with feet shoulder-width apart. Brace your core and descend by breaking at the hips and knees simultaneously. Go below parallel, then drive through your heels to stand.',
    cues: ['Bar on upper traps, not neck', 'Break at hips and knees together', 'Knees track over toes', 'Drive through heels', 'Keep chest up throughout'],
    video_url: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
    gif_url: 'https://media.tenor.com/KMNYVDBh50gAAAAM/squat-gym.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=400'
  },
  {
    exercise_id: 'leg-2',
    name: 'Romanian Deadlift',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Intermediate',
    equipment: 'Barbell or Dumbbells',
    sets: '4',
    reps: '10-12',
    instructions: 'Hold the bar at hip level. Push your hips back while maintaining a slight bend in the knees. Lower the bar along your legs until you feel a stretch in your hamstrings. Drive your hips forward to return.',
    cues: ['Hips push back, not down', 'Slight knee bend throughout', 'Bar stays close to legs', 'Feel hamstring stretch', 'Squeeze glutes at top'],
    video_url: 'https://www.youtube.com/watch?v=7j-2w4-P14I',
    gif_url: 'https://media.tenor.com/0Zt14m4L-NcAAAAM/romanian-deadlift-rdl.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400'
  },
  {
    exercise_id: 'leg-3',
    name: 'Leg Press',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Beginner',
    equipment: 'Leg Press Machine',
    sets: '4',
    reps: '12-15',
    instructions: 'Position your feet shoulder-width apart on the platform. Lower the weight by bending your knees, keeping them tracking over your toes. Push through your entire foot to extend your legs without locking your knees.',
    cues: ['Feet shoulder-width apart', 'Lower back stays flat on pad', 'Full range of motion', 'Dont lock knees at top', 'Control the negative'],
    video_url: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    gif_url: 'https://media.tenor.com/YM9qXXTK4B4AAAAM/leg-press-gym.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'leg-4',
    name: 'Walking Lunges',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Beginner',
    equipment: 'Dumbbells (Optional)',
    sets: '3',
    reps: '12 each leg',
    instructions: 'Take a large step forward and lower your body until both knees form 90-degree angles. Push off your front foot and bring your back leg forward into the next lunge. Continue walking forward.',
    cues: ['Long stride forward', 'Back knee almost touches ground', 'Torso stays upright', 'Push through front heel', 'Alternate legs continuously'],
    video_url: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
    gif_url: 'https://media.tenor.com/sF3KFPX_E2MAAAAM/lunges-workout.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400'
  },
  {
    exercise_id: 'leg-5',
    name: 'Leg Curl',
    category: 'Isolation',
    muscle_group: 'Legs',
    difficulty: 'Beginner',
    equipment: 'Leg Curl Machine',
    sets: '3',
    reps: '12-15',
    instructions: 'Lie face down on the leg curl machine with the pad just above your heels. Curl the weight up by bending your knees, squeezing your hamstrings at the top. Lower with control.',
    cues: ['Hips stay pressed down', 'Curl all the way up', 'Squeeze hamstrings at top', 'Slow eccentric (3 seconds)', 'Dont use momentum'],
    video_url: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    gif_url: 'https://media.tenor.com/jR8qhJpXJwEAAAAM/leg-curl.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400'
  },
  {
    exercise_id: 'leg-6',
    name: 'Leg Extension',
    category: 'Isolation',
    muscle_group: 'Legs',
    difficulty: 'Beginner',
    equipment: 'Leg Extension Machine',
    sets: '3',
    reps: '12-15',
    instructions: 'Sit on the machine with the pad on your shins just above your ankles. Extend your legs fully, squeezing your quads at the top. Lower with control.',
    cues: ['Sit back in the seat', 'Full extension at top', 'Pause and squeeze quads', 'Control the descent', 'Dont swing the weight'],
    video_url: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    gif_url: 'https://media.tenor.com/4QJGrEDR0ZUAAAAM/leg-extension.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'leg-7',
    name: 'Bulgarian Split Squat',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells, Bench',
    sets: '3',
    reps: '10-12 each leg',
    instructions: 'Stand 2 feet in front of a bench. Place one foot on the bench behind you. Lower your body until your front thigh is parallel to the ground. Push through your front heel to stand.',
    cues: ['Rear foot laces down on bench', 'Front shin stays vertical', 'Torso upright', 'Lower until back knee almost touches', 'Drive through front heel'],
    video_url: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    gif_url: 'https://media.tenor.com/ZPuCBE0vGBsAAAAM/bulgarian-split-squat.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1598971639058-999e0b7c2e79?w=400'
  },
  {
    exercise_id: 'leg-8',
    name: 'Hip Thrust',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    sets: '4',
    reps: '10-12',
    instructions: 'Sit on the ground with your upper back against a bench. Roll a barbell over your hips. Drive through your heels to raise your hips until your body forms a straight line. Squeeze glutes at the top.',
    cues: ['Upper back on bench edge', 'Feet flat, hip-width apart', 'Drive through heels', 'Full hip extension', 'Squeeze glutes 2 seconds at top'],
    video_url: 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
    gif_url: 'https://media.tenor.com/S_0K7hLV_fQAAAAM/hip-thrust.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'
  },
  {
    exercise_id: 'leg-9',
    name: 'Goblet Squat',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Beginner',
    equipment: 'Dumbbell or Kettlebell',
    sets: '3',
    reps: '12-15',
    instructions: 'Hold a dumbbell or kettlebell at your chest with both hands. Squat down with your elbows inside your knees. Keep your chest up and push through your heels to stand.',
    cues: ['Hold weight at chest level', 'Elbows inside knees', 'Sit deep between legs', 'Chest stays up', 'Great for learning squat form'],
    video_url: 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
    gif_url: 'https://media.tenor.com/3C4FO64ERYUAAAAM/goblet-squat.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400'
  },
  {
    exercise_id: 'leg-10',
    name: 'Standing Calf Raise',
    category: 'Isolation',
    muscle_group: 'Legs',
    difficulty: 'Beginner',
    equipment: 'Calf Raise Machine or Smith Machine',
    sets: '4',
    reps: '15-20',
    instructions: 'Stand on the edge of a platform with only your toes on it. Lower your heels for a full stretch, then rise up onto your toes as high as possible. Squeeze at the top.',
    cues: ['Full stretch at bottom', 'Rise as high as possible', 'Pause at top', 'Control the descent', 'Dont bounce'],
    video_url: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
    gif_url: 'https://media.tenor.com/IpA5CfXu-QUAAAAM/calf-raise.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'leg-11',
    name: 'Hack Squat',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Intermediate',
    equipment: 'Hack Squat Machine',
    sets: '4',
    reps: '10-12',
    instructions: 'Position yourself in the hack squat machine with shoulders under the pads. Lower the weight by bending your knees until thighs are parallel. Push through your feet to stand.',
    cues: ['Feet shoulder-width on platform', 'Keep back flat on pad', 'Lower to parallel or below', 'Push through whole foot', 'Control the weight'],
    video_url: 'https://www.youtube.com/watch?v=0tn5K9NlCfo',
    gif_url: 'https://media.tenor.com/EzJhNxC1WJUAAAAM/hack-squat.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'leg-12',
    name: 'Sumo Deadlift',
    category: 'Compound',
    muscle_group: 'Legs',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    sets: '4',
    reps: '6-8',
    instructions: 'Stand with feet wide apart, toes pointing out. Grip the bar inside your legs. Push through your heels and drive your hips forward to stand. Keep the bar close to your body.',
    cues: ['Wide stance, toes out', 'Grip inside legs', 'Chest up, back straight', 'Drive through heels', 'Hips and shoulders rise together'],
    video_url: 'https://www.youtube.com/watch?v=lDt8HwxVST0',
    gif_url: 'https://media.tenor.com/FXFExaK6VwYAAAAM/sumo-deadlift.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },

  // ARMS - 12 exercises
  {
    exercise_id: 'arm-1',
    name: 'Barbell Curl',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Barbell',
    sets: '3',
    reps: '10-12',
    instructions: 'Stand holding a barbell with an underhand grip, arms extended. Curl the bar up by bending your elbows, keeping upper arms stationary. Squeeze biceps at the top and lower with control.',
    cues: ['Keep elbows pinned to sides', 'No swinging or momentum', 'Full contraction at top', 'Control the negative', 'Wrists stay neutral'],
    video_url: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    gif_url: 'https://media.tenor.com/RE3JW0jJhEQAAAAM/barbell-curl.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400'
  },
  {
    exercise_id: 'arm-2',
    name: 'Hammer Curl',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    sets: '3',
    reps: '10-12 each arm',
    instructions: 'Stand with dumbbells at your sides, palms facing each other (neutral grip). Curl the weights up keeping the neutral grip. Squeeze at the top and lower slowly.',
    cues: ['Neutral grip throughout', 'Targets brachialis and forearms', 'Elbows stay stationary', 'Can alternate or together', 'No swinging'],
    video_url: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    gif_url: 'https://media.tenor.com/B8S4M6g2XXYAAAAM/hammer-curl.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
  },
  {
    exercise_id: 'arm-3',
    name: 'Tricep Pushdown',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Cable Machine',
    sets: '3',
    reps: '12-15',
    instructions: 'Stand facing a cable machine with a straight bar or rope attachment. Pin your elbows to your sides and push the bar down until your arms are fully extended. Return with control.',
    cues: ['Elbows stay pinned', 'Full extension at bottom', 'Squeeze triceps hard', 'Dont lean forward excessively', 'Control the return'],
    video_url: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    gif_url: 'https://media.tenor.com/I1qs9mAPXdEAAAAM/tricep-pushdown.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'arm-4',
    name: 'Skull Crushers',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Intermediate',
    equipment: 'EZ Bar or Dumbbells, Bench',
    sets: '3',
    reps: '10-12',
    instructions: 'Lie on a bench holding a bar above your chest with arms extended. Lower the bar by bending your elbows, bringing it towards your forehead. Extend arms back up.',
    cues: ['Upper arms stay vertical', 'Lower to forehead or behind head', 'Elbows dont flare', 'Full extension at top', 'Control is key'],
    video_url: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    gif_url: 'https://media.tenor.com/YF_nIPbXssgAAAAM/skull-crusher.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
  },
  {
    exercise_id: 'arm-5',
    name: 'Preacher Curl',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Beginner',
    equipment: 'EZ Bar, Preacher Bench',
    sets: '3',
    reps: '10-12',
    instructions: 'Sit at a preacher bench with your upper arms resting on the pad. Curl the bar up, squeezing your biceps at the top. Lower with a slow, controlled motion.',
    cues: ['Arms fully on pad', 'Isolates biceps completely', 'Full stretch at bottom', 'Squeeze at top', 'Slow negative (3 seconds)'],
    video_url: 'https://www.youtube.com/watch?v=fIWP-FRFNU0',
    gif_url: 'https://media.tenor.com/RpvZZ8HNKSEAAAAM/preacher-curl.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400'
  },
  {
    exercise_id: 'arm-6',
    name: 'Close Grip Bench Press',
    category: 'Compound',
    muscle_group: 'Arms',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    sets: '4',
    reps: '8-10',
    instructions: 'Lie on a bench and grip the bar with hands shoulder-width apart or closer. Lower the bar to your lower chest, keeping elbows tucked. Press up focusing on triceps.',
    cues: ['Hands shoulder-width or closer', 'Elbows tucked to sides', 'Touch lower chest', 'Press with triceps focus', 'Great for tricep mass'],
    video_url: 'https://www.youtube.com/watch?v=nEF0bv2FW94',
    gif_url: 'https://media.tenor.com/OZ8HJnFQNRoAAAAM/close-grip-bench.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'arm-7',
    name: 'Concentration Curl',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Dumbbell',
    sets: '3',
    reps: '12 each arm',
    instructions: 'Sit on a bench with your elbow resting on your inner thigh. Curl the dumbbell up, keeping your upper arm stationary. Squeeze at the top and lower slowly.',
    cues: ['Elbow braced on inner thigh', 'Complete isolation', 'Full range of motion', 'No cheating possible', 'Great for peak contraction'],
    video_url: 'https://www.youtube.com/watch?v=Jvj2wV0vOYs',
    gif_url: 'https://media.tenor.com/nzqbOH1L2s0AAAAM/concentration-curl.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
  },
  {
    exercise_id: 'arm-8',
    name: 'Overhead Tricep Extension',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Dumbbell or Cable',
    sets: '3',
    reps: '12-15',
    instructions: 'Hold a dumbbell overhead with both hands. Lower it behind your head by bending your elbows. Extend your arms back up, squeezing your triceps.',
    cues: ['Elbows point forward', 'Full stretch at bottom', 'Lock out at top', 'Keep upper arms still', 'Targets long head of triceps'],
    video_url: 'https://www.youtube.com/watch?v=YbX7Wd8jQ-Q',
    gif_url: 'https://media.tenor.com/s_V9TnD5QAQAAAAM/overhead-tricep-extension.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'arm-9',
    name: 'Cable Curl',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Cable Machine',
    sets: '3',
    reps: '12-15',
    instructions: 'Stand facing a low cable with a bar or rope attachment. Curl the weight up, keeping elbows pinned. Squeeze biceps and lower with control.',
    cues: ['Constant tension throughout', 'No momentum', 'Elbows stay still', 'Squeeze at peak', 'Great finisher exercise'],
    video_url: 'https://www.youtube.com/watch?v=NFzTWp2qpiE',
    gif_url: 'https://media.tenor.com/RbMQNPZKMGQAAAAM/cable-curl.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
  },
  {
    exercise_id: 'arm-10',
    name: 'Diamond Push Ups',
    category: 'Compound',
    muscle_group: 'Arms',
    difficulty: 'Intermediate',
    equipment: 'Bodyweight',
    sets: '3',
    reps: '12-15',
    instructions: 'Get into a push-up position with your hands together, forming a diamond shape with your thumbs and index fingers. Lower your chest to your hands and push back up.',
    cues: ['Hands form diamond shape', 'Elbows close to body', 'Chest to hands', 'Great tricep builder', 'Easier with knees down'],
    video_url: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    gif_url: 'https://media.tenor.com/aNNJ0j_9xvUAAAAM/diamond-pushup.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1598971639058-999e0b7c2e79?w=400'
  },
  {
    exercise_id: 'arm-11',
    name: 'Wrist Curls',
    category: 'Isolation',
    muscle_group: 'Arms',
    difficulty: 'Beginner',
    equipment: 'Barbell or Dumbbells',
    sets: '3',
    reps: '15-20',
    instructions: 'Sit with your forearms resting on your thighs, wrists hanging over your knees. Curl the weight up by flexing your wrists. Lower with control.',
    cues: ['Forearms stay on thighs', 'Only wrists move', 'Full range of motion', 'Builds grip strength', 'Can do palms up or down'],
    video_url: 'https://www.youtube.com/watch?v=7ac-Jd7vBq4',
    gif_url: 'https://media.tenor.com/WB6UdnGX1RkAAAAM/wrist-curl.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'arm-12',
    name: 'Tricep Dips',
    category: 'Compound',
    muscle_group: 'Arms',
    difficulty: 'Intermediate',
    equipment: 'Dip Station or Bench',
    sets: '3',
    reps: '10-15',
    instructions: 'Support yourself on parallel bars or a bench. Lower your body by bending your elbows to 90 degrees. Push back up to the starting position.',
    cues: ['Stay upright for triceps', 'Lean forward for chest', 'Elbows to 90 degrees', 'Full lockout at top', 'Add weight when easy'],
    video_url: 'https://www.youtube.com/watch?v=6kALZikXxLc',
    gif_url: 'https://media.tenor.com/qzIpJz-O9AEAAAAM/dips-workout.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1598971639058-999e0b7c2e79?w=400'
  },

  // CARDIO - 10 exercises
  {
    exercise_id: 'cardio-1',
    name: 'Jumping Jacks',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '3',
    reps: '30 seconds',
    instructions: 'Start with feet together and arms at sides. Jump feet apart while raising arms overhead. Jump back to starting position. Maintain a steady rhythm.',
    cues: ['Land softly on balls of feet', 'Arms go fully overhead', 'Keep core engaged', 'Breathe rhythmically', 'Great warmup exercise'],
    video_url: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    gif_url: 'https://media.tenor.com/Q6rRGWuBfpMAAAAM/jumping-jacks.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },
  {
    exercise_id: 'cardio-2',
    name: 'Burpees',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Advanced',
    equipment: 'None',
    sets: '3',
    reps: '10-15',
    instructions: 'Start standing. Drop into a squat, place hands on floor, jump feet back to plank, do a push-up, jump feet to hands, then explosively jump up with arms overhead.',
    cues: ['Full push-up at bottom', 'Explosive jump at top', 'Land softly', 'Keep moving', 'Full body exercise'],
    video_url: 'https://www.youtube.com/watch?v=dZgVxmf6jkA',
    gif_url: 'https://media.tenor.com/9HpgLsMnRxEAAAAM/burpee.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400'
  },
  {
    exercise_id: 'cardio-3',
    name: 'Mountain Climbers',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Intermediate',
    equipment: 'None',
    sets: '3',
    reps: '30 seconds',
    instructions: 'Start in a plank position. Drive one knee toward your chest, then quickly switch legs in a running motion while keeping your upper body stable.',
    cues: ['Hips stay level', 'Core stays tight', 'Drive knees to chest', 'Keep pace steady', 'Great for core and cardio'],
    video_url: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    gif_url: 'https://media.tenor.com/LciB9h6ik_4AAAAM/mountain-climbers.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'cardio-4',
    name: 'High Knees',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '3',
    reps: '30 seconds',
    instructions: 'Run in place while driving your knees up to hip height. Pump your arms in opposition to your legs. Keep a fast pace.',
    cues: ['Knees to hip height', 'Stay on balls of feet', 'Pump arms fast', 'Core engaged', 'Great warmup or HIIT'],
    video_url: 'https://www.youtube.com/watch?v=D4Ocfxsj4kQ',
    gif_url: 'https://media.tenor.com/Nh9fQNOLNO0AAAAM/high-knees.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },
  {
    exercise_id: 'cardio-5',
    name: 'Box Jumps',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Intermediate',
    equipment: 'Plyo Box',
    sets: '3',
    reps: '10-12',
    instructions: 'Stand facing a box. Bend your knees and swing your arms back, then explosively jump onto the box, landing softly with both feet. Step down and repeat.',
    cues: ['Use arm swing for power', 'Land softly, absorb impact', 'Stand fully on box', 'Step down, dont jump', 'Start with lower box'],
    video_url: 'https://www.youtube.com/watch?v=52r_Ul5k03g',
    gif_url: 'https://media.tenor.com/1MoQ3MLGNk0AAAAM/box-jump.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400'
  },
  {
    exercise_id: 'cardio-6',
    name: 'Jump Squats',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Intermediate',
    equipment: 'None',
    sets: '3',
    reps: '15-20',
    instructions: 'Start in a squat position. Explosively jump as high as you can, reaching arms overhead. Land softly back into the squat position and immediately repeat.',
    cues: ['Deep squat at bottom', 'Explosive jump up', 'Soft landing', 'Arms help propel you', 'Great for power'],
    video_url: 'https://www.youtube.com/watch?v=Azl5tkCzDcc',
    gif_url: 'https://media.tenor.com/lZP_oIvOJmgAAAAM/jump-squat.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'cardio-7',
    name: 'Jump Rope',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Beginner',
    equipment: 'Jump Rope',
    sets: '5',
    reps: '1 minute',
    instructions: 'Hold the rope handles at your sides. Swing the rope overhead and jump over it with both feet. Keep a steady rhythm and stay on the balls of your feet.',
    cues: ['Wrists turn the rope', 'Small jumps, not high', 'Stay on toes', 'Keep rhythm steady', 'Great for coordination'],
    video_url: 'https://www.youtube.com/watch?v=u3zgHI8QnqE',
    gif_url: 'https://media.tenor.com/F4MKT4V0kVEAAAAM/jump-rope.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },
  {
    exercise_id: 'cardio-8',
    name: 'Treadmill Sprints',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Intermediate',
    equipment: 'Treadmill',
    sets: '8-10',
    reps: '20 seconds sprint, 40 seconds rest',
    instructions: 'Set treadmill to a challenging speed. Sprint for 20-30 seconds at maximum effort. Step to the sides to rest for 40-60 seconds. Repeat.',
    cues: ['Gradual warmup first', 'Maximum effort on sprints', 'Complete rest between', 'Hold handrails if needed', 'Great for fat loss'],
    video_url: 'https://www.youtube.com/watch?v=BkS1-El_WlE',
    gif_url: 'https://media.tenor.com/YC9Q8rZ7VVEAAAAM/treadmill.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },
  {
    exercise_id: 'cardio-9',
    name: 'Battle Ropes',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Intermediate',
    equipment: 'Battle Ropes',
    sets: '4',
    reps: '30 seconds',
    instructions: 'Hold one end of the rope in each hand. Create waves by alternating arm movements up and down. Maintain a slight squat position.',
    cues: ['Slight squat stance', 'Alternate arms for waves', 'Keep core tight', 'Can do slams or circles too', 'Full body cardio'],
    video_url: 'https://www.youtube.com/watch?v=ts9OHTy2vRY',
    gif_url: 'https://media.tenor.com/ZDLq9TsB2u8AAAAM/battle-ropes.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'cardio-10',
    name: 'Rowing Machine',
    category: 'Cardio',
    muscle_group: 'Cardio',
    difficulty: 'Beginner',
    equipment: 'Rowing Machine',
    sets: '1',
    reps: '10-20 minutes',
    instructions: 'Sit on the rower with feet strapped in. Push with legs first, then lean back and pull the handle to your lower chest. Return in reverse order.',
    cues: ['Legs-back-arms sequence', 'Drive with legs first', 'Pull to lower chest', 'Control the return', 'Low impact, full body'],
    video_url: 'https://www.youtube.com/watch?v=zQ82RYIFLN8',
    gif_url: 'https://media.tenor.com/rGSMCwRfWegAAAAM/rowing.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },

  // STRETCHING - 10 exercises
  {
    exercise_id: 'stretch-1',
    name: 'Standing Hamstring Stretch',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '2',
    reps: '30 seconds each leg',
    instructions: 'Stand and place one heel on an elevated surface. Keep that leg straight and hinge forward at the hips until you feel a stretch in the back of your thigh. Hold and breathe.',
    cues: ['Keep back straight', 'Hinge at hips', 'Feel stretch in hamstring', 'Dont bounce', 'Breathe deeply'],
    video_url: 'https://www.youtube.com/watch?v=ZvBLkNhIeRo',
    gif_url: 'https://media.tenor.com/RxKlHXRNfToAAAAM/hamstring-stretch.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'stretch-2',
    name: 'Hip Flexor Stretch',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '2',
    reps: '30 seconds each side',
    instructions: 'Kneel on one knee with the other foot in front. Push your hips forward while keeping your torso upright. Feel the stretch in the front of your back hip.',
    cues: ['Back knee on ground', 'Push hips forward', 'Squeeze back glute', 'Torso stays upright', 'Great for desk workers'],
    video_url: 'https://www.youtube.com/watch?v=UGEpQ1BRx-4',
    gif_url: 'https://media.tenor.com/8qVLEz6WkLEAAAAM/hip-flexor-stretch.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },
  {
    exercise_id: 'stretch-3',
    name: 'Child Pose',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '2',
    reps: '60 seconds',
    instructions: 'Kneel on the floor with toes together and knees apart. Sit back on your heels and reach your arms forward on the ground. Rest your forehead on the floor and breathe deeply.',
    cues: ['Knees wide, toes together', 'Sit back on heels', 'Arms extended forward', 'Relax completely', 'Great for back and hips'],
    video_url: 'https://www.youtube.com/watch?v=eqVMAPM00DM',
    gif_url: 'https://media.tenor.com/6PaWEG6qOEoAAAAM/childs-pose.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },
  {
    exercise_id: 'stretch-4',
    name: 'Pigeon Pose',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Intermediate',
    equipment: 'None',
    sets: '2',
    reps: '60 seconds each side',
    instructions: 'From a plank position, bring one knee forward behind your wrist. Extend the other leg straight behind you. Lower your hips and fold forward over your front leg.',
    cues: ['Front shin angled', 'Hips square to floor', 'Fold forward for deeper stretch', 'Amazing hip opener', 'Use pillow under hip if needed'],
    video_url: 'https://www.youtube.com/watch?v=UKwkChzThig',
    gif_url: 'https://media.tenor.com/u3Bd7ZOMN_cAAAAM/pigeon-pose.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },
  {
    exercise_id: 'stretch-5',
    name: 'Cat-Cow Stretch',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '2',
    reps: '10 cycles',
    instructions: 'Start on hands and knees. Arch your back, dropping your belly and lifting your head (cow). Then round your back, tucking chin and tailbone (cat). Flow between positions.',
    cues: ['Inhale for cow', 'Exhale for cat', 'Move with breath', 'Great spine mobility', 'Warm up exercise'],
    video_url: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
    gif_url: 'https://media.tenor.com/p3vJnAHMbgkAAAAM/cat-cow.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },
  {
    exercise_id: 'stretch-6',
    name: 'Chest Doorway Stretch',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'Doorway',
    sets: '2',
    reps: '30 seconds each side',
    instructions: 'Stand in a doorway with your forearm on the door frame at shoulder height. Step forward with one foot until you feel a stretch across your chest and shoulder.',
    cues: ['Elbow at 90 degrees', 'Step through doorway', 'Feel stretch in chest', 'Great for posture', 'Essential for desk workers'],
    video_url: 'https://www.youtube.com/watch?v=SxQfVLuhHfM',
    gif_url: 'https://media.tenor.com/WCfP0TA_MTUAAAAM/doorway-stretch.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'stretch-7',
    name: 'Quad Stretch',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '2',
    reps: '30 seconds each leg',
    instructions: 'Stand on one leg. Bend the other knee and grab your ankle behind you. Pull your heel toward your glute while pushing your hip forward. Keep knees together.',
    cues: ['Stand tall', 'Knees together', 'Push hip forward', 'Use wall for balance', 'Feel front of thigh stretch'],
    video_url: 'https://www.youtube.com/watch?v=YjrwCy-9YEw',
    gif_url: 'https://media.tenor.com/Lqx7s5V_b3MAAAAM/quad-stretch.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },
  {
    exercise_id: 'stretch-8',
    name: 'Seated Spinal Twist',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '2',
    reps: '30 seconds each side',
    instructions: 'Sit with legs extended. Bend one knee and place that foot outside the other leg. Twist toward the bent knee, using your opposite elbow against your knee for leverage.',
    cues: ['Sit tall first', 'Twist from mid-back', 'Use elbow against knee', 'Look over back shoulder', 'Breathe into the twist'],
    video_url: 'https://www.youtube.com/watch?v=6xqrMIE-6Bo',
    gif_url: 'https://media.tenor.com/C2M3sVv6cqIAAAAM/spinal-twist.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },
  {
    exercise_id: 'stretch-9',
    name: 'Shoulder Cross-Body Stretch',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '2',
    reps: '30 seconds each arm',
    instructions: 'Bring one arm across your body at chest height. Use the other hand to press above the elbow, pulling the arm closer to your chest. Feel the stretch in your rear shoulder.',
    cues: ['Arm stays straight', 'Press above elbow', 'Dont shrug shoulder', 'Feel rear delt stretch', 'Great for shoulder health'],
    video_url: 'https://www.youtube.com/watch?v=C3E0sxnEd-U',
    gif_url: 'https://media.tenor.com/XF0uJD4Xm-4AAAAM/shoulder-stretch.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    exercise_id: 'stretch-10',
    name: 'Downward Dog',
    category: 'Flexibility',
    muscle_group: 'Stretching',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '2',
    reps: '45 seconds',
    instructions: 'Start on hands and knees. Tuck toes and lift hips up and back, forming an inverted V shape. Press heels toward the floor and push chest toward thighs.',
    cues: ['Hands shoulder-width apart', 'Feet hip-width apart', 'Push hips up and back', 'Heels reach toward floor', 'Full body stretch'],
    video_url: 'https://www.youtube.com/watch?v=ayPJ54-73gU',
    gif_url: 'https://media.tenor.com/8PKGFa9yoGoAAAAM/downward-dog.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },

  // CHEST - 4 exercises
  {
    exercise_id: 'chest-1',
    name: 'Barbell Bench Press',
    category: 'Compound',
    muscle_group: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    sets: '4',
    reps: '8-10',
    instructions: 'Lie on the bench with your eyes under the bar. Grip the bar slightly wider than shoulder-width. Unrack and lower the bar to your mid-chest. Press back up to the starting position.',
    cues: ['Feet planted firmly', 'Slight arch in back', 'Bar to mid-chest', 'Drive up explosively', 'Keep shoulder blades retracted'],
    video_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    gif_url: 'https://media.tenor.com/hVxqkkLY6AQAAAAM/bench-press.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'chest-2',
    name: 'Incline Dumbbell Press',
    category: 'Compound',
    muscle_group: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells, Incline Bench',
    sets: '3',
    reps: '10-12',
    instructions: 'Set bench to 30-45 degrees. Press dumbbells up from shoulder level. Lower to outer chest with control. Press back up.',
    cues: ['30-45 degree angle', 'Targets upper chest', 'Full stretch at bottom', 'Press up and together', 'Control the weight'],
    video_url: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    gif_url: 'https://media.tenor.com/OXYG2NfN3XIAAAAM/incline-press.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
  },
  {
    exercise_id: 'chest-3',
    name: 'Cable Flyes',
    category: 'Isolation',
    muscle_group: 'Chest',
    difficulty: 'Beginner',
    equipment: 'Cable Machine',
    sets: '3',
    reps: '12-15',
    instructions: 'Stand between cable pulleys set at chest height. Bring handles together in front of your chest in a hugging motion. Return with control.',
    cues: ['Slight bend in elbows', 'Squeeze chest at center', 'Control the negative', 'Constant tension', 'Great finisher'],
    video_url: 'https://www.youtube.com/watch?v=Iwe6AmxVf7o',
    gif_url: 'https://media.tenor.com/gK6F-pQGNKoAAAAM/cable-fly.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'chest-4',
    name: 'Push Ups',
    category: 'Compound',
    muscle_group: 'Chest',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '3',
    reps: '15-20',
    instructions: 'Start in a plank position with hands slightly wider than shoulders. Lower your body until chest nearly touches the floor. Push back up to starting position.',
    cues: ['Core stays tight', 'Elbows at 45 degrees', 'Full range of motion', 'Dont let hips sag', 'Scaleable for all levels'],
    video_url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    gif_url: 'https://media.tenor.com/6Zz77sv8GAsAAAAM/push-up.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1598971639058-999e0b7c2e79?w=400'
  },

  // BACK - 4 exercises
  {
    exercise_id: 'back-1',
    name: 'Lat Pulldown',
    category: 'Compound',
    muscle_group: 'Back',
    difficulty: 'Beginner',
    equipment: 'Cable Machine',
    sets: '4',
    reps: '10-12',
    instructions: 'Grip the bar slightly wider than shoulder-width. Pull the bar down to your upper chest while leaning back slightly. Squeeze your lats and return with control.',
    cues: ['Grip wider than shoulders', 'Pull to upper chest', 'Squeeze lats at bottom', 'Lean back slightly', 'Control the ascent'],
    video_url: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    gif_url: 'https://media.tenor.com/TP9d0DVUEYEAAAAM/lat-pulldown.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'back-2',
    name: 'Barbell Row',
    category: 'Compound',
    muscle_group: 'Back',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    sets: '4',
    reps: '8-10',
    instructions: 'Hinge forward at the hips with slight knee bend. Pull the bar to your lower chest, squeezing your shoulder blades together. Lower with control.',
    cues: ['Back stays flat', 'Pull to lower chest', 'Squeeze shoulder blades', 'Control the eccentric', 'Dont use momentum'],
    video_url: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
    gif_url: 'https://media.tenor.com/j0m6vpNRq5wAAAAM/barbell-row.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  },
  {
    exercise_id: 'back-3',
    name: 'Seated Cable Row',
    category: 'Compound',
    muscle_group: 'Back',
    difficulty: 'Beginner',
    equipment: 'Cable Machine',
    sets: '3',
    reps: '12-15',
    instructions: 'Sit at the cable row machine with feet on the platform. Pull the handle to your lower abdomen, squeezing your back. Return with control.',
    cues: ['Sit upright', 'Pull to belly button', 'Squeeze at contraction', 'Shoulders down and back', 'Great for mid-back'],
    video_url: 'https://www.youtube.com/watch?v=GZbfZ033f74',
    gif_url: 'https://media.tenor.com/Nkx1e5K8H60AAAAM/cable-row.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'back-4',
    name: 'Pull Ups',
    category: 'Compound',
    muscle_group: 'Back',
    difficulty: 'Intermediate',
    equipment: 'Pull Up Bar',
    sets: '3',
    reps: '6-10',
    instructions: 'Hang from a bar with palms facing away. Pull yourself up until your chin is over the bar. Lower with control to full extension.',
    cues: ['Start from dead hang', 'Pull chin over bar', 'Engage lats', 'Control the descent', 'Use assistance if needed'],
    video_url: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    gif_url: 'https://media.tenor.com/CVD_7OBY9cEAAAAM/pullup.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1598971639058-999e0b7c2e79?w=400'
  },

  // SHOULDERS - 4 exercises
  {
    exercise_id: 'shoulder-1',
    name: 'Overhead Press',
    category: 'Compound',
    muscle_group: 'Shoulders',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    sets: '4',
    reps: '8-10',
    instructions: 'Start with the bar at shoulder level. Press straight up overhead until arms are fully extended. Lower back to shoulders with control.',
    cues: ['Core braced tight', 'Press straight up', 'Full lockout at top', 'Head through at top', 'Dont lean back'],
    video_url: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    gif_url: 'https://media.tenor.com/xY7TsV8r5aIAAAAM/overhead-press.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400'
  },
  {
    exercise_id: 'shoulder-2',
    name: 'Lateral Raises',
    category: 'Isolation',
    muscle_group: 'Shoulders',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    sets: '3',
    reps: '12-15',
    instructions: 'Stand with dumbbells at your sides. Raise arms out to the sides until shoulder height. Lower with control.',
    cues: ['Lead with elbows', 'Slight bend in elbows', 'Raise to shoulder height', 'Control the descent', 'Builds side delts'],
    video_url: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    gif_url: 'https://media.tenor.com/1H0K9A2xqxsAAAAM/lateral-raise.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
  },
  {
    exercise_id: 'shoulder-3',
    name: 'Face Pulls',
    category: 'Isolation',
    muscle_group: 'Shoulders',
    difficulty: 'Beginner',
    equipment: 'Cable Machine, Rope',
    sets: '3',
    reps: '15-20',
    instructions: 'Set cable at face height. Pull the rope to your face, separating the ends and externally rotating at the end. Squeeze rear delts.',
    cues: ['Pull to face level', 'Separate rope ends', 'External rotate at end', 'Squeeze rear delts', 'Great for shoulder health'],
    video_url: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    gif_url: 'https://media.tenor.com/uMXP4Xl0s4MAAAAM/face-pulls.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'shoulder-4',
    name: 'Arnold Press',
    category: 'Compound',
    muscle_group: 'Shoulders',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells',
    sets: '3',
    reps: '10-12',
    instructions: 'Start with dumbbells at shoulders, palms facing you. As you press up, rotate your palms to face forward at the top. Reverse on the way down.',
    cues: ['Start palms facing in', 'Rotate as you press', 'Full lockout at top', 'Hits all delt heads', 'Created by Arnold himself'],
    video_url: 'https://www.youtube.com/watch?v=6Z15_WdXmVw',
    gif_url: 'https://media.tenor.com/5rT7SFM7pIQAAAAM/arnold-press.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
  },

  // ABS - 4 exercises
  {
    exercise_id: 'abs-1',
    name: 'Plank',
    category: 'Core',
    muscle_group: 'Abs',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '3',
    reps: '30-60 seconds',
    instructions: 'Support your body on your forearms and toes, keeping your body in a straight line from head to heels. Engage your core and hold.',
    cues: ['Elbows under shoulders', 'Body straight line', 'Core tight', 'Dont let hips sag', 'Breathe steadily'],
    video_url: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    gif_url: 'https://media.tenor.com/0f5V9g9pv1oAAAAM/plank.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400'
  },
  {
    exercise_id: 'abs-2',
    name: 'Hanging Leg Raise',
    category: 'Core',
    muscle_group: 'Abs',
    difficulty: 'Intermediate',
    equipment: 'Pull Up Bar',
    sets: '3',
    reps: '10-15',
    instructions: 'Hang from a bar with arms extended. Raise your legs until they are parallel to the floor or higher. Lower with control.',
    cues: ['Dead hang start', 'Raise legs to parallel', 'Control the descent', 'Dont swing', 'Bend knees if needed'],
    video_url: 'https://www.youtube.com/watch?v=hdng3Nm1x_E',
    gif_url: 'https://media.tenor.com/APPd3xIYxUYAAAAM/leg-raise.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1598971639058-999e0b7c2e79?w=400'
  },
  {
    exercise_id: 'abs-3',
    name: 'Cable Crunch',
    category: 'Core',
    muscle_group: 'Abs',
    difficulty: 'Beginner',
    equipment: 'Cable Machine',
    sets: '3',
    reps: '15-20',
    instructions: 'Kneel facing a cable machine with a rope attachment. Hold the rope behind your head. Crunch down, bringing your elbows toward your knees.',
    cues: ['Hips stay still', 'Crunch with abs, not arms', 'Exhale on crunch', 'Control the return', 'Great for adding resistance'],
    video_url: 'https://www.youtube.com/watch?v=2fbujeH3F0E',
    gif_url: 'https://media.tenor.com/NJwAr7eSDzIAAAAM/cable-crunch.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
  },
  {
    exercise_id: 'abs-4',
    name: 'Dead Bug',
    category: 'Core',
    muscle_group: 'Abs',
    difficulty: 'Beginner',
    equipment: 'None',
    sets: '3',
    reps: '10 each side',
    instructions: 'Lie on your back with arms extended toward ceiling and knees bent at 90 degrees. Lower opposite arm and leg toward the floor while keeping your back flat. Return and switch sides.',
    cues: ['Back stays flat on floor', 'Move opposite arm and leg', 'Slow and controlled', 'Great for core stability', 'Breathe throughout'],
    video_url: 'https://www.youtube.com/watch?v=I5xbsA71v1A',
    gif_url: 'https://media.tenor.com/Y9QZ1_QxXLcAAAAM/dead-bug.gif',
    thumbnail_url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400'
  }
];

export default function WorkoutsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [workouts, setWorkouts] = useState<GlobalWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Legs', 'Arms', 'Cardio', 'Stretching', 'Chest', 'Back', 'Shoulders', 'Abs'];

  useEffect(() => {
    async function fetchWorkouts() {
      setLoading(true);
      try {
        const data = await getGlobalWorkouts();
        if (data && data.length > 0) {
          setWorkouts(data);
        } else {
          setWorkouts(fallbackExercises);
        }
      } catch (error) {
        console.error('Failed to fetch workouts, using fallback:', error);
        setWorkouts(fallbackExercises);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkouts();
  }, []);

  const filteredExercises = workouts.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || 
      ex.muscle_group?.toLowerCase() === selectedFilter.toLowerCase() ||
      ex.category?.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">WORKOUT <span className="text-accent">REPOSITORY</span></h1>
            <p className="text-muted-foreground">Access the complete library of elite exercises.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search exercises..." 
                className="pl-9 bg-black/20 border-white/10 text-white focus:border-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                selectedFilter === filter 
                  ? "bg-accent/10 border-accent text-accent shadow-[0_0_10px_rgba(0,243,255,0.2)]" 
                  : "bg-black/20 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading workouts...</span>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No exercises found. Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((ex) => (
              <Dialog key={ex.exercise_id}>
                <DialogTrigger asChild>
                  <Card className="group bg-card/40 backdrop-blur-sm border-white/5 hover:border-accent/50 transition-all overflow-hidden flex flex-col cursor-pointer">
                    <div className="h-48 bg-black/50 relative flex items-center justify-center overflow-hidden">
                      {ex.thumbnail_url ? (
                        <img src={ex.thumbnail_url} alt={ex.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : ex.gif_url ? (
                        <img src={ex.gif_url} alt={ex.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                      <PlayCircle className="absolute w-12 h-12 text-white/50 group-hover:text-accent group-hover:scale-110 transition-all z-20" />
                      <div className="absolute bottom-3 left-3 z-20">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-accent text-black px-2 py-1 rounded">
                          {ex.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{ex.name}</h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ex.instructions}</p>
                      
                      <div className="mt-auto space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded border border-white/5">{ex.muscle_group}</span>
                          <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded border border-white/5">{ex.equipment}</span>
                          {ex.category && (
                            <span className="text-xs text-accent/80 bg-accent/10 px-2 py-1 rounded border border-accent/20">{ex.category}</span>
                          )}
                        </div>
                        
                        <Button className="w-full bg-white/5 hover:bg-accent hover:text-black border border-white/10 text-white transition-colors">
                          VIEW DETAILS
                        </Button>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-display font-bold text-white">{ex.name}</DialogTitle>
                    <DialogDescription className="text-accent">{ex.muscle_group} • {ex.difficulty}</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-6 py-4">
                    <div className="aspect-video bg-black rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden group">
                      {ex.gif_url ? (
                        <img src={ex.gif_url} alt={ex.name} className="w-full h-full object-contain" />
                      ) : (
                        <PlayCircle className="w-16 h-16 text-white/30" />
                      )}
                      {ex.video_url && (
                        <a href={ex.video_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button className="bg-red-600 hover:bg-red-700 text-white">
                            <Video className="w-4 h-4 mr-2" /> WATCH ON YOUTUBE
                          </Button>
                        </a>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">Instructions</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{ex.instructions}</p>
                        </div>
                        {ex.cues && ex.cues.length > 0 && (
                          <div>
                            <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">Coaching Cues</h4>
                            <ul className="space-y-1">
                              {ex.cues.map((cue, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {cue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">Details</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-white/5 rounded">
                              <p className="text-xs text-muted-foreground">Equipment</p>
                              <p className="font-bold">{ex.equipment}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded">
                              <p className="text-xs text-muted-foreground">Category</p>
                              <p className="font-bold">{ex.category || 'General'}</p>
                            </div>
                            {ex.sets && (
                              <div className="p-3 bg-white/5 rounded">
                                <p className="text-xs text-muted-foreground">Sets</p>
                                <p className="font-bold">{ex.sets}</p>
                              </div>
                            )}
                            {ex.reps && (
                              <div className="p-3 bg-white/5 rounded">
                                <p className="text-xs text-muted-foreground">Reps</p>
                                <p className="font-bold">{ex.reps}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
