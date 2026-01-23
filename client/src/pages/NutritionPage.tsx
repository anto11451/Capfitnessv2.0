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
import { getMacroData, syncFuelTrackerWithMacros, NutritionData } from "@/lib/nutritionSync";
import { motion, AnimatePresence } from "framer-motion";

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

import riceImg from "@/assets/rice-cartoon.png";
import chickenImg from "@/assets/chicken-cartoon.png";
import eggImg from "@/assets/egg-cartoon.png";

const foodDatabase: Record<
  string,
  {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
    defaultUnit: string;
    servingSize: number;
    image?: string;
  }
> = {
  Rice: {
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    calories: 130,
    defaultUnit: "g",
    servingSize: 100,
    image: riceImg
  },
  "Chicken Breast": {
    protein: 31,
    carbs: 0,
    fats: 3.6,
    calories: 165,
    defaultUnit: "g",
    servingSize: 100,
    image: chickenImg
  },
  Eggs: {
    protein: 6,
    carbs: 1,
    fats: 5,
    calories: 70,
    defaultUnit: "piece",
    servingSize: 1,
    image: eggImg
  },
  Paneer: {
    protein: 18,
    carbs: 4,
    fats: 22,
    calories: 265,
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
  "Sweet Potato": {
    protein: 2,
    carbs: 20,
    fats: 0,
    calories: 86,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Brown Bread": {
    protein: 4,
    carbs: 20,
    fats: 1,
    calories: 110,
    defaultUnit: "slice",
    servingSize: 1,
  },
  "Peanut Chikki": {
    protein: 5,
    carbs: 17,
    fats: 7,
    calories: 140,
    defaultUnit: "piece",
    servingSize: 1,
  },
  "Sattu": {
    protein: 20,
    carbs: 60,
    fats: 7,
    calories: 380,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Greek Yogurt": {
    protein: 10,
    carbs: 4,
    fats: 5,
    calories: 100,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Fish (Tilapia)": {
    protein: 26,
    carbs: 0,
    fats: 3,
    calories: 128,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Lentils (Dal)": {
    protein: 9,
    carbs: 20,
    fats: 0.4,
    calories: 116,
    defaultUnit: "g",
    servingSize: 100,
  },
  "Chickpeas (Chole)": {
    protein: 19,
    carbs: 61,
    fats: 6,
    calories: 364,
    defaultUnit: "g",
    servingSize: 100,
  }
};

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
      ],
      conclusion:
        "Vegetarian bodybuilding is not just possible - its thriving. With strategic food combinations and proper planning, you can build just as much muscle as any meat-eater. The key is consistency and variety.",
    },
  },
];

export default function NutritionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("100");
  const [unit, setUnit] = useState<string>("g");
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: new Date().toLocaleDateString(),
    entries: [],
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatsConsumed: 0,
  });

  const targets = {
    calories: 2500,
    protein: 150,
    carbs: 300,
    fats: 70,
  };

  useEffect(() => {
    const savedLog = localStorage.getItem(DAILY_LOG_KEY);
    if (savedLog) {
      const parsed = JSON.parse(savedLog);
      if (parsed.date === new Date().toLocaleDateString()) {
        setDailyLog(parsed);
      }
    }
  }, []);

  const saveDailyLog = (newLog: DailyLog) => {
    setDailyLog(newLog);
    localStorage.setItem(DAILY_LOG_KEY, JSON.stringify(newLog));
    syncFuelTrackerWithMacros({
      calories: newLog.caloriesConsumed,
      protein: newLog.proteinConsumed,
      carbs: newLog.carbsConsumed,
      fats: newLog.fatsConsumed,
    }, targets);
  };

  const handleRemoveEntry = (id: string) => {
    const entryToRemove = dailyLog.entries.find((e) => e.id === id);
    if (!entryToRemove) return;

    const newEntries = dailyLog.entries.filter((e) => e.id !== id);
    const updatedLog: DailyLog = {
      ...dailyLog,
      entries: newEntries,
      caloriesConsumed: dailyLog.caloriesConsumed - entryToRemove.calories,
      proteinConsumed: dailyLog.proteinConsumed - entryToRemove.protein,
      carbsConsumed: dailyLog.carbsConsumed - entryToRemove.carbs,
      fatsConsumed: dailyLog.fatsConsumed - entryToRemove.fats,
    };
    saveDailyLog(updatedLog);
    toast({
      title: "Entry Removed",
      description: "Successfully removed from your log.",
    });
  };

  const progressPercent = (consumed: number, target: number) => {
    return Math.min(100, Math.round((consumed / target) * 100));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 mb-20">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter">
            FUEL <span className="text-primary">CENTER</span>
          </h1>
          <p className="text-muted-foreground text-sm uppercase font-black tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> SCIENTIFIC NUTRITION & MACRO TRACKING
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="bg-card/40 backdrop-blur-xl border border-white/5 p-1 rounded-2xl h-14">
            <TabsTrigger
              value="calculator"
              className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black italic tracking-tight"
            >
              MACRO CALCULATOR
            </TabsTrigger>
            <TabsTrigger
              value="hacks"
              className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black italic tracking-tight"
            >
              PROTEIN HACKS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <div className="space-y-6">
                <div className="bg-card/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-black text-white italic tracking-tight">FUEL <span className="text-primary">CALCULATOR</span></h2>
                      <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Select food & adjust grams</p>
                    </div>
                  </div>

                  <div className="mb-10">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 block">Select Food Item</Label>
                    <Select
                      onValueChange={(value) => {
                        const data = foodDatabase[value];
                        if (data) {
                          setSelectedFood(value);
                          setQuantity(data.servingSize.toString());
                          setUnit(data.defaultUnit);
                        }
                      }}
                      value={selectedFood || ""}
                    >
                      <SelectTrigger className="w-full h-16 bg-card/50 border-2 border-white/5 rounded-2xl text-lg font-black italic tracking-tight focus:ring-primary/20 transition-all hover:border-primary/30">
                        <SelectValue placeholder="CHOOSE YOUR FUEL..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10 rounded-2xl max-h-[400px]">
                        {Object.keys(foodDatabase).sort().map((name) => (
                          <SelectItem 
                            key={name} 
                            value={name}
                            className="font-display font-black italic text-sm py-3 focus:bg-primary focus:text-primary-foreground rounded-xl m-1 transition-colors"
                          >
                            {name.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedFood && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="p-8 rounded-[2rem] bg-gradient-to-br from-card/80 to-card border-2 border-primary/20 space-y-8 relative overflow-hidden shadow-2xl"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 animate-pulse" />
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between relative z-10 gap-6">
                        <div className="space-y-1 text-center sm:text-left">
                          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Fuel Customizer</p>
                          <h3 className="text-3xl font-display font-black text-white italic flex items-center justify-center sm:justify-start gap-4">
                            {selectedFood.toUpperCase()}
                            {foodDatabase[selectedFood]?.image && (
                              <img src={foodDatabase[selectedFood].image} className="w-10 h-10 object-contain drop-shadow-xl" />
                            )}
                          </h3>
                        </div>
                        <div className="flex flex-col items-center sm:items-end gap-2">
                           <div className="flex items-center gap-4 bg-background/80 px-6 py-4 rounded-2xl border-2 border-primary/30 shadow-inner backdrop-blur-md">
                            <Input
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              className="w-24 h-12 bg-transparent border-none text-right font-black text-3xl focus-visible:ring-0 p-0 text-primary"
                            />
                            <span className="text-lg font-black text-foreground/50 uppercase tracking-widest border-l border-border/50 pl-4">{unit}</span>
                          </div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Enter amount in {unit}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                        {[
                          { label: 'CALORIES', val: Math.round((Number(quantity) / (foodDatabase[selectedFood]?.servingSize || 1)) * (foodDatabase[selectedFood]?.calories || 0)), color: 'text-primary', bg: 'bg-primary/10', icon: Zap },
                          { label: 'PROTEIN', val: Math.round((Number(quantity) / (foodDatabase[selectedFood]?.servingSize || 1)) * (foodDatabase[selectedFood]?.protein || 0)), color: 'text-orange-400', bg: 'bg-orange-400/10', icon: Beef },
                          { label: 'CARBS', val: Math.round((Number(quantity) / (foodDatabase[selectedFood]?.servingSize || 1)) * (foodDatabase[selectedFood]?.carbs || 0)), color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Leaf },
                          { label: 'FATS', val: Math.round((Number(quantity) / (foodDatabase[selectedFood]?.servingSize || 1)) * (foodDatabase[selectedFood]?.fats || 0)), color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Cloud },
                        ].map(m => (
                          <div key={m.label} className={`${m.bg} p-5 rounded-3xl border border-white/5 space-y-2 backdrop-blur-md hover:scale-105 transition-transform shadow-lg`}>
                            <div className="flex items-center justify-between">
                              <m.icon className={`w-5 h-5 ${m.color}`} />
                              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{m.label}</p>
                            </div>
                            <p className="text-3xl font-black italic tracking-tighter">{m.val}</p>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={async () => {
                          if (!selectedFood) return;
                          const macros = {
                            p: Math.round((Number(quantity) / (foodDatabase[selectedFood]?.servingSize || 1)) * (foodDatabase[selectedFood]?.protein || 0)),
                            c: Math.round((Number(quantity) / (foodDatabase[selectedFood]?.servingSize || 1)) * (foodDatabase[selectedFood]?.carbs || 0)),
                            f: Math.round((Number(quantity) / (foodDatabase[selectedFood]?.servingSize || 1)) * (foodDatabase[selectedFood]?.fats || 0)),
                            cal: Math.round((Number(quantity) / (foodDatabase[selectedFood]?.servingSize || 1)) * (foodDatabase[selectedFood]?.calories || 0)),
                            name: selectedFood
                          };
                          
                          const newEntry: FoodEntry = {
                            id: Date.now().toString(),
                            name: selectedFood,
                            quantity: Number(quantity),
                            unit: unit,
                            protein: macros.p,
                            carbs: macros.c,
                            fats: macros.f,
                            calories: macros.cal,
                            timestamp: Date.now(),
                          };

                          const updatedLog: DailyLog = {
                            ...dailyLog,
                            entries: [newEntry, ...dailyLog.entries],
                            caloriesConsumed: dailyLog.caloriesConsumed + macros.cal,
                            proteinConsumed: dailyLog.proteinConsumed + macros.p,
                            carbsConsumed: dailyLog.carbsConsumed + macros.c,
                            fatsConsumed: dailyLog.fatsConsumed + macros.f,
                          };

                          saveDailyLog(updatedLog);
                          toast({
                            title: "Fuel Added! ⚡",
                            description: `Added ${quantity}${unit} of ${selectedFood} to your log.`,
                          });
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-[2rem] py-10 text-2xl neon-glow shadow-[0_20px_50px_rgba(var(--primary),0.5)] group transition-all relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <div className="flex items-center justify-center relative z-10">
                          <Plus className="w-8 h-8 mr-4 group-hover:rotate-180 transition-transform duration-500" />
                          SYNC TO FUEL LOG
                        </div>
                      </Button>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "CALORIES", consumed: dailyLog.caloriesConsumed, target: targets.calories, color: "from-primary/20 to-primary/5", text: "text-primary" },
                    { label: "PROTEIN", consumed: dailyLog.proteinConsumed, target: targets.protein, color: "from-orange-500/20 to-orange-500/5", text: "text-orange-400" },
                    { label: "CARBS", consumed: dailyLog.carbsConsumed, target: targets.carbs, color: "from-blue-500/20 to-blue-500/5", text: "text-blue-400" },
                    { label: "FATS", consumed: dailyLog.fatsConsumed, target: targets.fats, color: "from-yellow-500/20 to-yellow-500/5", text: "text-yellow-400" },
                  ].map((macro) => (
                    <Card key={macro.label} className={`p-6 bg-gradient-to-br ${macro.color} border-white/5 relative overflow-hidden group hover:scale-105 transition-transform`}>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-2 tracking-widest">{macro.label}</p>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-2xl font-black ${macro.text} italic`}>{Math.round(macro.consumed)}</span>
                          <span className="text-xs text-muted-foreground font-bold">/ {macro.target}</span>
                        </div>
                        <div className="mt-4 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent(macro.consumed, macro.target)}%` }}
                            className={`h-full rounded-full bg-gradient-to-r ${macro.text === 'text-primary' ? 'from-primary to-primary/60' : 
                               macro.text === 'text-orange-400' ? 'from-orange-500 to-orange-300' :
                               macro.text === 'text-blue-400' ? 'from-blue-500 to-blue-300' :
                               'from-yellow-500 to-yellow-300'}`}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="bg-card/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-orange-400" />
                      </div>
                      <h3 className="text-xl font-display font-black text-white italic">DAILY FUEL LOG</h3>
                    </div>
                    <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                      <p className="text-[10px] font-black text-primary uppercase">TODAY'S ENTRIES</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {dailyLog.entries.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Cloud className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground font-bold">Your fuel log is empty.</p>
                        <p className="text-[10px] text-muted-foreground/50 uppercase font-black">Select food from above to start tracking</p>
                      </div>
                    ) : (
                      dailyLog.entries.map((entry) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={entry.id}
                          className="group relative"
                        >
                          <div className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5 shadow-lg group-hover:scale-110 transition-transform">
                                {foodDatabase[entry.name]?.image ? (
                                  <img src={foodDatabase[entry.name].image} alt={entry.name} className="w-10 h-10 object-contain drop-shadow-lg" />
                                ) : (
                                  <Utensils className="w-6 h-6 text-muted-foreground/50" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-display font-black text-white italic group-hover:text-primary transition-colors">{entry.name.toUpperCase()}</h4>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                                  {entry.quantity}{entry.unit} • {entry.calories} CAL
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="hidden sm:flex flex-col items-end">
                                <div className="flex gap-2">
                                  <span className="text-[9px] font-black text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">P: {entry.protein}g</span>
                                  <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">C: {entry.carbs}g</span>
                                  <span className="text-[9px] font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">F: {entry.fats}g</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveEntry(entry.id)}
                                className="w-10 h-10 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hacks" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                PROTEIN HACK <span className="text-primary">BLOG</span>
              </h2>
              <p className="text-muted-foreground">
                Expert tips and strategies to maximize your protein intake
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proteinHackBlogs.map((blog) => (
                <Dialog key={blog.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer overflow-hidden bg-card/40 border-white/5 hover:border-primary/50 transition-all group h-full flex flex-col">
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
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
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
                          <div className="flex items-center gap-1 text-xs text-primary font-bold group-hover:translate-x-1 transition-transform">
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
                            <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
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
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  <span className="text-white/90">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      <div className="mt-8 p-6 bg-primary/10 border border-primary/30 rounded-xl">
                        <h4 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
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
        </Tabs>
      </div>
    </Layout>
  );
}
