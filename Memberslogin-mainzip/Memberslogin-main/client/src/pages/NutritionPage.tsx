import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recipes } from "@/lib/mockData";
import {
  Calculator,
  Utensils,
  Zap,
  Plus,
  X,
  Video,
  Save,
  Check,
  Trash2,
  Cloud,
  BookOpen,
  Clock,
  ArrowRight,
  Leaf,
  Beef,
  Timer,
  TrendingUp,
  ChefHat,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { submitNutrition } from "@/lib/googleSheetsApi";

const DAILY_LOG_KEY = "capsfitness_daily_log";

interface FoodEntry {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  timestamp: number;
}

interface DailyLog {
  date: string;
  entries: FoodEntry[];
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatsConsumed: number;
}

const foodDatabase: Record<
  string,
  {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
    defaultUnit: string;
    servingSize: number;
  }
> = {
  Paneer: {
    protein: 18,
    carbs: 4,
    fats: 22,
    calories: 265,
    defaultUnit: "g",
    servingSize: 100,
  },
  Chapati: {
    protein: 3,
    carbs: 18,
    fats: 4,
    calories: 120,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Paratha: {
    protein: 4,
    carbs: 30,
    fats: 10,
    calories: 220,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Idli: {
    protein: 2,
    carbs: 12,
    fats: 0.5,
    calories: 60,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Dosa: {
    protein: 4,
    carbs: 28,
    fats: 5,
    calories: 170,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Poha: {
    protein: 3,
    carbs: 25,
    fats: 4,
    calories: 150,
    defaultUnit: "bowl",
    servingSize: 1,
  },
  Upma: {
    protein: 4,
    carbs: 22,
    fats: 6,
    calories: 160,
    defaultUnit: "bowl",
    servingSize: 1,
  },
  Rajma: {
    protein: 9,
    carbs: 23,
    fats: 0.5,
    calories: 127,
    defaultUnit: "g",
    servingSize: 100,
  },
  Chole: {
    protein: 8,
    carbs: 27,
    fats: 3,
    calories: 164,
    defaultUnit: "g",
    servingSize: 100,
  },
  Dal: {
    protein: 9,
    carbs: 20,
    fats: 1,
    calories: 116,
    defaultUnit: "g",
    servingSize: 100,
  },
  Sprouts: {
    protein: 7,
    carbs: 12,
    fats: 1,
    calories: 80,
    defaultUnit: "g",
    servingSize: 100,
  },
  Omelette: {
    protein: 12,
    carbs: 1,
    fats: 10,
    calories: 140,
    defaultUnit: "eggs",
    servingSize: 2,
  },
  "Chicken Curry": {
    protein: 25,
    carbs: 8,
    fats: 12,
    calories: 240,
    defaultUnit: "g",
    servingSize: 150,
  },
  "Fish Fry": {
    protein: 20,
    carbs: 5,
    fats: 10,
    calories: 180,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Curd: {
    protein: 4,
    carbs: 5,
    fats: 3,
    calories: 60,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Whey Scoop": {
    protein: 24,
    carbs: 3,
    fats: 1,
    calories: 120,
    defaultUnit: "scoop",
    servingSize: 1,
  },
  Eggs: {
    protein: 6,
    carbs: 1,
    fats: 5,
    calories: 70,
    defaultUnit: "piece",
    servingSize: 1,
  },
  "Chicken Breast": {
    protein: 31,
    carbs: 0,
    fats: 3.6,
    calories: 165,
    defaultUnit: "g",
    servingSize: 100,
  },
  Rice: {
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    calories: 130,
    defaultUnit: "g",
    servingSize: 100,
  },
  Banana: {
    protein: 1.3,
    carbs: 27,
    fats: 0.4,
    calories: 105,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Milk: {
    protein: 3.4,
    carbs: 5,
    fats: 3.6,
    calories: 60,
    defaultUnit: "ml",
    servingSize: 100,
  },
  Almonds: {
    protein: 21,
    carbs: 22,
    fats: 50,
    calories: 579,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Peanut Butter": {
    protein: 25,
    carbs: 20,
    fats: 50,
    calories: 588,
    defaultUnit: "tbsp",
    servingSize: 2,
  },
  Oats: {
    protein: 13,
    carbs: 68,
    fats: 7,
    calories: 389,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Brown Rice": {
    protein: 2.6,
    carbs: 23,
    fats: 0.9,
    calories: 111,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Boiled Egg": {
    protein: 6,
    carbs: 1,
    fats: 5,
    calories: 70,
    defaultUnit: "piece",
    servingSize: 1,
  },
  "Egg Whites": {
    protein: 11,
    carbs: 1,
    fats: 0,
    calories: 52,
    defaultUnit: "eggs",
    servingSize: 2,
  },
  "Cooked Oats": {
    protein: 6,
    carbs: 28,
    fats: 3,
    calories: 154,
    defaultUnit: "cup",
    servingSize: 1,
  },
  "Veg Salad": {
    protein: 2,
    carbs: 10,
    fats: 0,
    calories: 50,
    defaultUnit: "bowl",
    servingSize: 1,
  },
  "Grilled Chicken": {
    protein: 31,
    carbs: 0,
    fats: 4,
    calories: 165,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Multigrain Roti": {
    protein: 4,
    carbs: 17,
    fats: 3,
    calories: 110,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Khichdi: {
    protein: 7,
    carbs: 28,
    fats: 3,
    calories: 160,
    defaultUnit: "bowl",
    servingSize: 1,
  },
  "Mixed Veg Sabzi": {
    protein: 3,
    carbs: 12,
    fats: 4,
    calories: 100,
    defaultUnit: "bowl",
    servingSize: 1,
  },
  Apple: {
    protein: 0.3,
    carbs: 25,
    fats: 0.2,
    calories: 95,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Orange: {
    protein: 1,
    carbs: 15,
    fats: 0.2,
    calories: 62,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Grapes: {
    protein: 1,
    carbs: 18,
    fats: 0.2,
    calories: 69,
    defaultUnit: "cup",
    servingSize: 1,
  },
  "Brown Bread": {
    protein: 4,
    carbs: 20,
    fats: 1,
    calories: 110,
    defaultUnit: "slice",
    servingSize: 2,
  },
  "White Bread": {
    protein: 3,
    carbs: 24,
    fats: 1,
    calories: 120,
    defaultUnit: "slice",
    servingSize: 2,
  },
  "Peanut Chikki": {
    protein: 5,
    carbs: 17,
    fats: 7,
    calories: 140,
    defaultUnit: "piece",
    servingSize: 1,
  },
  Tofu: {
    protein: 8,
    carbs: 2,
    fats: 4,
    calories: 76,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Soya Chunks": {
    protein: 52,
    carbs: 33,
    fats: 0.5,
    calories: 345,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Sweet Potato": {
    protein: 2,
    carbs: 20,
    fats: 0,
    calories: 86,
    defaultUnit: "g",
    servingSize: 100,
  },
  Corn: {
    protein: 3.5,
    carbs: 19,
    fats: 1.5,
    calories: 86,
    defaultUnit: "cup",
    servingSize: 1,
  },
  Buttermilk: {
    protein: 3,
    carbs: 5,
    fats: 1,
    calories: 40,
    defaultUnit: "ml",
    servingSize: 100,
  },
  "Green Tea": {
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
    defaultUnit: "cup",
    servingSize: 1,
  },
};

const unitOptions = [
  "g",
  "ml",
  "oz",
  "cup",
  "tbsp",
  "tsp",
  "piece",
  "scoop",
  "bowl",
  "eggs",
];

interface ProteinHackBlog {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      content: string;
      tips?: string[];
    }[];
    conclusion: string;
  };
}

const proteinHackBlogs: ProteinHackBlog[] = [
  {
    id: "hit-100g-protein",
    title: "20 Ways to Hit 100g Protein Daily",
    subtitle: "Budget-friendly strategies for hitting your protein targets",
    readTime: "8 min read",
    category: "Protein Goals",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-emerald-500 to-teal-600",
    excerpt:
      "Struggling to hit your protein goals? These 20 proven strategies will help you consistently reach 100g+ protein without expensive supplements or boring meals.",
    content: {
      intro:
        "Getting enough protein is crucial for muscle building, recovery, and overall health. But hitting 100g daily can feel overwhelming, especially on a budget. Here are 20 practical ways to boost your protein intake naturally.",
      sections: [
        {
          heading: "Start Your Day Strong",
          content:
            "Front-load your protein in the morning to set yourself up for success. A protein-rich breakfast keeps you satisfied and makes hitting your daily target easier.",
          tips: [
            "4 whole eggs = 24g protein (cheapest protein source)",
            "Greek yogurt parfait with nuts = 25g protein",
            "Protein oatmeal (oats + whey + peanut butter) = 35g protein",
            "Besan chilla with paneer filling = 22g protein",
            "Moong dal cheela with egg = 28g protein",
          ],
        },
        {
          heading: "Smart Snacking Strategies",
          content:
            "Turn snack time into protein time. Small additions throughout the day add up significantly.",
          tips: [
            "Roasted chana (1 cup) = 15g protein",
            "Handful of almonds (30g) = 6g protein",
            "Cottage cheese (paneer) cubes = 14g per 100g",
            "Sprouts chaat = 12g protein",
            "Hard-boiled eggs (keep 2-3 ready) = 12-18g protein",
          ],
        },
        {
          heading: "Maximize Your Meals",
          content:
            "Structure your main meals around protein sources first, then add carbs and fats.",
          tips: [
            "Chicken breast (150g) = 46g protein",
            "Dal + rice combo = 18g protein",
            "Rajma or chole (1.5 cups) = 22g protein",
            "Fish curry (150g fish) = 32g protein",
            "Soya chunks (50g dry) = 26g protein",
          ],
        },
        {
          heading: "Budget-Friendly Protein Powerhouses",
          content:
            "You dont need expensive supplements. These affordable options pack serious protein.",
          tips: [
            "Eggs: Rs. 7-8 per egg, 6g protein each",
            "Soya chunks: Rs. 60-80/kg, 52g protein per 100g",
            "Dal (any variety): Rs. 100-150/kg, 24g protein per 100g",
            "Peanuts: Rs. 120/kg, 26g protein per 100g",
            "Milk: Rs. 60/L, 34g protein per liter",
          ],
        },
      ],
      conclusion:
        "Hitting 100g protein daily is achievable with planning. Track your first few days to understand your patterns, then make it automatic. Your muscles will thank you!",
    },
  },
  {
    id: "vegetarian-protein",
    title: "Complete Guide to Vegetarian Protein",
    subtitle: "Build muscle without meat using these plant powerhouses",
    readTime: "10 min read",
    category: "Vegetarian",
    icon: <Leaf className="w-5 h-5" />,
    color: "from-green-500 to-lime-600",
    excerpt:
      "Think you need meat to build muscle? Think again. This comprehensive guide shows vegetarians how to optimize protein intake for maximum gains.",
    content: {
      intro:
        "Being vegetarian doesnt mean compromising on protein. With the right combinations and knowledge, you can hit all your protein targets and build impressive muscle. Lets dive into the science and practice of vegetarian protein.",
      sections: [
        {
          heading: "Understanding Complete vs Incomplete Proteins",
          content:
            'Animal proteins contain all 9 essential amino acids. Most plant proteins are "incomplete" - missing one or more. The solution? Combine different plant sources to create complete proteins.',
          tips: [
            "Dal + Rice = Complete protein (classic Indian combo)",
            "Rajma + Roti = Complete protein",
            "Peanut butter + Whole wheat bread = Complete protein",
            "Hummus + Pita = Complete protein",
            "Tofu + Quinoa = Complete protein",
          ],
        },
        {
          heading: "Top 10 Vegetarian Protein Sources",
          content:
            "These should be staples in your diet. Learn to love them and your gains will follow.",
          tips: [
            "Paneer: 18g per 100g - versatile and delicious",
            "Soya chunks: 52g per 100g (dry) - the veg chicken",
            "Greek yogurt: 10g per 100g - great for smoothies",
            "Lentils (dal): 24g per 100g - daily essential",
            "Chickpeas (chole): 19g per 100g - fiber bonus",
            "Quinoa: 14g per 100g - complete protein grain",
            "Tofu: 17g per 100g - absorbs any flavor",
            "Tempeh: 19g per 100g - fermented soy goodness",
            "Edamame: 11g per 100g - perfect snack",
            "Seitan: 25g per 100g - wheat protein",
          ],
        },
        {
          heading: "Sample High-Protein Vegetarian Day",
          content: "Heres what 120g+ protein looks like without any meat.",
          tips: [
            "Breakfast: Paneer bhurji (2 eggs worth paneer) + 2 rotis = 28g",
            "Mid-morning: Greek yogurt + almonds = 18g",
            "Lunch: Soya chunk curry + rice + dal = 38g",
            "Snack: Roasted chana + protein shake = 28g",
            "Dinner: Chole + roti + raita = 24g",
            "TOTAL: 136g protein - completely vegetarian!",
          ],
        },
        {
          heading: "Bioavailability Matters",
          content:
            "Not all protein is absorbed equally. Here is how to maximize absorption from plant sources.",
          tips: [
            "Soak legumes overnight - reduces anti-nutrients",
            "Sprout your beans - increases protein availability by 20%",
            "Combine with Vitamin C - enhances iron and protein absorption",
            "Fermented foods (curd, tempeh) - pre-digested proteins",
            "Avoid excess fiber with protein meals - can reduce absorption",
          ],
        },
      ],
      conclusion:
        "Vegetarian bodybuilding is not just possible - its thriving. With strategic food combinations and proper planning, you can build just as much muscle as any meat-eater. The key is consistency and variety.",
    },
  },
  {
    id: "protein-timing",
    title: "Protein Timing: When to Eat for Maximum Gains",
    subtitle: "Optimize your protein intake around workouts",
    readTime: "6 min read",
    category: "Science",
    icon: <Timer className="w-5 h-5" />,
    color: "from-blue-500 to-indigo-600",
    excerpt:
      "Does protein timing really matter? Learn the science behind when to eat protein for optimal muscle protein synthesis and recovery.",
    content: {
      intro:
        'Youve heard about the "anabolic window" - but is it real? Lets separate fact from fiction and understand what science actually says about protein timing for muscle growth.',
      sections: [
        {
          heading: "The Anabolic Window: Myth or Reality?",
          content:
            "The old belief that you MUST eat protein within 30 minutes of training is largely overblown. Research shows the anabolic window is actually 4-6 hours around your workout.",
          tips: [
            "Pre-workout meal protein stays elevated during training",
            "Post-workout window is 2-3 hours, not 30 minutes",
            "Total daily protein matters MORE than timing",
            "Fasted training may benefit from faster post-workout nutrition",
            "Dont stress about exact timing - focus on consistency",
          ],
        },
        {
          heading: "Optimal Protein Distribution",
          content:
            "How you spread protein throughout the day impacts muscle protein synthesis (MPS). Heres the science-backed approach.",
          tips: [
            "Aim for 20-40g protein per meal (dose-response peaks here)",
            "Eat protein every 3-4 hours for consistent MPS elevation",
            "4-5 protein feedings per day is optimal for most",
            "Larger doses (40g+) are fine but offer diminishing returns",
            "Spreading beats piling - 4x30g > 2x60g for MPS",
          ],
        },
        {
          heading: "Pre-Workout Protein Strategy",
          content:
            "What and when to eat before training for optimal performance and gains.",
          tips: [
            "2-3 hours before: Full meal with 30-40g protein",
            "1 hour before: Light meal with 20-25g protein",
            "30 min before: Whey shake if training fasted",
            "Slow proteins (casein, meat) for longer sessions",
            "Fast proteins (whey, eggs) for shorter windows",
          ],
        },
        {
          heading: "Post-Workout Nutrition",
          content:
            "Recovery starts the moment your workout ends. Heres how to maximize it.",
          tips: [
            "Within 2 hours: 30-40g protein for optimal MPS",
            "Combine with carbs for insulin spike (helps protein uptake)",
            "Whey protein is fastest absorbing - ideal post-workout",
            "Whole foods work just as well if timing permits",
            "Dont forget hydration - protein synthesis needs water",
          ],
        },
        {
          heading: "Before Bed: The Overlooked Opportunity",
          content:
            "Nighttime is prime recovery time. Feed your muscles while you sleep.",
          tips: [
            "Casein protein before bed - slow release over 7-8 hours",
            "Greek yogurt or cottage cheese - natural casein sources",
            "30-40g protein before sleep supports overnight recovery",
            "Avoid large meals - focus on protein-rich snacks",
            "This can add 10-15% to your muscle protein synthesis",
          ],
        },
      ],
      conclusion:
        "While total daily protein is king, optimizing timing can give you an extra edge. Spread your protein across 4-5 meals, prioritize around training, and dont forget your pre-sleep protein. Small optimizations compound into big results.",
    },
  },
  {
    id: "high-protein-indian",
    title: "High-Protein Indian Cooking Hacks",
    subtitle: "Traditional recipes with a protein twist",
    readTime: "7 min read",
    category: "Recipes",
    icon: <ChefHat className="w-5 h-5" />,
    color: "from-orange-500 to-amber-600",
    excerpt:
      "Love Indian food but struggling with protein? These cooking hacks will transform your favorite dishes into muscle-building meals.",
    content: {
      intro:
        "Indian cuisine is rich in flavor but often carb-heavy. With a few smart modifications, you can keep the taste while dramatically boosting the protein content of your favorite dishes.",
      sections: [
        {
          heading: "Protein-Boosted Breakfast Ideas",
          content: "Start your day the high-protein Indian way.",
          tips: [
            "Besan Chilla Upgrade: Add 2 eggs to batter = +12g protein",
            "Poha Power: Mix in soya granules = +15g protein",
            "Upma Hack: Add paneer cubes and peanuts = +18g protein",
            "Dosa Twist: Fill with egg bhurji instead of potato = +12g protein",
            "Paratha Plus: Stuff with paneer + sprouts = +20g protein",
          ],
        },
        {
          heading: "Lunch and Dinner Transformations",
          content:
            "Turn regular meals into protein powerhouses without sacrificing taste.",
          tips: [
            "Replace half the rice with soya chunks = +26g protein",
            "Add paneer to any vegetable curry = +14g protein",
            "Use double dal in dal-rice = +12g protein",
            "Protein roti: Mix besan with wheat flour = +8g per 2 rotis",
            "Curd rice: Use Greek yogurt instead = +10g protein",
          ],
        },
        {
          heading: "Protein-Rich Curry Bases",
          content: "These curry modifications work with any dish.",
          tips: [
            "Cashew paste instead of onion paste = more healthy fats + protein",
            "Add peanut butter to gravies = +8g per tbsp",
            "Use hung curd as curry base = creamy + protein-rich",
            "Blend silken tofu into sauces = invisible protein boost",
            "Soya milk in curries = dairy-free protein addition",
          ],
        },
        {
          heading: "Snack Upgrades",
          content: "Indian snacks can be protein bombs with these tweaks.",
          tips: [
            "Roasted makhana with protein powder dust = +24g",
            "Chana chaat with extra chana = 20g protein",
            "Paneer tikka as evening snack = 18g protein",
            "Sprouted moong namkeen = 15g protein",
            "Besan ladoo (skip sugar, add protein powder) = gym fuel",
          ],
        },
        {
          heading: "Protein Lassi and Drinks",
          content: "Traditional drinks with a protein makeover.",
          tips: [
            "Protein Lassi: Curd + whey + banana = 35g protein",
            "Sattu Sharbat: Natural 20g protein drink",
            "Badam Milk: Add protein powder = 30g protein",
            "Buttermilk + protein = refreshing 25g protein drink",
            "Masala Chai Protein: Add collagen powder = +10g protein",
          ],
        },
      ],
      conclusion:
        "Indian food and high protein goals are not mutually exclusive. With these simple swaps and additions, you can enjoy your favorite cuisines while building the body you want. The best diet is one you can stick to - and nothing beats the comfort of ghar ka khana!",
    },
  },
  {
    id: "protein-myths",
    title: "7 Protein Myths Debunked",
    subtitle: "Stop believing these common misconceptions",
    readTime: "5 min read",
    category: "Education",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-purple-500 to-pink-600",
    excerpt:
      'From kidney damage fears to the "30g limit" myth, lets bust the most common protein misconceptions holding you back from your goals.',
    content: {
      intro:
        "Misinformation about protein is everywhere. These myths can sabotage your progress and cause unnecessary worry. Lets set the record straight with science-backed facts.",
      sections: [
        {
          heading: "Myth 1: High Protein Damages Your Kidneys",
          content:
            "This is perhaps the most persistent myth. The truth? For healthy individuals, high protein intake (even 2-3g per kg bodyweight) shows no kidney damage in research. This concern only applies to those with pre-existing kidney disease.",
          tips: [
            "Studies up to 4.4g/kg showed no kidney issues in healthy adults",
            "Your kidneys are designed to filter protein byproducts",
            "Stay hydrated to support kidney function",
            "Get regular checkups if youre concerned",
            "Pre-existing conditions require medical guidance",
          ],
        },
        {
          heading: "Myth 2: You Can Only Absorb 30g Protein Per Meal",
          content:
            "Your body doesnt waste excess protein. It simply takes longer to digest and absorb larger amounts. The 30g limit is about optimal MPS per meal, not absorption capacity.",
          tips: [
            "Your body absorbs nearly 100% of protein you eat",
            "Larger doses digest more slowly but still get used",
            "30-40g optimizes muscle protein synthesis per meal",
            "Intermittent fasters absorb large protein doses fine",
            "Spread protein for convenience, not because of limits",
          ],
        },
        {
          heading: "Myth 3: Plant Protein Cant Build Muscle",
          content:
            "Completely false. While plant proteins may have lower leucine content, eating adequate amounts and combining sources builds muscle just as effectively.",
          tips: [
            "Eat 10-20% more plant protein to match animal protein",
            "Combine sources for complete amino acid profiles",
            "Many successful bodybuilders are fully plant-based",
            "Soy protein is nearly equivalent to whey in studies",
            "Variety is key - dont rely on single sources",
          ],
        },
        {
          heading: "Myth 4: You Need Protein Immediately After Training",
          content:
            'The "anabolic window" is much larger than 30 minutes. Total daily protein matters far more than post-workout timing.',
          tips: [
            "The real window is 4-6 hours around your workout",
            "Pre-workout meal protein counts toward this window",
            "Stressing about timing causes more harm than imperfect timing",
            "Focus on daily totals first, then optimize timing",
            "Consistency beats perfection",
          ],
        },
        {
          heading: "Myth 5: More Protein = More Muscle",
          content:
            "Theres a ceiling. Beyond 1.6-2.2g per kg bodyweight, extra protein doesnt build more muscle. It just gets used for energy.",
          tips: [
            "1.6-2.2g/kg is the research-backed sweet spot",
            "Beginners may benefit from higher end (2.2g/kg)",
            "Excess protein = expensive calories, not extra muscle",
            "Better to hit 1.6g consistently than 2.5g inconsistently",
            "During cuts, aim for 2.2g+ to preserve muscle",
          ],
        },
        {
          heading: "Myth 6: Protein Powders Are Steroids/Harmful",
          content:
            "Protein powder is just food - dried and powdered dairy (whey) or plants (pea, soy). Theres nothing magical or harmful about it.",
          tips: [
            "Whey is a byproduct of cheese making",
            'Its as "natural" as milk or paneer',
            "Choose reputable brands with third-party testing",
            "Whole foods are ideal but powders are convenient",
            "No hormones or steroids in quality protein powders",
          ],
        },
        {
          heading: "Myth 7: High Protein Causes Bone Loss",
          content:
            "Old research misinterpreted. High protein actually IMPROVES bone density when calcium intake is adequate.",
          tips: [
            "Protein provides the building blocks for bone matrix",
            "Higher protein = better calcium absorption",
            "Athletes with high protein have stronger bones",
            "Ensure adequate calcium (1000mg/day) and Vitamin D",
            "Weight training + protein = optimal bone health",
          ],
        },
      ],
      conclusion:
        "Dont let myths hold you back. High protein intake is safe, effective, and essential for anyone looking to build or maintain muscle. Trust the science, not the bro-science, and focus on hitting your daily targets consistently.",
    },
  },
];

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getEmptyLog(): DailyLog {
  return {
    date: getTodayKey(),
    entries: [],
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatsConsumed: 0,
  };
}

export default function NutritionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [macroInput, setMacroInput] = useState("");
  const [calculatedMacros, setCalculatedMacros] = useState<{
    p: number;
    c: number;
    f: number;
    cal: number;
    name: string;
  } | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog>(getEmptyLog());
  const [activeTab, setActiveTab] = useState<string>("calculator");

  const [portionQuantity, setPortionQuantity] = useState<number>(1);
  const [portionUnit, setPortionUnit] = useState<string>("serving");

  // Read URL tab parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["calculator", "recipes", "hacks"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const targets = {
    calories: user?.calorieTarget || 2000,
    protein: user?.proteinTarget || 150,
    carbs: user?.carbsTarget || 200,
    fats: user?.fatsTarget || 65,
  };

  const indianPresets = [
    "Dal",
    "Sprouts",
    "Omelette",
    "Chicken Curry",
    "Fish Fry",
    "Curd",
    "Whey Scoop",
    "Brown Rice",
    "Boiled Egg",
    "Egg Whites",
    "Cooked Oats",
    "Veg Salad",
    "Grilled Chicken",
    "Multigrain Roti",
    "Khichdi",
    "Mixed Veg Sabzi",
    "Apple",
    "Orange",
    "Grapes",
    "Brown Bread",
    "White Bread",
    "Peanut Chikki",
    "Tofu",
    "Soya Chunks",
    "Sweet Potato",
    "Corn",
    "Buttermilk",
    "Green Tea",
  ];

  useEffect(() => {
    const stored = localStorage.getItem(DAILY_LOG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as DailyLog;
      if (parsed.date === getTodayKey()) {
        setDailyLog(parsed);
      } else {
        localStorage.setItem(DAILY_LOG_KEY, JSON.stringify(getEmptyLog()));
      }
    }
  }, []);

  const saveDailyLog = (log: DailyLog) => {
    localStorage.setItem(DAILY_LOG_KEY, JSON.stringify(log));
    setDailyLog(log);
  };

  const calculateFromInput = (
    input: string,
  ): { p: number; c: number; f: number; cal: number } => {
    let totalP = 0,
      totalC = 0,
      totalF = 0,
      totalCal = 0;

    const items = input.split(",").map((item) => item.trim().toLowerCase());

    for (const item of items) {
      const quantityMatch = item.match(
        /^(\d+\.?\d*)\s*(g|ml|oz|cup|cups|piece|pieces|scoop|scoops|bowl|bowls|eggs?|tbsp|tsp)?\s*/i,
      );
      let quantity = 1;
      let cleanItem = item;

      if (quantityMatch) {
        quantity = parseFloat(quantityMatch[1]) || 1;
        cleanItem = item.replace(quantityMatch[0], "").trim();
      }

      for (const [foodName, data] of Object.entries(foodDatabase)) {
        if (
          cleanItem.toLowerCase().includes(foodName.toLowerCase()) ||
          foodName.toLowerCase().includes(cleanItem)
        ) {
          const multiplier = quantity / data.servingSize;
          totalP += data.protein * multiplier;
          totalC += data.carbs * multiplier;
          totalF += data.fats * multiplier;
          totalCal += data.calories * multiplier;
          break;
        }
      }
    }

    if (totalCal === 0 && input.length > 0) {
      const baseMultiplier = Math.min(input.length / 10, 3);
      totalP = Math.round(15 * baseMultiplier);
      totalC = Math.round(20 * baseMultiplier);
      totalF = Math.round(8 * baseMultiplier);
      totalCal = Math.round(totalP * 4 + totalC * 4 + totalF * 9);
    }

    return {
      p: Math.round(totalP * portionQuantity),
      c: Math.round(totalC * portionQuantity),
      f: Math.round(totalF * portionQuantity),
      cal: Math.round(totalCal * portionQuantity),
    };
  };

  const handleCalculate = () => {
    if (!macroInput.trim()) {
      toast({
        title: "Enter food items",
        description: "Please type what you ate to calculate macros.",
        variant: "destructive",
      });
      return;
    }

    const macros = calculateFromInput(macroInput);
    setCalculatedMacros({
      ...macros,
      name: macroInput,
    });
  };

  const handleAddToLog = async () => {
    if (!calculatedMacros) return;

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: calculatedMacros.name,
      quantity: portionQuantity,
      unit: portionUnit,
      protein: calculatedMacros.p,
      carbs: calculatedMacros.c,
      fats: calculatedMacros.f,
      calories: calculatedMacros.cal,
      timestamp: Date.now(),
    };

    const updatedLog: DailyLog = {
      ...dailyLog,
      entries: [...dailyLog.entries, newEntry],
      caloriesConsumed: dailyLog.caloriesConsumed + newEntry.calories,
      proteinConsumed: dailyLog.proteinConsumed + newEntry.protein,
      carbsConsumed: dailyLog.carbsConsumed + newEntry.carbs,
      fatsConsumed: dailyLog.fatsConsumed + newEntry.fats,
    };

    saveDailyLog(updatedLog);
    setMacroInput("");
    setCalculatedMacros(null);
    setPortionQuantity(1);
    setPortionUnit("serving");

    let syncSuccess = false;
    if (user?.userId) {
      try {
        const result = await submitNutrition(user.userId, getTodayKey(), [
          {
            name: newEntry.name,
            calories: newEntry.calories,
            protein: newEntry.protein,
            carbs: newEntry.carbs,
            fats: newEntry.fats,
          },
        ]);
        syncSuccess = result?.ok === true;
      } catch (error) {
        console.error("Failed to sync nutrition to cloud:", error);
      }
    }

    toast({
      title: "Added to daily log",
      description: syncSuccess
        ? `${newEntry.name} (${newEntry.calories} cal) synced to cloud.`
        : `${newEntry.name} (${newEntry.calories} cal) saved locally.`,
    });
  };

  const handleRemoveEntry = (entryId: string) => {
    const entry = dailyLog.entries.find((e) => e.id === entryId);
    if (!entry) return;

    const updatedLog: DailyLog = {
      ...dailyLog,
      entries: dailyLog.entries.filter((e) => e.id !== entryId),
      caloriesConsumed: dailyLog.caloriesConsumed - entry.calories,
      proteinConsumed: dailyLog.proteinConsumed - entry.protein,
      carbsConsumed: dailyLog.carbsConsumed - entry.carbs,
      fatsConsumed: dailyLog.fatsConsumed - entry.fats,
    };

    saveDailyLog(updatedLog);
    toast({
      title: "Removed from log",
      description: `${entry.name} removed from your daily log.`,
    });
  };

  const progressPercent = (consumed: number, target: number) => {
    return Math.min((consumed / target) * 100, 100);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">
            NUTRITION <span className="text-neon-green">HUB</span>
          </h1>
          <p className="text-muted-foreground">
            Fuel your body with precision.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-black/40 border border-white/10 p-1">
            <TabsTrigger
              value="calculator"
              className="data-[state=active]:bg-neon-green data-[state=active]:text-black"
            >
              MACRO CALC
            </TabsTrigger>
            <TabsTrigger
              value="recipes"
              className="data-[state=active]:bg-neon-green data-[state=active]:text-black"
            >
              RECIPES
            </TabsTrigger>
            <TabsTrigger
              value="hacks"
              className="data-[state=active]:bg-neon-green data-[state=active]:text-black"
            >
              PROTEIN HACKS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Dialog key={recipe.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer overflow-hidden bg-card/40 border-white/5 hover:border-neon-green/50 transition-all group">
                      <div className="h-48 relative">
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                          <h3 className="text-lg font-bold text-white leading-tight">
                            {recipe.name}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-muted-foreground">CAL</p>
                            <p className="font-bold text-white">
                              {recipe.calories}
                            </p>
                          </div>
                          <div className="bg-neon-green/10 rounded p-2 border border-neon-green/20">
                            <p className="text-xs text-neon-green">PRO</p>
                            <p className="font-bold text-neon-green">
                              {recipe.protein}g
                            </p>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-muted-foreground">
                              CARB
                            </p>
                            <p className="font-bold text-white">
                              {recipe.carbs}g
                            </p>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-muted-foreground">FAT</p>
                            <p className="font-bold text-white">
                              {recipe.fats}g
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full border-neon-green/50 text-neon-green font-bold hover:bg-neon-green hover:text-black"
                        >
                          VIEW RECIPE
                        </Button>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-display font-bold text-white">
                        {recipe.name}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        {recipe.tags.join(" • ")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="relative h-64 rounded-xl overflow-hidden">
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          {recipe.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Calories
                          </p>
                          <p className="text-xl font-bold">{recipe.calories}</p>
                        </div>
                        <div className="p-3 bg-neon-green/10 border border-neon-green/20 rounded-lg">
                          <p className="text-sm text-neon-green">Protein</p>
                          <p className="text-xl font-bold text-neon-green">
                            {recipe.protein}g
                          </p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-muted-foreground">Carbs</p>
                          <p className="text-xl font-bold">{recipe.carbs}g</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-muted-foreground">Fats</p>
                          <p className="text-xl font-bold">{recipe.fats}g</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-white mb-2">
                            Ingredients
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                            {recipe.ingredients.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-2">
                            Instructions
                          </h4>
                          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                            {recipe.instructions?.map((step, i) => (
                              <li key={i}>{step}</li>
                            )) || <li>No instructions provided.</li>}
                          </ol>
                        </div>
                      </div>

                      {recipe.videoUrl && (
                        <a
                          href={recipe.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-2">
                            <Video className="w-4 h-4 mr-2" /> WATCH COOKING
                            VIDEO
                          </Button>
                        </a>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hacks" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                PROTEIN HACK <span className="text-neon-green">BLOG</span>
              </h2>
              <p className="text-muted-foreground">
                Expert tips and strategies to maximize your protein intake
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proteinHackBlogs.map((blog) => (
                <Dialog key={blog.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer overflow-hidden bg-card/40 border-white/5 hover:border-neon-green/50 transition-all group h-full flex flex-col">
                      <div
                        className={`h-24 bg-gradient-to-br ${blog.color} flex items-center justify-center relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                            {blog.icon}
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur rounded text-xs text-white">
                          {blog.category}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-neon-green transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {blog.subtitle}
                        </p>
                        <p className="text-sm text-muted-foreground/80 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {blog.readTime}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-neon-green font-bold group-hover:translate-x-1 transition-transform">
                            READ MORE <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <div
                        className={`-mx-6 -mt-6 mb-6 h-32 bg-gradient-to-br ${blog.color} flex items-center justify-center relative`}
                      >
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="relative z-10 text-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white mx-auto mb-2">
                            {blog.icon}
                          </div>
                          <span className="px-3 py-1 bg-black/40 backdrop-blur rounded-full text-xs text-white">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                      <DialogTitle className="text-2xl font-display font-bold text-white">
                        {blog.title}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground flex items-center gap-4">
                        <span>{blog.subtitle}</span>
                        <span className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" /> {blog.readTime}
                        </span>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {blog.content.intro}
                      </p>

                      {blog.content.sections.map((section, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green text-sm font-bold">
                              {idx + 1}
                            </span>
                            {section.heading}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed pl-10">
                            {section.content}
                          </p>
                          {section.tips && section.tips.length > 0 && (
                            <ul className="pl-10 space-y-2">
                              {section.tips.map((tip, tipIdx) => (
                                <li
                                  key={tipIdx}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green mt-2 flex-shrink-0" />
                                  <span className="text-white/90">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      <div className="mt-8 p-6 bg-neon-green/10 border border-neon-green/30 rounded-xl">
                        <h4 className="text-lg font-bold text-neon-green mb-2 flex items-center gap-2">
                          <Zap className="w-5 h-5" /> Key Takeaway
                        </h4>
                        <p className="text-white/90 leading-relaxed">
                          {blog.content.conclusion}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          <TabsContent
            value="calculator"
            className="max-w-5xl mx-auto space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">
                      MACRO CALCULATOR
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Type what you ate, get instant macros.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                      Select Food Item
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setMacroInput((prev) =>
                          prev ? `${prev}, ${value}` : value,
                        )
                      }
                    >
                      <SelectTrigger className="bg-black/40 border border-white/10 text-white">
                        <SelectValue placeholder="Choose a food" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 max-h-60 overflow-y-auto">
                        {Object.keys(foodDatabase).map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <textarea
                    className="w-full h-28 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none resize-none"
                    placeholder="E.g., 2 eggs, 200g chicken breast, 1 cup rice..."
                    value={macroInput}
                    onChange={(e) => setMacroInput(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        min={0.1}
                        step={0.5}
                        value={portionQuantity}
                        onChange={(e) =>
                          setPortionQuantity(parseFloat(e.target.value) || 1)
                        }
                        className="bg-black/40 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                        Unit
                      </Label>
                      <Select
                        value={portionUnit}
                        onValueChange={setPortionUnit}
                      >
                        <SelectTrigger className="bg-black/40 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="serving">serving</SelectItem>
                          {unitOptions.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                      Quick Add
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {indianPresets.slice(0, 8).map((item) => (
                        <Button
                          key={item}
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setMacroInput((prev) =>
                              prev ? `${prev}, ${item}` : item,
                            )
                          }
                          className="text-xs bg-white/5 border-white/10 text-white hover:border-neon-green hover:text-neon-green hover:bg-neon-green/10"
                        >
                          <Plus className="w-3 h-3 mr-1" /> {item}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full !bg-neon-green !text-black font-bold hover:!bg-neon-green/80 h-12 text-lg mt-2 !border-none"
                    onClick={handleCalculate}
                  >
                    CALCULATE MACROS
                  </Button>

                  {calculatedMacros && (
                    <div className="mt-6 pt-6 border-t border-white/10 animate-in slide-in-from-bottom-4">
                      <div className="grid grid-cols-4 gap-4 text-center mb-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Calories
                          </p>
                          <p className="text-2xl font-display font-bold text-white">
                            {calculatedMacros.cal}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Protein
                          </p>
                          <p className="text-2xl font-display font-bold text-neon-green">
                            {calculatedMacros.p}g
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Carbs
                          </p>
                          <p className="text-2xl font-display font-bold text-white">
                            {calculatedMacros.c}g
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Fats
                          </p>
                          <p className="text-2xl font-display font-bold text-white">
                            {calculatedMacros.f}g
                          </p>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-neon-green/20 hover:bg-neon-green/40 text-neon-green border border-neon-green/50 font-bold"
                        onClick={handleAddToLog}
                      >
                        <Check className="w-4 h-4 mr-2" /> ADD TO DAILY LOG
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">
                      DAILY TARGETS
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Your goals vs reality.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-sm font-bold text-white">Calories</p>
                        <p className="text-xs text-muted-foreground">
                          Remaining:{" "}
                          {Math.max(
                            0,
                            targets.calories - dailyLog.caloriesConsumed,
                          )}
                        </p>
                      </div>
                      <p className="text-2xl font-display font-bold text-white">
                        {dailyLog.caloriesConsumed}{" "}
                        <span className="text-sm text-muted-foreground font-normal">
                          / {targets.calories}
                        </span>
                      </p>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${dailyLog.caloriesConsumed > targets.calories ? "bg-red-500" : "bg-white"}`}
                        style={{
                          width: `${progressPercent(dailyLog.caloriesConsumed, targets.calories)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Protein
                      </p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neon-green transition-all duration-300"
                          style={{
                            width: `${progressPercent(dailyLog.proteinConsumed, targets.protein)}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm font-bold text-white">
                        {dailyLog.proteinConsumed} / {targets.protein}g
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Carbs
                      </p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{
                            width: `${progressPercent(dailyLog.carbsConsumed, targets.carbs)}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm font-bold text-white">
                        {dailyLog.carbsConsumed} / {targets.carbs}g
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Fats
                      </p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 transition-all duration-300"
                          style={{
                            width: `${progressPercent(dailyLog.fatsConsumed, targets.fats)}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm font-bold text-white">
                        {dailyLog.fatsConsumed} / {targets.fats}g
                      </p>
                    </div>
                  </div>

                  {dailyLog.entries.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-white/10">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                        Today's Log
                      </p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {dailyLog.entries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-white truncate">
                                {entry.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {entry.calories} cal | P:{entry.protein}g C:
                                {entry.carbs}g F:{entry.fats}g
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveEntry(entry.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-white/5 text-center">
                    <p className="text-sm text-muted-foreground italic">
                      {dailyLog.caloriesConsumed === 0
                        ? "Start logging your meals to track your progress!"
                        : targets.calories - dailyLog.caloriesConsumed > 0
                          ? `You're ${targets.calories - dailyLog.caloriesConsumed} calories under your target.`
                          : `You're ${dailyLog.caloriesConsumed - targets.calories} calories over your target.`}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
