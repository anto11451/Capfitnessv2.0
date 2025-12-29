import { Exercise, WorkoutPlan, Recipe, UserProfile, StreakData, AdminData, DailyLog } from "./types";

export const exercises: Exercise[] = [
  // CHEST - 15 exercises
  {
    id: "c1",
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell, Bench",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    cues: ["Keep feet planted", "Arch back slightly", "Lower bar to mid-chest", "Drive up explosively"],
    instructions: "Lie on the bench with your eyes under the bar. Grip the bar slightly wider than shoulder-width. Unrack and lower the bar to your mid-chest. Press back up to the starting position.",
    secondaryMuscles: ["Triceps", "Front Delts"]
  },
  {
    id: "c2",
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbells, Incline Bench",
    videoUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
    cues: ["Set bench to 30-45 degrees", "Keep elbows at 45 degrees", "Full stretch at bottom"],
    instructions: "Sit on an incline bench with a dumbbell in each hand. Press the weights up until your arms are extended. Lower them back down with control.",
    secondaryMuscles: ["Front Delts", "Triceps"]
  },
  {
    id: "c3",
    name: "Cable Flyes",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=Iwe6AmxVf7o",
    cues: ["Slight bend in elbows", "Squeeze chest at peak", "Control the negative"],
    instructions: "Stand in the middle of a cable machine. Pull the handles together in front of your chest, squeezing the pecs. Return slowly.",
    secondaryMuscles: ["Front Delts"]
  },
  {
    id: "c4",
    name: "Push Ups",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    cues: ["Core tight", "Elbows tucked", "Chest to floor"],
    instructions: "Start in a high plank position. Lower your body until your chest nearly touches the floor. Push back up.",
    secondaryMuscles: ["Triceps", "Core"]
  },
  {
    id: "c5",
    name: "Dips (Chest Focus)",
    muscleGroup: "Chest",
    difficulty: "Advanced",
    equipment: "Dip Station",
    videoUrl: "https://www.youtube.com/watch?v=2z8JmcrW-As",
    cues: ["Lean forward for chest", "Go to 90 degrees", "Don't flare elbows"],
    instructions: "Support yourself on parallel bars. Lower your body by bending your arms while leaning forward. Push back up.",
    secondaryMuscles: ["Triceps", "Front Delts"]
  },
  {
    id: "c6",
    name: "Decline Dumbbell Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbells, Decline Bench",
    videoUrl: "https://www.youtube.com/watch?v=LfyQBUKR8SE",
    cues: ["Secure feet", "Lower to lower chest", "Full range of motion"],
    instructions: "Lie on a decline bench with dumbbells. Press up and lower to the sides of your lower chest.",
    secondaryMuscles: ["Triceps", "Front Delts"]
  },
  {
    id: "c7",
    name: "Dumbbell Flyes",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Dumbbells, Flat Bench",
    videoUrl: "https://www.youtube.com/watch?v=eozdVDA78K0",
    cues: ["Slight elbow bend", "Feel the stretch", "Squeeze at top"],
    instructions: "Lie flat with dumbbells above chest. Open arms wide in an arc, feeling the chest stretch. Bring back together.",
    secondaryMuscles: ["Front Delts"]
  },
  {
    id: "c8",
    name: "Close Grip Bench Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell, Bench",
    videoUrl: "https://www.youtube.com/watch?v=nEF0bv2FW94",
    cues: ["Hands shoulder-width", "Elbows close", "Touch lower chest"],
    instructions: "Grip the barbell with hands shoulder-width apart. Lower to lower chest, keeping elbows tucked.",
    secondaryMuscles: ["Triceps"]
  },
  {
    id: "c9",
    name: "Incline Cable Flyes",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Cable Machine, Incline Bench",
    videoUrl: "https://www.youtube.com/watch?v=Ib5rM0VY5Y0",
    cues: ["Set cables low", "Arc motion", "Peak contraction"],
    instructions: "Set an incline bench between cables. Perform fly motion bringing handles together above chest.",
    secondaryMuscles: ["Front Delts"]
  },
  {
    id: "c10",
    name: "Landmine Press",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell, Landmine",
    videoUrl: "https://www.youtube.com/watch?v=yzRYOZ9_2UU",
    cues: ["Staggered stance", "Press at angle", "Control descent"],
    instructions: "Hold the end of a barbell in a landmine. Press forward and up in a smooth arc.",
    secondaryMuscles: ["Shoulders", "Triceps"]
  },
  {
    id: "c11",
    name: "Machine Chest Press",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Chest Press Machine",
    videoUrl: "https://www.youtube.com/watch?v=xUm0BiZCWlQ",
    cues: ["Adjust seat height", "Full range", "Control tempo"],
    instructions: "Sit in machine with handles at chest level. Push forward until arms extend, then return slowly.",
    secondaryMuscles: ["Triceps", "Front Delts"]
  },
  {
    id: "c12",
    name: "Svend Press",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Weight Plate",
    videoUrl: "https://www.youtube.com/watch?v=c0xk-rNcNQU",
    cues: ["Squeeze plates together", "Push straight out", "Constant tension"],
    instructions: "Hold plates pressed together at chest. Push out while squeezing, then return.",
    secondaryMuscles: ["Front Delts"]
  },
  {
    id: "c13",
    name: "Diamond Push Ups",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=J0DnG1_S92I",
    cues: ["Hands form diamond", "Core tight", "Chest to hands"],
    instructions: "Form a diamond shape with hands under chest. Lower chest to hands and push back up.",
    secondaryMuscles: ["Triceps", "Core"]
  },
  {
    id: "c14",
    name: "Pec Deck Machine",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Pec Deck Machine",
    videoUrl: "https://www.youtube.com/watch?v=Z57CtFmRMxA",
    cues: ["Elbows at 90", "Squeeze together", "Control return"],
    instructions: "Sit with arms on pads. Bring pads together in front, squeezing chest. Return slowly.",
    secondaryMuscles: ["Front Delts"]
  },
  {
    id: "c15",
    name: "Archer Push Ups",
    muscleGroup: "Chest",
    difficulty: "Advanced",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=LcKW9FGbO5c",
    cues: ["Wide hand position", "Shift weight to one side", "Alternate sides"],
    instructions: "Start in wide push up position. Lower to one side while extending opposite arm. Push back and switch.",
    secondaryMuscles: ["Triceps", "Core", "Shoulders"]
  },

  // BACK - 15 exercises
  {
    id: "b1",
    name: "Pull Up",
    muscleGroup: "Back",
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    cues: ["Engage lats", "Chest to bar", "Control the descent"],
    instructions: "Grab the bar with an overhand grip. Pull yourself up until your chin is over the bar. Lower back down fully.",
    secondaryMuscles: ["Biceps", "Forearms"]
  },
  {
    id: "b2",
    name: "Barbell Row",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=9efgcGunQ1o",
    cues: ["Hinge at hips", "Keep back straight", "Pull to lower chest"],
    instructions: "Bend over at the hips, keeping your back flat. Pull the barbell towards your lower chest/upper stomach. Lower it back down.",
    secondaryMuscles: ["Biceps", "Rear Delts"]
  },
  {
    id: "b3",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    cues: ["Lean back slightly", "Pull elbows down", "Squeeze lats"],
    instructions: "Sit at the lat pulldown machine. Grab the bar wide. Pull the bar down to your upper chest. Return slowly.",
    secondaryMuscles: ["Biceps"]
  },
  {
    id: "b4",
    name: "Single Arm Dumbbell Row",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Dumbbell, Bench",
    videoUrl: "https://www.youtube.com/watch?v=dFzUj75WD9k",
    cues: ["Keep back flat", "Pull towards hip", "Don't rotate torso"],
    instructions: "Place one knee and hand on a bench. Row the dumbbell up towards your hip with the free hand.",
    secondaryMuscles: ["Biceps", "Forearms"]
  },
  {
    id: "b5",
    name: "Face Pulls",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Cable Machine, Rope",
    videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
    cues: ["Pull to forehead", "External rotation", "Squeeze rear delts"],
    instructions: "Set a cable pulley to face height. Pull the rope towards your face, separating your hands.",
    secondaryMuscles: ["Rear Delts", "Rotator Cuff"]
  },
  {
    id: "b6",
    name: "Deadlift",
    muscleGroup: "Back",
    difficulty: "Advanced",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    cues: ["Hip hinge", "Bar close to body", "Drive through heels"],
    instructions: "Stand with feet hip-width. Hinge to grab bar, drive through heels to stand. Lower with control.",
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"]
  },
  {
    id: "b7",
    name: "T-Bar Row",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "T-Bar Machine or Landmine",
    videoUrl: "https://www.youtube.com/watch?v=j3Igk5nyZE4",
    cues: ["Neutral spine", "Pull to chest", "Squeeze back"],
    instructions: "Straddle the bar with V-grip handle. Pull towards chest while maintaining flat back.",
    secondaryMuscles: ["Biceps", "Rear Delts"]
  },
  {
    id: "b8",
    name: "Seated Cable Row",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=GZbfZ033f74",
    cues: ["Sit tall", "Pull to belly", "Squeeze shoulder blades"],
    instructions: "Sit at cable row station. Pull handle to lower chest/upper abs, squeezing back.",
    secondaryMuscles: ["Biceps", "Rear Delts"]
  },
  {
    id: "b9",
    name: "Chin Up",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Pull-up Bar",
    videoUrl: "https://www.youtube.com/watch?v=brhRXlOhsAM",
    cues: ["Underhand grip", "Chin over bar", "Engage biceps"],
    instructions: "Grab bar with underhand grip. Pull up until chin clears bar. Lower with control.",
    secondaryMuscles: ["Biceps", "Forearms"]
  },
  {
    id: "b10",
    name: "Pendlay Row",
    muscleGroup: "Back",
    difficulty: "Advanced",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=T3N-TO4reLQ",
    cues: ["Bar from floor", "Explosive pull", "Reset each rep"],
    instructions: "Start with bar on floor. Explosively row to chest, lower to floor. Reset position each rep.",
    secondaryMuscles: ["Biceps", "Core"]
  },
  {
    id: "b11",
    name: "Straight Arm Pulldown",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=AjZMCFq1XQA",
    cues: ["Arms straight", "Pull to thighs", "Squeeze lats"],
    instructions: "Stand facing cable machine. With straight arms, pull bar down to thighs. Control the return.",
    secondaryMuscles: ["Triceps"]
  },
  {
    id: "b12",
    name: "Meadows Row",
    muscleGroup: "Back",
    difficulty: "Advanced",
    equipment: "Barbell, Landmine",
    videoUrl: "https://www.youtube.com/watch?v=xLk8Dv8Hpkc",
    cues: ["Staggered stance", "Row to hip", "Feel lat stretch"],
    instructions: "Stand perpendicular to landmine. Row with arm furthest from base. Focus on lat engagement.",
    secondaryMuscles: ["Biceps", "Rear Delts"]
  },
  {
    id: "b13",
    name: "Inverted Row",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Bar or Smith Machine",
    videoUrl: "https://www.youtube.com/watch?v=KOaCM1HMwU0",
    cues: ["Body straight", "Pull chest to bar", "Squeeze at top"],
    instructions: "Hang under a bar with feet on floor. Pull chest to bar keeping body straight.",
    secondaryMuscles: ["Biceps", "Core"]
  },
  {
    id: "b14",
    name: "Rack Pull",
    muscleGroup: "Back",
    difficulty: "Intermediate",
    equipment: "Barbell, Rack",
    videoUrl: "https://www.youtube.com/watch?v=M8uP-rRXMgg",
    cues: ["Bar at knee height", "Lockout at top", "Squeeze traps"],
    instructions: "Set bar at knee height in rack. Deadlift from this position, focusing on upper back.",
    secondaryMuscles: ["Traps", "Glutes"]
  },
  {
    id: "b15",
    name: "Reverse Fly Machine",
    muscleGroup: "Back",
    difficulty: "Beginner",
    equipment: "Pec Deck Machine",
    videoUrl: "https://www.youtube.com/watch?v=5YK4bgzXDp0",
    cues: ["Face pad", "Squeeze shoulder blades", "Control movement"],
    instructions: "Sit facing machine pad. Open arms wide, squeezing rear delts and upper back.",
    secondaryMuscles: ["Rear Delts"]
  },

  // SHOULDERS - 15 exercises
  {
    id: "s1",
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=QAQ64hK4Xxs",
    cues: ["Core tight", "Head through window", "Don't arch back"],
    instructions: "Press the barbell from your shoulders to overhead. Lock out at the top.",
    secondaryMuscles: ["Triceps"]
  },
  {
    id: "s2",
    name: "Lateral Raises",
    muscleGroup: "Shoulders",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
    cues: ["Lead with elbows", "Pinkies up", "Don't swing"],
    instructions: "Raise dumbbells to the side until arms are parallel to floor. Lower slowly.",
    secondaryMuscles: ["Traps"]
  },
  {
    id: "s3",
    name: "Dumbbell Shoulder Press",
    muscleGroup: "Shoulders",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog",
    cues: ["Elbows at 90", "Press straight up", "Control descent"],
    instructions: "Sit or stand with dumbbells at shoulder height. Press overhead and lower with control.",
    secondaryMuscles: ["Triceps"]
  },
  {
    id: "s4",
    name: "Front Raises",
    muscleGroup: "Shoulders",
    difficulty: "Beginner",
    equipment: "Dumbbells or Plate",
    videoUrl: "https://www.youtube.com/watch?v=-t7fuZ0KhDA",
    cues: ["Arms straight", "Raise to eye level", "No momentum"],
    instructions: "Raise weight in front of you to shoulder height. Lower slowly.",
    secondaryMuscles: ["Upper Chest"]
  },
  {
    id: "s5",
    name: "Arnold Press",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=3ml7BH7mNwQ",
    cues: ["Start palms facing you", "Rotate as you press", "Full range"],
    instructions: "Start with dumbbells at chest, palms in. Rotate and press overhead in one motion.",
    secondaryMuscles: ["Triceps"]
  },
  {
    id: "s6",
    name: "Upright Row",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Barbell or Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=amCU-ziHITM",
    cues: ["Lead with elbows", "Pull to chin", "Don't shrug"],
    instructions: "Pull weight up along body, leading with elbows. Raise to chin level.",
    secondaryMuscles: ["Traps", "Biceps"]
  },
  {
    id: "s7",
    name: "Rear Delt Flyes",
    muscleGroup: "Shoulders",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=lPt0GqwaqEw",
    cues: ["Bend at hips", "Fly arms out", "Squeeze rear delts"],
    instructions: "Bend over with flat back. Raise arms out to sides, squeezing rear delts.",
    secondaryMuscles: ["Upper Back"]
  },
  {
    id: "s8",
    name: "Cable Lateral Raise",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=PPrzBWZDOhA",
    cues: ["Low cable", "Slight lean away", "Constant tension"],
    instructions: "Stand beside low cable. Raise arm to side against resistance. Control descent.",
    secondaryMuscles: ["Traps"]
  },
  {
    id: "s9",
    name: "Machine Shoulder Press",
    muscleGroup: "Shoulders",
    difficulty: "Beginner",
    equipment: "Shoulder Press Machine",
    videoUrl: "https://www.youtube.com/watch?v=Wqq43dKW1TU",
    cues: ["Adjust seat", "Full lockout", "Control negative"],
    instructions: "Sit in machine and press handles overhead. Lower with control.",
    secondaryMuscles: ["Triceps"]
  },
  {
    id: "s10",
    name: "Push Press",
    muscleGroup: "Shoulders",
    difficulty: "Advanced",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=iaBVSJm78ko",
    cues: ["Dip knees", "Explode up", "Lockout overhead"],
    instructions: "Dip knees slightly then explosively drive bar overhead using leg drive.",
    secondaryMuscles: ["Triceps", "Legs"]
  },
  {
    id: "s11",
    name: "Lu Raises",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=bR21MH1pYO8",
    cues: ["Thumb up grip", "Raise to eye level", "Slow tempo"],
    instructions: "Hold dumbbells with thumbs up. Raise arms forward and slightly out.",
    secondaryMuscles: ["Front Delts"]
  },
  {
    id: "s12",
    name: "Landmine Shoulder Press",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Barbell, Landmine",
    videoUrl: "https://www.youtube.com/watch?v=ywL7ITy-v8Q",
    cues: ["Half kneeling", "Press at angle", "Core engaged"],
    instructions: "Kneel with barbell at shoulder. Press forward and up following the arc.",
    secondaryMuscles: ["Triceps", "Core"]
  },
  {
    id: "s13",
    name: "Handstand Push Up",
    muscleGroup: "Shoulders",
    difficulty: "Advanced",
    equipment: "Wall or Freestanding",
    videoUrl: "https://www.youtube.com/watch?v=sBrxokkjnQ0",
    cues: ["Tight core", "Head to floor", "Press up"],
    instructions: "In handstand against wall, lower head to floor and press back up.",
    secondaryMuscles: ["Triceps", "Core"]
  },
  {
    id: "s14",
    name: "Z Press",
    muscleGroup: "Shoulders",
    difficulty: "Advanced",
    equipment: "Barbell or Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=NlZMT_HfpZs",
    cues: ["Sit on floor", "Legs extended", "No back support"],
    instructions: "Sit on floor with legs extended. Press weight overhead without leaning back.",
    secondaryMuscles: ["Core", "Triceps"]
  },
  {
    id: "s15",
    name: "Face Away Cable Lateral Raise",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=5vXMHvvNBSc",
    cues: ["Face away from cable", "Slight forward lean", "Peak contraction"],
    instructions: "Stand facing away from cable. Raise arm to side, feeling tension throughout.",
    secondaryMuscles: ["Traps"]
  },

  // BICEPS - 12 exercises
  {
    id: "bi1",
    name: "Barbell Curl",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=kwG2ipFRgfo",
    cues: ["Elbows tucked", "No swinging", "Squeeze at top"],
    instructions: "Curl the barbell up towards your chest. Lower slowly.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "bi2",
    name: "Dumbbell Curl",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=sAq_ocpRh_I",
    cues: ["Supinate at top", "Full stretch", "Control movement"],
    instructions: "Curl dumbbells alternating or together. Rotate wrist as you lift.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "bi3",
    name: "Hammer Curl",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
    cues: ["Neutral grip", "No rotation", "Target brachialis"],
    instructions: "Hold dumbbells with palms facing in. Curl up without rotating wrists.",
    secondaryMuscles: ["Brachialis", "Forearms"]
  },
  {
    id: "bi4",
    name: "Preacher Curl",
    muscleGroup: "Biceps",
    difficulty: "Intermediate",
    equipment: "Preacher Bench, Barbell/Dumbbell",
    videoUrl: "https://www.youtube.com/watch?v=fIWP-FRFNU0",
    cues: ["Armpits on pad", "Full extension", "Squeeze at top"],
    instructions: "Rest arms on preacher pad. Curl weight up, fully extending at bottom.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "bi5",
    name: "Incline Dumbbell Curl",
    muscleGroup: "Biceps",
    difficulty: "Intermediate",
    equipment: "Dumbbells, Incline Bench",
    videoUrl: "https://www.youtube.com/watch?v=soxrZlIl35U",
    cues: ["Let arms hang", "Full stretch", "No swinging"],
    instructions: "Lie on incline bench with arms hanging. Curl up focusing on stretch.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "bi6",
    name: "Cable Curl",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=NFzTWp2qpiE",
    cues: ["Elbows fixed", "Constant tension", "Peak squeeze"],
    instructions: "Stand facing cable with bar attachment. Curl up while keeping elbows at sides.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "bi7",
    name: "Concentration Curl",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    videoUrl: "https://www.youtube.com/watch?v=0AUGkch3tzc",
    cues: ["Elbow on inner thigh", "Isolate bicep", "Slow negative"],
    instructions: "Sit with elbow braced on inner thigh. Curl dumbbell focusing on peak contraction.",
    secondaryMuscles: []
  },
  {
    id: "bi8",
    name: "Spider Curl",
    muscleGroup: "Biceps",
    difficulty: "Intermediate",
    equipment: "Dumbbells or Barbell, Incline Bench",
    videoUrl: "https://www.youtube.com/watch?v=of8Ja1yfdQ4",
    cues: ["Chest on incline pad", "Arms hanging", "Peak contraction"],
    instructions: "Lie face down on incline bench. Curl weight up with arms perpendicular to floor.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "bi9",
    name: "EZ Bar Curl",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "EZ Curl Bar",
    videoUrl: "https://www.youtube.com/watch?v=zG2xJ0Q5QtI",
    cues: ["Angled grip", "Wrist friendly", "Full range"],
    instructions: "Curl the EZ bar using the angled grips. Lower with control.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "bi10",
    name: "21s",
    muscleGroup: "Biceps",
    difficulty: "Advanced",
    equipment: "Barbell or Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=OT7P7_Zj5nI",
    cues: ["7 bottom half", "7 top half", "7 full range"],
    instructions: "Perform 7 reps bottom half, 7 reps top half, then 7 full reps without rest.",
    secondaryMuscles: ["Forearms"]
  },
  {
    id: "bi11",
    name: "Cross Body Hammer Curl",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=b4HJfqw6UMI",
    cues: ["Curl across body", "Neutral grip", "Target brachialis"],
    instructions: "Curl dumbbell across your body toward opposite shoulder.",
    secondaryMuscles: ["Brachialis", "Forearms"]
  },
  {
    id: "bi12",
    name: "Reverse Curl",
    muscleGroup: "Biceps",
    difficulty: "Intermediate",
    equipment: "Barbell or Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=nRgxYX2Ve9w",
    cues: ["Overhand grip", "Forearm focus", "Control movement"],
    instructions: "Grip bar with palms facing down. Curl up focusing on forearm engagement.",
    secondaryMuscles: ["Forearms", "Brachialis"]
  },

  // TRICEPS - 12 exercises
  {
    id: "tr1",
    name: "Tricep Pushdown",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=6kALZikXxLc",
    cues: ["Elbows fixed", "Full extension", "Squeeze triceps"],
    instructions: "Push the cable attachment down until arms are straight. Return to 90 degrees.",
    secondaryMuscles: []
  },
  {
    id: "tr2",
    name: "Skull Crushers",
    muscleGroup: "Triceps",
    difficulty: "Intermediate",
    equipment: "Barbell or Dumbbells, Bench",
    videoUrl: "https://www.youtube.com/watch?v=d_KZxkY_0cM",
    cues: ["Lower to forehead", "Elbows in", "Full extension"],
    instructions: "Lie flat holding weight above chest. Lower to forehead by bending elbows. Extend back up.",
    secondaryMuscles: []
  },
  {
    id: "tr3",
    name: "Overhead Tricep Extension",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Dumbbell or Cable",
    videoUrl: "https://www.youtube.com/watch?v=_gsUck-7M74",
    cues: ["Arms overhead", "Lower behind head", "Full stretch"],
    instructions: "Hold weight overhead. Lower behind head by bending elbows. Extend back up.",
    secondaryMuscles: []
  },
  {
    id: "tr4",
    name: "Tricep Dips",
    muscleGroup: "Triceps",
    difficulty: "Intermediate",
    equipment: "Dip Station or Bench",
    videoUrl: "https://www.youtube.com/watch?v=0326dy_-CzM",
    cues: ["Stay upright", "Elbows back", "Full range"],
    instructions: "Support yourself on bars or bench. Lower body by bending arms. Push back up.",
    secondaryMuscles: ["Chest", "Shoulders"]
  },
  {
    id: "tr5",
    name: "Diamond Push Ups",
    muscleGroup: "Triceps",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=J0DnG1_S92I",
    cues: ["Hands form diamond", "Elbows close", "Core tight"],
    instructions: "Form diamond with hands. Lower chest to hands and push back up.",
    secondaryMuscles: ["Chest", "Core"]
  },
  {
    id: "tr6",
    name: "Rope Pushdown",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Cable Machine, Rope",
    videoUrl: "https://www.youtube.com/watch?v=vB5OHsJ3EME",
    cues: ["Split rope at bottom", "Full extension", "Peak squeeze"],
    instructions: "Push rope down and split ends at bottom for peak contraction.",
    secondaryMuscles: []
  },
  {
    id: "tr7",
    name: "Kickbacks",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=6SS6K3lAwZ8",
    cues: ["Elbow fixed", "Extend fully", "Squeeze at top"],
    instructions: "Bend over with upper arm parallel to floor. Extend arm back, squeezing tricep.",
    secondaryMuscles: []
  },
  {
    id: "tr8",
    name: "Close Grip Bench Press",
    muscleGroup: "Triceps",
    difficulty: "Intermediate",
    equipment: "Barbell, Bench",
    videoUrl: "https://www.youtube.com/watch?v=nEF0bv2FW94",
    cues: ["Hands shoulder-width", "Elbows tucked", "Full lockout"],
    instructions: "Bench press with hands shoulder-width apart, focusing on tricep engagement.",
    secondaryMuscles: ["Chest", "Shoulders"]
  },
  {
    id: "tr9",
    name: "Overhead Cable Extension",
    muscleGroup: "Triceps",
    difficulty: "Intermediate",
    equipment: "Cable Machine, Rope",
    videoUrl: "https://www.youtube.com/watch?v=uhQyWWL1p8g",
    cues: ["Face away", "Arms overhead", "Stretch and squeeze"],
    instructions: "Face away from cable. Extend arms overhead, feeling stretch and contraction.",
    secondaryMuscles: []
  },
  {
    id: "tr10",
    name: "JM Press",
    muscleGroup: "Triceps",
    difficulty: "Advanced",
    equipment: "Barbell, Bench",
    videoUrl: "https://www.youtube.com/watch?v=Az4G3GsvB_k",
    cues: ["Lower to chin/neck", "Elbows forward", "Tricep focus"],
    instructions: "Hybrid of close grip press and skull crusher. Lower bar toward chin/neck area.",
    secondaryMuscles: ["Chest"]
  },
  {
    id: "tr11",
    name: "Single Arm Pushdown",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=PH2_wfv0m_M",
    cues: ["Single arm focus", "Full extension", "Control return"],
    instructions: "Push down with one arm, focusing on tricep contraction.",
    secondaryMuscles: []
  },
  {
    id: "tr12",
    name: "Bench Dips",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Bench",
    videoUrl: "https://www.youtube.com/watch?v=c3ZGl4pAwZ4",
    cues: ["Hands on bench", "Lower to 90", "Push up"],
    instructions: "Hands on bench behind you, lower body by bending arms. Push back up.",
    secondaryMuscles: ["Shoulders"]
  },

  // QUADS - 15 exercises
  {
    id: "q1",
    name: "Barbell Squat",
    muscleGroup: "Quads",
    difficulty: "Intermediate",
    equipment: "Barbell, Rack",
    videoUrl: "https://www.youtube.com/watch?v=ultWZbGWL54",
    cues: ["Chest up", "Knees out", "Hit parallel depth"],
    instructions: "Place bar on upper back. Squat down by sitting back and bending knees. Stand back up.",
    secondaryMuscles: ["Glutes", "Core"]
  },
  {
    id: "q2",
    name: "Leg Press",
    muscleGroup: "Quads",
    difficulty: "Beginner",
    equipment: "Leg Press Machine",
    videoUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
    cues: ["Feet shoulder width", "Don't lock knees", "Lower deep"],
    instructions: "Sit in the machine. Push the platform away. Lower it back down until your knees are near your chest.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "q3",
    name: "Bulgarian Split Squat",
    muscleGroup: "Quads",
    difficulty: "Advanced",
    equipment: "Dumbbells, Bench",
    videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
    cues: ["Keep torso upright", "Knee tracks over toe", "Drive through front heel"],
    instructions: "Place one foot on a bench behind you. Squat down with the front leg. Push back up.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "q4",
    name: "Leg Extension",
    muscleGroup: "Quads",
    difficulty: "Beginner",
    equipment: "Leg Extension Machine",
    videoUrl: "https://www.youtube.com/watch?v=YyvSfVjQeL0",
    cues: ["Adjust pad", "Full extension", "Control descent"],
    instructions: "Sit in machine and extend legs until straight. Lower with control.",
    secondaryMuscles: []
  },
  {
    id: "q5",
    name: "Front Squat",
    muscleGroup: "Quads",
    difficulty: "Advanced",
    equipment: "Barbell, Rack",
    videoUrl: "https://www.youtube.com/watch?v=m4ytaCJZpl0",
    cues: ["Bar on front delts", "Elbows high", "Upright torso"],
    instructions: "Hold bar on front shoulders. Squat while keeping torso very upright.",
    secondaryMuscles: ["Core", "Glutes"]
  },
  {
    id: "q6",
    name: "Hack Squat",
    muscleGroup: "Quads",
    difficulty: "Intermediate",
    equipment: "Hack Squat Machine",
    videoUrl: "https://www.youtube.com/watch?v=0tn5K9NlCfo",
    cues: ["Shoulders under pads", "Full depth", "Quad focus"],
    instructions: "Position in hack squat machine. Lower by bending knees. Push back up.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "q7",
    name: "Walking Lunges",
    muscleGroup: "Quads",
    difficulty: "Intermediate",
    equipment: "Dumbbells or Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=L8fvypPrzzs",
    cues: ["Big steps", "Knee to 90", "Drive through heel"],
    instructions: "Take large steps forward, dropping back knee toward ground. Alternate legs.",
    secondaryMuscles: ["Glutes", "Hamstrings"]
  },
  {
    id: "q8",
    name: "Goblet Squat",
    muscleGroup: "Quads",
    difficulty: "Beginner",
    equipment: "Dumbbell or Kettlebell",
    videoUrl: "https://www.youtube.com/watch?v=MeIiIdhvXT4",
    cues: ["Hold weight at chest", "Elbows inside knees", "Sit deep"],
    instructions: "Hold weight at chest. Squat deep with elbows tracking inside knees.",
    secondaryMuscles: ["Core", "Glutes"]
  },
  {
    id: "q9",
    name: "Sissy Squat",
    muscleGroup: "Quads",
    difficulty: "Advanced",
    equipment: "Bodyweight or Sissy Squat Bench",
    videoUrl: "https://www.youtube.com/watch?v=7bEkE2p1b7s",
    cues: ["Lean back", "Knees forward", "Quad isolation"],
    instructions: "Lean back while lowering, letting knees travel forward. Rise back up.",
    secondaryMuscles: []
  },
  {
    id: "q10",
    name: "Step Ups",
    muscleGroup: "Quads",
    difficulty: "Beginner",
    equipment: "Box or Bench, Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=dQqApCGYiWM",
    cues: ["Drive through heel", "Full hip extension", "Control step down"],
    instructions: "Step onto box driving through front leg. Step back down with control.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "q11",
    name: "Pendulum Squat",
    muscleGroup: "Quads",
    difficulty: "Intermediate",
    equipment: "Pendulum Squat Machine",
    videoUrl: "https://www.youtube.com/watch?v=0W8F2GxVHYk",
    cues: ["Shoulders under pads", "Full range", "Constant tension"],
    instructions: "Position in machine and squat through full range of motion.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "q12",
    name: "Wall Sit",
    muscleGroup: "Quads",
    difficulty: "Beginner",
    equipment: "Wall",
    videoUrl: "https://www.youtube.com/watch?v=y-wV4Venusw",
    cues: ["Back flat on wall", "Thighs parallel", "Hold position"],
    instructions: "Slide down wall until thighs are parallel to floor. Hold position.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "q13",
    name: "Smith Machine Squat",
    muscleGroup: "Quads",
    difficulty: "Beginner",
    equipment: "Smith Machine",
    videoUrl: "https://www.youtube.com/watch?v=rrEV1kYCbnI",
    cues: ["Feet slightly forward", "Full depth", "Controlled tempo"],
    instructions: "Position bar on upper back in Smith machine. Squat down and up.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "q14",
    name: "Single Leg Press",
    muscleGroup: "Quads",
    difficulty: "Intermediate",
    equipment: "Leg Press Machine",
    videoUrl: "https://www.youtube.com/watch?v=7JmxKt4m2Go",
    cues: ["One leg at a time", "Full range", "Balance focus"],
    instructions: "Perform leg press using one leg at a time for increased quad focus.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "q15",
    name: "Reverse Lunge",
    muscleGroup: "Quads",
    difficulty: "Beginner",
    equipment: "Dumbbells or Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=xrPteyQLGAo",
    cues: ["Step back", "Front knee stable", "Drive up"],
    instructions: "Step backward into lunge position. Drive back up through front leg.",
    secondaryMuscles: ["Glutes", "Hamstrings"]
  },

  // HAMSTRINGS - 12 exercises
  {
    id: "h1",
    name: "Romanian Deadlift",
    muscleGroup: "Hamstrings",
    difficulty: "Intermediate",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=JCXUYuzwNrM",
    cues: ["Hinge at hips", "Slight knee bend", "Feel hamstring stretch"],
    instructions: "Hold bar at hip level. Hinge hips back, lowering bar along legs. Return to standing by driving hips forward.",
    secondaryMuscles: ["Glutes", "Lower Back"]
  },
  {
    id: "h2",
    name: "Lying Leg Curl",
    muscleGroup: "Hamstrings",
    difficulty: "Beginner",
    equipment: "Leg Curl Machine",
    videoUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
    cues: ["Hips flat", "Curl fully", "Control negative"],
    instructions: "Lie face down on machine. Curl heels toward glutes. Lower with control.",
    secondaryMuscles: []
  },
  {
    id: "h3",
    name: "Seated Leg Curl",
    muscleGroup: "Hamstrings",
    difficulty: "Beginner",
    equipment: "Seated Leg Curl Machine",
    videoUrl: "https://www.youtube.com/watch?v=Orxowest56U",
    cues: ["Adjust pads", "Full contraction", "Slow eccentric"],
    instructions: "Sit in machine and curl legs under seat. Return slowly.",
    secondaryMuscles: []
  },
  {
    id: "h4",
    name: "Good Mornings",
    muscleGroup: "Hamstrings",
    difficulty: "Intermediate",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=Irc22LvRQHk",
    cues: ["Bar on upper back", "Hinge at hips", "Feel stretch"],
    instructions: "With bar on back, hinge forward at hips until torso is near parallel.",
    secondaryMuscles: ["Lower Back", "Glutes"]
  },
  {
    id: "h5",
    name: "Nordic Curl",
    muscleGroup: "Hamstrings",
    difficulty: "Advanced",
    equipment: "Pad, Anchor",
    videoUrl: "https://www.youtube.com/watch?v=lALwQ2LkfnU",
    cues: ["Ankles secured", "Lower slowly", "Catch yourself"],
    instructions: "Kneel with ankles secured. Lower body forward under control. Push back up.",
    secondaryMuscles: []
  },
  {
    id: "h6",
    name: "Stiff Leg Deadlift",
    muscleGroup: "Hamstrings",
    difficulty: "Intermediate",
    equipment: "Barbell or Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=CN_7cz3P-1U",
    cues: ["Legs nearly straight", "Feel stretch", "Hinge at hips"],
    instructions: "Keep legs nearly straight while hinging forward. Focus on hamstring stretch.",
    secondaryMuscles: ["Lower Back", "Glutes"]
  },
  {
    id: "h7",
    name: "Single Leg Romanian Deadlift",
    muscleGroup: "Hamstrings",
    difficulty: "Advanced",
    equipment: "Dumbbell or Kettlebell",
    videoUrl: "https://www.youtube.com/watch?v=EhRjHq5_HfE",
    cues: ["Balance on one leg", "Hinge forward", "Back leg extends"],
    instructions: "Balance on one leg while hinging forward. Back leg extends for balance.",
    secondaryMuscles: ["Glutes", "Core"]
  },
  {
    id: "h8",
    name: "Glute Ham Raise",
    muscleGroup: "Hamstrings",
    difficulty: "Advanced",
    equipment: "GHD Machine",
    videoUrl: "https://www.youtube.com/watch?v=0ofMuMv5HA8",
    cues: ["Set up on GHD", "Lower forward", "Curl back up"],
    instructions: "Position on GHD. Lower torso forward, then curl back up using hamstrings.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "h9",
    name: "Cable Pull Through",
    muscleGroup: "Hamstrings",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=ArMilAE9A4Y",
    cues: ["Face away from cable", "Hinge at hips", "Squeeze glutes"],
    instructions: "Stand facing away from low cable. Hinge forward then drive hips through.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "h10",
    name: "Kettlebell Swing",
    muscleGroup: "Hamstrings",
    difficulty: "Intermediate",
    equipment: "Kettlebell",
    videoUrl: "https://www.youtube.com/watch?v=YSxHifyI6s8",
    cues: ["Hip hinge", "Explosive hip snap", "Glute squeeze"],
    instructions: "Hinge and swing kettlebell between legs. Snap hips to swing up.",
    secondaryMuscles: ["Glutes", "Core"]
  },
  {
    id: "h11",
    name: "Slider Leg Curl",
    muscleGroup: "Hamstrings",
    difficulty: "Intermediate",
    equipment: "Sliders or Towel",
    videoUrl: "https://www.youtube.com/watch?v=kGRnWACCVHU",
    cues: ["Bridge up", "Slide heels out", "Curl back in"],
    instructions: "Lie on back with heels on sliders. Bridge up and slide heels out and in.",
    secondaryMuscles: ["Glutes"]
  },
  {
    id: "h12",
    name: "Swiss Ball Leg Curl",
    muscleGroup: "Hamstrings",
    difficulty: "Intermediate",
    equipment: "Swiss Ball",
    videoUrl: "https://www.youtube.com/watch?v=AuIj5VxBv_w",
    cues: ["Heels on ball", "Bridge up", "Roll ball toward glutes"],
    instructions: "Lie on back with heels on ball. Bridge up and curl ball toward you.",
    secondaryMuscles: ["Glutes", "Core"]
  },

  // GLUTES - 12 exercises
  {
    id: "g1",
    name: "Hip Thrust",
    muscleGroup: "Glutes",
    difficulty: "Intermediate",
    equipment: "Barbell, Bench",
    videoUrl: "https://www.youtube.com/watch?v=SEdqd1n0cvg",
    cues: ["Upper back on bench", "Drive hips up", "Squeeze at top"],
    instructions: "Back against bench with bar across hips. Drive hips up and squeeze glutes.",
    secondaryMuscles: ["Hamstrings"]
  },
  {
    id: "g2",
    name: "Glute Bridge",
    muscleGroup: "Glutes",
    difficulty: "Beginner",
    equipment: "Bodyweight or Barbell",
    videoUrl: "https://www.youtube.com/watch?v=8bbE64NuDTU",
    cues: ["Feet flat", "Drive through heels", "Squeeze at top"],
    instructions: "Lie on back with knees bent. Drive hips up squeezing glutes at top.",
    secondaryMuscles: ["Hamstrings"]
  },
  {
    id: "g3",
    name: "Cable Kickback",
    muscleGroup: "Glutes",
    difficulty: "Beginner",
    equipment: "Cable Machine, Ankle Strap",
    videoUrl: "https://www.youtube.com/watch?v=AvVpBT0I4NM",
    cues: ["Slight forward lean", "Kick back", "Squeeze glute"],
    instructions: "Attach ankle strap to low cable. Kick leg straight back squeezing glute.",
    secondaryMuscles: []
  },
  {
    id: "g4",
    name: "Sumo Deadlift",
    muscleGroup: "Glutes",
    difficulty: "Intermediate",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=fJyDCkynjhQ",
    cues: ["Wide stance", "Toes out", "Chest up"],
    instructions: "Take wide stance with toes out. Grip bar inside legs and lift.",
    secondaryMuscles: ["Hamstrings", "Quads"]
  },
  {
    id: "g5",
    name: "Step Ups",
    muscleGroup: "Glutes",
    difficulty: "Beginner",
    equipment: "Box, Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=dQqApCGYiWM",
    cues: ["Drive through heel", "Full hip extension", "Control descent"],
    instructions: "Step onto box pushing through front leg. Fully extend hip at top.",
    secondaryMuscles: ["Quads"]
  },
  {
    id: "g6",
    name: "Frog Pumps",
    muscleGroup: "Glutes",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=De9J2u3PrIU",
    cues: ["Soles together", "Knees out", "Drive hips up"],
    instructions: "Lie with soles together, knees out. Drive hips up squeezing glutes.",
    secondaryMuscles: []
  },
  {
    id: "g7",
    name: "Banded Clamshells",
    muscleGroup: "Glutes",
    difficulty: "Beginner",
    equipment: "Resistance Band",
    videoUrl: "https://www.youtube.com/watch?v=3DjSWlJlSgU",
    cues: ["Lie on side", "Open top knee", "Control return"],
    instructions: "Lie on side with band around knees. Open top knee against resistance.",
    secondaryMuscles: []
  },
  {
    id: "g8",
    name: "Reverse Hyperextension",
    muscleGroup: "Glutes",
    difficulty: "Intermediate",
    equipment: "Reverse Hyper Machine or Bench",
    videoUrl: "https://www.youtube.com/watch?v=3d7dledNO1U",
    cues: ["Torso supported", "Lift legs", "Squeeze at top"],
    instructions: "Lie face down on bench. Raise legs behind you squeezing glutes.",
    secondaryMuscles: ["Lower Back", "Hamstrings"]
  },
  {
    id: "g9",
    name: "Single Leg Hip Thrust",
    muscleGroup: "Glutes",
    difficulty: "Advanced",
    equipment: "Bench",
    videoUrl: "https://www.youtube.com/watch?v=AVAXhy6pl7o",
    cues: ["One leg extended", "Drive through heel", "Level hips"],
    instructions: "Perform hip thrust with one leg extended. Focus on working glute.",
    secondaryMuscles: ["Hamstrings"]
  },
  {
    id: "g10",
    name: "Curtsy Lunge",
    muscleGroup: "Glutes",
    difficulty: "Intermediate",
    equipment: "Dumbbells or Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=krS3nXhJw5M",
    cues: ["Step behind and across", "Stay upright", "Push through front heel"],
    instructions: "Step one leg behind and across. Lower into lunge position.",
    secondaryMuscles: ["Quads"]
  },
  {
    id: "g11",
    name: "Fire Hydrants",
    muscleGroup: "Glutes",
    difficulty: "Beginner",
    equipment: "Bodyweight or Band",
    videoUrl: "https://www.youtube.com/watch?v=La3xYT8MGks",
    cues: ["On hands and knees", "Lift knee to side", "Control movement"],
    instructions: "On all fours, lift knee out to side keeping 90 degree angle.",
    secondaryMuscles: []
  },
  {
    id: "g12",
    name: "Donkey Kicks",
    muscleGroup: "Glutes",
    difficulty: "Beginner",
    equipment: "Bodyweight or Band",
    videoUrl: "https://www.youtube.com/watch?v=S4bfJQ6P-1g",
    cues: ["On hands and knees", "Kick back", "Squeeze at top"],
    instructions: "On all fours, kick one leg back and up, squeezing glute at top.",
    secondaryMuscles: []
  },

  // CALVES - 8 exercises
  {
    id: "cv1",
    name: "Standing Calf Raise",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "Machine or Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=-M4-G8p8fmc",
    cues: ["Full stretch at bottom", "Squeeze at top", "Control tempo"],
    instructions: "Stand on the edge of a step. Lower heels down, then raise up onto toes.",
    secondaryMuscles: []
  },
  {
    id: "cv2",
    name: "Seated Calf Raise",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "Seated Calf Machine",
    videoUrl: "https://www.youtube.com/watch?v=JbyjNymZOt0",
    cues: ["Knees under pad", "Full range", "Target soleus"],
    instructions: "Sit with knees under pad. Raise and lower heels through full range.",
    secondaryMuscles: []
  },
  {
    id: "cv3",
    name: "Donkey Calf Raise",
    muscleGroup: "Calves",
    difficulty: "Intermediate",
    equipment: "Machine or Partner",
    videoUrl: "https://www.youtube.com/watch?v=DrWYRpBnDGs",
    cues: ["Hinge at hips", "Full stretch", "High rep focus"],
    instructions: "Bend at hips with weight on back. Raise and lower heels.",
    secondaryMuscles: []
  },
  {
    id: "cv4",
    name: "Single Leg Calf Raise",
    muscleGroup: "Calves",
    difficulty: "Intermediate",
    equipment: "Step, Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=WDlQTWlloF0",
    cues: ["One leg at a time", "Full range", "Hold wall for balance"],
    instructions: "Stand on one leg on step edge. Raise and lower through full range.",
    secondaryMuscles: []
  },
  {
    id: "cv5",
    name: "Leg Press Calf Raise",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "Leg Press Machine",
    videoUrl: "https://www.youtube.com/watch?v=o-_E3XGaBSQ",
    cues: ["Toes on platform edge", "Full extension", "Control weight"],
    instructions: "Position feet at bottom of platform. Push through toes only.",
    secondaryMuscles: []
  },
  {
    id: "cv6",
    name: "Smith Machine Calf Raise",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "Smith Machine, Block",
    videoUrl: "https://www.youtube.com/watch?v=WBbGqPNyCAE",
    cues: ["Bar on traps", "Elevated platform", "Full range"],
    instructions: "Stand on block with bar across back. Raise onto toes and lower.",
    secondaryMuscles: []
  },
  {
    id: "cv7",
    name: "Tibialis Raise",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "Bodyweight or Tib Bar",
    videoUrl: "https://www.youtube.com/watch?v=gNS_QjGAs_k",
    cues: ["Heels on edge", "Lift toes up", "Target tibialis"],
    instructions: "Stand with heels on platform edge. Raise toes up toward shins.",
    secondaryMuscles: []
  },
  {
    id: "cv8",
    name: "Jump Rope",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "Jump Rope",
    videoUrl: "https://www.youtube.com/watch?v=u3zgHI8QnqE",
    cues: ["Stay on toes", "Quick bounces", "Calf endurance"],
    instructions: "Jump rope staying on balls of feet for calf conditioning.",
    secondaryMuscles: ["Cardio"]
  },

  // ABS/CORE - 15 exercises
  {
    id: "ab1",
    name: "Plank",
    muscleGroup: "Abs",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
    cues: ["Body straight", "Core tight", "Don't sag hips"],
    instructions: "Hold push up position on forearms. Keep body in straight line.",
    secondaryMuscles: ["Shoulders"]
  },
  {
    id: "ab2",
    name: "Hanging Leg Raise",
    muscleGroup: "Abs",
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    videoUrl: "https://www.youtube.com/watch?v=Pr1ieGZ5atk",
    cues: ["Hang from bar", "Raise legs", "Control swing"],
    instructions: "Hang from bar. Raise legs to parallel or higher. Lower with control.",
    secondaryMuscles: ["Hip Flexors"]
  },
  {
    id: "ab3",
    name: "Cable Crunch",
    muscleGroup: "Abs",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=AV5PmZJIrrw",
    cues: ["Kneel facing cable", "Crunch down", "Focus on abs"],
    instructions: "Kneel with rope behind head. Crunch down bringing elbows to knees.",
    secondaryMuscles: []
  },
  {
    id: "ab4",
    name: "Russian Twist",
    muscleGroup: "Abs",
    difficulty: "Intermediate",
    equipment: "Medicine Ball or Weight",
    videoUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI",
    cues: ["Lean back", "Rotate torso", "Control movement"],
    instructions: "Sit with feet elevated. Rotate torso side to side with weight.",
    secondaryMuscles: ["Obliques"]
  },
  {
    id: "ab5",
    name: "Ab Wheel Rollout",
    muscleGroup: "Abs",
    difficulty: "Advanced",
    equipment: "Ab Wheel",
    videoUrl: "https://www.youtube.com/watch?v=uYBOBBv9GzY",
    cues: ["Start on knees", "Roll out slowly", "Keep core tight"],
    instructions: "Kneel with ab wheel. Roll forward extending body, then return.",
    secondaryMuscles: ["Shoulders", "Lats"]
  },
  {
    id: "ab6",
    name: "Bicycle Crunch",
    muscleGroup: "Abs",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=9FGilxCbdz8",
    cues: ["Hands behind head", "Elbow to opposite knee", "Extend other leg"],
    instructions: "Lie on back. Bring opposite elbow and knee together alternating sides.",
    secondaryMuscles: ["Obliques"]
  },
  {
    id: "ab7",
    name: "Mountain Climbers",
    muscleGroup: "Abs",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM",
    cues: ["Plank position", "Drive knees in", "Keep hips low"],
    instructions: "In plank, rapidly alternate driving knees toward chest.",
    secondaryMuscles: ["Shoulders", "Cardio"]
  },
  {
    id: "ab8",
    name: "Dead Bug",
    muscleGroup: "Abs",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=4XLEnwUr1d8",
    cues: ["Back flat", "Opposite arm/leg", "Core engaged"],
    instructions: "Lie on back with arms/legs up. Lower opposite arm and leg, return.",
    secondaryMuscles: []
  },
  {
    id: "ab9",
    name: "Toe Touch",
    muscleGroup: "Abs",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=9AE_yHGClBo",
    cues: ["Legs vertical", "Reach for toes", "Shoulder blades up"],
    instructions: "Lie with legs vertical. Reach up to touch toes lifting shoulders.",
    secondaryMuscles: []
  },
  {
    id: "ab10",
    name: "Pallof Press",
    muscleGroup: "Abs",
    difficulty: "Intermediate",
    equipment: "Cable Machine or Band",
    videoUrl: "https://www.youtube.com/watch?v=AH_QZLm_0-s",
    cues: ["Stand sideways", "Press out", "Resist rotation"],
    instructions: "Stand perpendicular to cable. Press handle straight out resisting rotation.",
    secondaryMuscles: ["Obliques"]
  },
  {
    id: "ab11",
    name: "V-Ups",
    muscleGroup: "Abs",
    difficulty: "Advanced",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=iP2fjvG0g3w",
    cues: ["Arms and legs straight", "Touch toes at top", "Lower with control"],
    instructions: "Lie flat. Raise arms and legs to meet in middle forming V shape.",
    secondaryMuscles: ["Hip Flexors"]
  },
  {
    id: "ab12",
    name: "Side Plank",
    muscleGroup: "Abs",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=K2VljzCC16g",
    cues: ["Stack feet", "Hips up", "Body straight"],
    instructions: "Support body on side on forearm. Keep body in straight line.",
    secondaryMuscles: ["Obliques"]
  },
  {
    id: "ab13",
    name: "Dragon Flag",
    muscleGroup: "Abs",
    difficulty: "Advanced",
    equipment: "Bench",
    videoUrl: "https://www.youtube.com/watch?v=pvz7k5gO-DE",
    cues: ["Grip bench behind head", "Lift entire body", "Lower slowly"],
    instructions: "Grip bench behind head. Raise and lower entire body as one unit.",
    secondaryMuscles: ["Lats", "Hip Flexors"]
  },
  {
    id: "ab14",
    name: "Reverse Crunch",
    muscleGroup: "Abs",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=Xm9LyO84HYI",
    cues: ["Knees to chest", "Lift hips", "Control descent"],
    instructions: "Lie on back. Bring knees to chest lifting hips off floor.",
    secondaryMuscles: []
  },
  {
    id: "ab15",
    name: "Woodchoppers",
    muscleGroup: "Abs",
    difficulty: "Intermediate",
    equipment: "Cable Machine or Medicine Ball",
    videoUrl: "https://www.youtube.com/watch?v=pAplQXk3dkU",
    cues: ["Rotate through core", "High to low or low to high", "Control movement"],
    instructions: "Pull cable diagonally across body rotating through core.",
    secondaryMuscles: ["Obliques", "Shoulders"]
  },

  // OBLIQUES - 8 exercises
  {
    id: "ob1",
    name: "Side Bend",
    muscleGroup: "Obliques",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    videoUrl: "https://www.youtube.com/watch?v=dL9ZzqtQI5c",
    cues: ["Stand straight", "Bend sideways", "Feel oblique stretch"],
    instructions: "Hold dumbbell in one hand. Bend sideways away from weight.",
    secondaryMuscles: []
  },
  {
    id: "ob2",
    name: "Cable Woodchop",
    muscleGroup: "Obliques",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=pAplQXk3dkU",
    cues: ["Rotate through torso", "Control the cable", "Full range"],
    instructions: "Pull cable diagonally across body from high to low or vice versa.",
    secondaryMuscles: ["Core"]
  },
  {
    id: "ob3",
    name: "Copenhagen Plank",
    muscleGroup: "Obliques",
    difficulty: "Advanced",
    equipment: "Bench",
    videoUrl: "https://www.youtube.com/watch?v=s8Y1f7Wnkpg",
    cues: ["Top leg on bench", "Hold side plank", "Lift bottom leg"],
    instructions: "Side plank with top leg supported on bench. Hold position.",
    secondaryMuscles: ["Adductors"]
  },
  {
    id: "ob4",
    name: "Bicycle Crunch",
    muscleGroup: "Obliques",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=9FGilxCbdz8",
    cues: ["Twist at waist", "Elbow to knee", "Control movement"],
    instructions: "Twist bringing opposite elbow and knee together.",
    secondaryMuscles: ["Abs"]
  },
  {
    id: "ob5",
    name: "Hanging Oblique Knee Raise",
    muscleGroup: "Obliques",
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    videoUrl: "https://www.youtube.com/watch?v=3R5WfzyGKc4",
    cues: ["Hang from bar", "Raise knees to side", "Alternate sides"],
    instructions: "Hang from bar. Raise knees up and to the side, alternating.",
    secondaryMuscles: ["Hip Flexors"]
  },
  {
    id: "ob6",
    name: "Side Plank Hip Dip",
    muscleGroup: "Obliques",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    videoUrl: "https://www.youtube.com/watch?v=tOoRo8HhZGQ",
    cues: ["Side plank position", "Dip hip down", "Raise back up"],
    instructions: "In side plank, lower hip toward ground then raise back up.",
    secondaryMuscles: []
  },
  {
    id: "ob7",
    name: "Russian Twist",
    muscleGroup: "Obliques",
    difficulty: "Intermediate",
    equipment: "Medicine Ball or Weight",
    videoUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI",
    cues: ["Lean back", "Rotate side to side", "Feet can be elevated"],
    instructions: "Sit with feet elevated. Rotate torso touching weight to each side.",
    secondaryMuscles: ["Abs"]
  },
  {
    id: "ob8",
    name: "Landmine Rotation",
    muscleGroup: "Obliques",
    difficulty: "Intermediate",
    equipment: "Barbell, Landmine",
    videoUrl: "https://www.youtube.com/watch?v=o5jmzBpZXpk",
    cues: ["Hold end of bar", "Rotate side to side", "Arms extended"],
    instructions: "Hold end of barbell with arms extended. Rotate to each side.",
    secondaryMuscles: ["Shoulders"]
  },

  // REAR DELTS - 12 exercises
  {
    id: "rd1",
    name: "Face Pulls",
    muscleGroup: "Rear Delts",
    difficulty: "Beginner",
    equipment: "Cable Machine, Rope",
    videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
    cues: ["Pull to face", "External rotation", "Squeeze rear delts"],
    instructions: "Set cable at face height. Pull rope toward face while separating hands and rotating externally.",
    secondaryMuscles: ["Traps", "Rotator Cuff"]
  },
  {
    id: "rd2",
    name: "Rear Delt Flyes",
    muscleGroup: "Rear Delts",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=lPt0GqwaqEw",
    cues: ["Bend at hips", "Fly arms out", "Squeeze rear delts"],
    instructions: "Bend over with flat back. Raise arms out to sides, squeezing rear delts at top.",
    secondaryMuscles: ["Upper Back"]
  },
  {
    id: "rd3",
    name: "Reverse Pec Deck",
    muscleGroup: "Rear Delts",
    difficulty: "Beginner",
    equipment: "Pec Deck Machine",
    videoUrl: "https://www.youtube.com/watch?v=5YK4bgzXDp0",
    cues: ["Face pad", "Squeeze shoulder blades", "Control movement"],
    instructions: "Sit facing machine pad. Open arms wide, squeezing rear delts and upper back.",
    secondaryMuscles: ["Upper Back"]
  },
  {
    id: "rd4",
    name: "Cable Rear Delt Fly",
    muscleGroup: "Rear Delts",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=L_5tS7aKPi4",
    cues: ["Cross cables", "Pull apart", "Squeeze at end"],
    instructions: "Set cables at shoulder height. Grab opposite cables and pull apart in fly motion.",
    secondaryMuscles: ["Upper Back"]
  },
  {
    id: "rd5",
    name: "Incline Rear Delt Raise",
    muscleGroup: "Rear Delts",
    difficulty: "Intermediate",
    equipment: "Dumbbells, Incline Bench",
    videoUrl: "https://www.youtube.com/watch?v=jPLdzuHckI8",
    cues: ["Chest on incline pad", "Raise to sides", "Control descent"],
    instructions: "Lie face down on incline bench. Raise dumbbells out to sides, squeezing rear delts.",
    secondaryMuscles: ["Upper Back"]
  },
  {
    id: "rd6",
    name: "Band Pull Apart",
    muscleGroup: "Rear Delts",
    difficulty: "Beginner",
    equipment: "Resistance Band",
    videoUrl: "https://www.youtube.com/watch?v=JObYtU7Y7ag",
    cues: ["Arms straight", "Pull band apart", "Squeeze at end"],
    instructions: "Hold band with arms extended. Pull apart stretching band across chest.",
    secondaryMuscles: ["Traps", "Rhomboids"]
  },
  {
    id: "rd7",
    name: "High Cable Rear Delt Pull",
    muscleGroup: "Rear Delts",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=2qbCd6_WDMU",
    cues: ["High cable position", "Pull down and back", "External rotation"],
    instructions: "Set cable high. Pull down and back with straight arms, externally rotating.",
    secondaryMuscles: ["Upper Back"]
  },
  {
    id: "rd8",
    name: "Prone Y Raise",
    muscleGroup: "Rear Delts",
    difficulty: "Beginner",
    equipment: "Bench, Light Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=qOI2gPBPw_I",
    cues: ["Lie face down", "Raise in Y shape", "Thumbs up"],
    instructions: "Lie face down on bench. Raise arms in Y shape with thumbs pointing up.",
    secondaryMuscles: ["Traps", "Lower Traps"]
  },
  {
    id: "rd9",
    name: "Seated Rear Delt Fly",
    muscleGroup: "Rear Delts",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=5dG6_8mhBWc",
    cues: ["Lean forward", "Fly arms out", "Squeeze at top"],
    instructions: "Sit on bench edge, lean forward. Raise dumbbells out to sides.",
    secondaryMuscles: ["Upper Back"]
  },
  {
    id: "rd10",
    name: "TRX Rear Delt Fly",
    muscleGroup: "Rear Delts",
    difficulty: "Intermediate",
    equipment: "TRX or Suspension Trainer",
    videoUrl: "https://www.youtube.com/watch?v=NNdX9HEwILc",
    cues: ["Lean back", "Open arms wide", "Body as resistance"],
    instructions: "Hold TRX handles and lean back. Open arms wide while keeping body straight.",
    secondaryMuscles: ["Core", "Upper Back"]
  },
  {
    id: "rd11",
    name: "Single Arm Rear Delt Cable",
    muscleGroup: "Rear Delts",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=1Uw2vMmv__U",
    cues: ["One arm at a time", "Pull across body", "Squeeze rear delt"],
    instructions: "Stand sideways to cable. Pull handle across body with straight arm.",
    secondaryMuscles: ["Upper Back"]
  },
  {
    id: "rd12",
    name: "Lying Rear Delt Raise",
    muscleGroup: "Rear Delts",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=kMc0QZKX9QE",
    cues: ["Lie on side", "Raise arm up", "Isolate rear delt"],
    instructions: "Lie on side with light dumbbell. Raise arm up keeping elbow slightly bent.",
    secondaryMuscles: []
  },

  // TRAPS - 8 exercises
  {
    id: "tp1",
    name: "Barbell Shrug",
    muscleGroup: "Traps",
    difficulty: "Beginner",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=cJRVVxmytaM",
    cues: ["Shoulders straight up", "No rolling", "Squeeze at top"],
    instructions: "Hold barbell in front. Shrug shoulders straight up toward ears.",
    secondaryMuscles: []
  },
  {
    id: "tp2",
    name: "Dumbbell Shrug",
    muscleGroup: "Traps",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=g6qbq4Lf1FI",
    cues: ["Hold at sides", "Shrug up", "Pause at top"],
    instructions: "Hold dumbbells at sides. Shrug shoulders up and squeeze.",
    secondaryMuscles: []
  },
  {
    id: "tp3",
    name: "Face Pulls",
    muscleGroup: "Traps",
    difficulty: "Beginner",
    equipment: "Cable Machine, Rope",
    videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
    cues: ["Pull to face", "External rotation", "Squeeze back"],
    instructions: "Pull rope toward face separating hands. Squeeze upper back.",
    secondaryMuscles: ["Rear Delts"]
  },
  {
    id: "tp4",
    name: "Farmer's Walk",
    muscleGroup: "Traps",
    difficulty: "Intermediate",
    equipment: "Dumbbells or Farmer Handles",
    videoUrl: "https://www.youtube.com/watch?v=Fkzk_RqlYig",
    cues: ["Heavy weight", "Shoulders back", "Walk with control"],
    instructions: "Hold heavy weights at sides. Walk with good posture.",
    secondaryMuscles: ["Grip", "Core"]
  },
  {
    id: "tp5",
    name: "Rack Pull",
    muscleGroup: "Traps",
    difficulty: "Intermediate",
    equipment: "Barbell, Rack",
    videoUrl: "https://www.youtube.com/watch?v=M8uP-rRXMgg",
    cues: ["Bar at knee height", "Pull and squeeze", "Upper back focus"],
    instructions: "Pull bar from rack at knee height. Squeeze traps at top.",
    secondaryMuscles: ["Back", "Glutes"]
  },
  {
    id: "tp6",
    name: "Behind Back Shrug",
    muscleGroup: "Traps",
    difficulty: "Intermediate",
    equipment: "Barbell or Smith Machine",
    videoUrl: "https://www.youtube.com/watch?v=9HgvxQsaK-Q",
    cues: ["Bar behind back", "Shrug up", "Different angle"],
    instructions: "Hold bar behind back. Shrug straight up.",
    secondaryMuscles: []
  },
  {
    id: "tp7",
    name: "Overhead Carry",
    muscleGroup: "Traps",
    difficulty: "Intermediate",
    equipment: "Dumbbells or Kettlebells",
    videoUrl: "https://www.youtube.com/watch?v=3ePxzlr47z4",
    cues: ["Arms locked overhead", "Walk with control", "Core tight"],
    instructions: "Hold weights overhead with locked arms. Walk maintaining position.",
    secondaryMuscles: ["Shoulders", "Core"]
  },
  {
    id: "tp8",
    name: "Cable Shrug",
    muscleGroup: "Traps",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    videoUrl: "https://www.youtube.com/watch?v=BvlXbBXVEWo",
    cues: ["Low cable", "Shrug up", "Constant tension"],
    instructions: "Stand over low cable. Shrug up against resistance.",
    secondaryMuscles: []
  },

  // FOREARMS - 8 exercises
  {
    id: "fa1",
    name: "Wrist Curl",
    muscleGroup: "Forearms",
    difficulty: "Beginner",
    equipment: "Barbell or Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=Y-9aHkHplKg",
    cues: ["Rest forearms on bench", "Curl wrists up", "Full range"],
    instructions: "Rest forearms on bench, palms up. Curl wrists up and down.",
    secondaryMuscles: []
  },
  {
    id: "fa2",
    name: "Reverse Wrist Curl",
    muscleGroup: "Forearms",
    difficulty: "Beginner",
    equipment: "Barbell or Dumbbells",
    videoUrl: "https://www.youtube.com/watch?v=FW6MvU7QDOU",
    cues: ["Palms down", "Extend wrists", "Control movement"],
    instructions: "Rest forearms on bench, palms down. Extend wrists up.",
    secondaryMuscles: []
  },
  {
    id: "fa3",
    name: "Farmer's Walk",
    muscleGroup: "Forearms",
    difficulty: "Intermediate",
    equipment: "Dumbbells or Farmer Handles",
    videoUrl: "https://www.youtube.com/watch?v=Fkzk_RqlYig",
    cues: ["Heavy weight", "Crush grip", "Walk distance"],
    instructions: "Hold heavy weights and walk. Focuses on grip strength.",
    secondaryMuscles: ["Traps", "Core"]
  },
  {
    id: "fa4",
    name: "Dead Hang",
    muscleGroup: "Forearms",
    difficulty: "Beginner",
    equipment: "Pull-up Bar",
    videoUrl: "https://www.youtube.com/watch?v=RVe3Xd1X4uc",
    cues: ["Full grip", "Hang as long as possible", "Grip endurance"],
    instructions: "Hang from bar with full grip. Hold as long as possible.",
    secondaryMuscles: []
  },
  {
    id: "fa5",
    name: "Plate Pinch",
    muscleGroup: "Forearms",
    difficulty: "Intermediate",
    equipment: "Weight Plates",
    videoUrl: "https://www.youtube.com/watch?v=A2tzAAnN_dY",
    cues: ["Pinch plates together", "Hold for time", "Finger strength"],
    instructions: "Pinch two plates together smooth sides out. Hold for time.",
    secondaryMuscles: []
  },
  {
    id: "fa6",
    name: "Wrist Roller",
    muscleGroup: "Forearms",
    difficulty: "Intermediate",
    equipment: "Wrist Roller",
    videoUrl: "https://www.youtube.com/watch?v=RDHtKUd7Cdk",
    cues: ["Arms extended", "Roll up and down", "Control tempo"],
    instructions: "Hold roller with arms extended. Roll weight up and down.",
    secondaryMuscles: []
  },
  {
    id: "fa7",
    name: "Behind Back Wrist Curl",
    muscleGroup: "Forearms",
    difficulty: "Beginner",
    equipment: "Barbell",
    videoUrl: "https://www.youtube.com/watch?v=TwD-YGVP4Bk",
    cues: ["Bar behind back", "Curl wrists", "Full range"],
    instructions: "Hold bar behind back. Curl wrists up and down.",
    secondaryMuscles: []
  },
  {
    id: "fa8",
    name: "Towel Pull Up",
    muscleGroup: "Forearms",
    difficulty: "Advanced",
    equipment: "Pull-up Bar, Towel",
    videoUrl: "https://www.youtube.com/watch?v=8lDw_6bRVqY",
    cues: ["Grip towel", "Pull up", "Extreme grip challenge"],
    instructions: "Drape towel over bar. Grip towel and perform pull ups.",
    secondaryMuscles: ["Back", "Biceps"]
  },
];

export const workoutPlans: WorkoutPlan[] = [
  {
    id: "1",
    title: "Beginner Full Body",
    daysPerWeek: 3,
    level: "Beginner",
    description: "Perfect for starting your journey. Hits every muscle group 3x a week.",
    duration: "45-60 min",
    schedule: [
      { day: "Monday", focus: "Full Body A", exercises: ["Squat", "Bench Press", "Row"] },
      { day: "Wednesday", focus: "Full Body B", exercises: ["Deadlift", "Overhead Press", "Pull Up"] },
      { day: "Friday", focus: "Full Body A", exercises: ["Squat", "Bench Press", "Row"] },
    ]
  },
  {
    id: "2",
    title: "Upper/Lower Split",
    daysPerWeek: 4,
    level: "Intermediate",
    description: "Focus on upper body one day, lower body the next.",
    duration: "60-75 min",
    schedule: [
      { day: "Monday", focus: "Upper Power", exercises: ["Bench Press", "Row", "OHP"] },
      { day: "Tuesday", focus: "Lower Power", exercises: ["Squat", "RDL", "Calves"] },
      { day: "Thursday", focus: "Upper Hypertrophy", exercises: ["Incline Press", "Pulldown", "Arms"] },
      { day: "Friday", focus: "Lower Hypertrophy", exercises: ["Leg Press", "Lunges", "Abs"] },
    ]
  },
  {
    id: "3",
    title: "Push Pull Legs",
    daysPerWeek: 6,
    level: "Advanced",
    description: "High volume split for maximum hypertrophy.",
    duration: "75-90 min",
    schedule: [
      { day: "Monday", focus: "Push", exercises: ["Bench", "OHP", "Triceps"] },
      { day: "Tuesday", focus: "Pull", exercises: ["Pullups", "Rows", "Biceps"] },
      { day: "Wednesday", focus: "Legs", exercises: ["Squat", "Lunges", "Calves"] },
      { day: "Thursday", focus: "Push", exercises: ["Incline", "Dips", "Lateral Raises"] },
      { day: "Friday", focus: "Pull", exercises: ["Pulldowns", "Face Pulls", "Hammer Curls"] },
      { day: "Saturday", focus: "Legs", exercises: ["Deadlift", "Leg Press", "Abs"] },
    ]
  },
  {
    id: "4",
    title: "HIIT Shred",
    daysPerWeek: 4,
    level: "Intermediate",
    description: "High intensity interval training for fat loss.",
    duration: "30-45 min"
  },
  {
    id: "5",
    title: "Home Workout",
    daysPerWeek: 3,
    level: "Beginner",
    description: "No equipment needed. Bodyweight mastery.",
    duration: "30-45 min"
  }
];

export const recipes: Recipe[] = [
  {
    id: "1",
    name: "High Protein Chicken Stir Fry",
    calories: 450,
    protein: 45,
    carbs: 35,
    fats: 12,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    ingredients: ["200g Chicken Breast", "1 Cup Veggies", "1 tbsp Soy Sauce"],
    instructions: ["Cut chicken into cubes", "Stir fry with veggies", "Add sauce"],
    tags: ["High-protein", "Fat-loss friendly", "Non-veg"],
    videoUrl: "https://youtube.com"
  },
  {
    id: "2",
    name: "Paneer Bhurji",
    calories: 380,
    protein: 22,
    carbs: 10,
    fats: 25,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    ingredients: ["200g Paneer", "Onion", "Tomato", "Spices"],
    instructions: ["Crumble paneer", "Saute onion and tomato", "Mix spices and paneer"],
    tags: ["Vegetarian", "High-protein", "Indian cuisine"],
    videoUrl: "https://youtube.com"
  },
  {
    id: "3",
    name: "Protein Oats",
    calories: 350,
    protein: 25,
    carbs: 45,
    fats: 10,
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Oats", "Whey Protein", "Almond Milk", "Chia Seeds"],
    instructions: ["Mix oats and milk", "Add whey", "Top with seeds"],
    tags: ["Vegetarian", "Meal prep friendly", "Breakfast"],
    videoUrl: "https://youtube.com"
  },
  {
    id: "4",
    name: "Chicken Tikka",
    calories: 320,
    protein: 40,
    carbs: 5,
    fats: 15,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Chicken breast", "Yogurt", "Tikka masala"],
    instructions: ["Marinate chicken", "Grill or bake", "Serve with lemon"],
    tags: ["High-protein", "Fat-loss friendly", "Non-veg", "Indian cuisine"],
    videoUrl: "https://youtube.com"
  },
  {
    id: "5",
    name: "Sprouts Chaat",
    calories: 200,
    protein: 15,
    carbs: 30,
    fats: 2,
    image: "https://images.unsplash.com/photo-1606491956689-2ea28c674675?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Moong sprouts", "Onion", "Tomato", "Chaat masala"],
    instructions: ["Steam sprouts", "Mix veggies", "Add spices"],
    tags: ["Vegetarian", "Fat-loss friendly", "Indian cuisine", "Snack"],
    videoUrl: "https://youtube.com"
  }
];

export const mockProfile: UserProfile = {
  name: "Alex Runner",
  age: 28,
  gender: "Male",
  weight: 78,
  height: 180,
  goal: "Muscle Gain",
  activityLevel: "Moderate",
  experience: "Intermediate"
};

export const mockStreak: StreakData = {
  currentStreak: 12,
  longestStreak: 45,
  lastLogDate: new Date().toISOString(),
  history: [
    { date: "2023-10-20", workoutDone: true, dietDone: true },
    { date: "2023-10-21", workoutDone: true, dietDone: false },
    { date: "2023-10-22", workoutDone: true, dietDone: true },
  ]
};

export const adminData: AdminData = {
  dailyTargets: {
    calories: 2800,
    protein: 200,
    carbs: 300,
    fats: 80
  },
  currentPlanId: "3",
  nextSessionDate: new Date(Date.now() + 86400000).toISOString(),
  programStartDate: "2023-10-01",
  programEndDate: "2023-12-31",
  todaysWorkout: {
    focus: "Push (Chest & Triceps)",
    duration: "60 mins",
    exercises: [
      { id: "c1", name: "Barbell Bench Press", sets: 4, reps: "8-10", rest: "90s" },
      { id: "s1", name: "Overhead Press", sets: 3, reps: "8-12", rest: "90s" },
      { id: "c2", name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60s" },
      { id: "c3", name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60s" },
      { id: "tr1", name: "Tricep Pushdown", sets: 4, reps: "12-15", rest: "60s" },
    ]
  }
};

export const mockDailyLog: DailyLog = {
  date: new Date().toISOString().split('T')[0],
  caloriesConsumed: 1450,
  proteinConsumed: 110,
  carbsConsumed: 150,
  fatsConsumed: 45,
  workoutCompleted: false
};
