import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BookOpen, 
  Apple, 
  Flame, 
  Dumbbell, 
  Pill, 
  Moon, 
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Zap,
  Heart,
  Brain,
  Target
} from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";

type TopicId = "macros" | "fatloss" | "muscle" | "supplements" | "sleep" | "myths" | null;

interface Topic {
  id: TopicId;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

const topics: Topic[] = [
  { id: "macros", title: "What Are Macros?", description: "Protein, Carbs, Fats explained", icon: Apple, color: "text-primary", bgColor: "bg-primary/20", borderColor: "border-primary/30" },
  { id: "fatloss", title: "Fat Loss Science", description: "Calorie deficit explained simply", icon: Flame, color: "text-pink-400", bgColor: "bg-pink-500/20", borderColor: "border-pink-500/30" },
  { id: "muscle", title: "Muscle Building", description: "Progressive overload & protein synthesis", icon: Dumbbell, color: "text-accent", bgColor: "bg-accent/20", borderColor: "border-accent/30" },
  { id: "supplements", title: "Supplement Guide", description: "What works and what doesn't", icon: Pill, color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30" },
  { id: "sleep", title: "Sleep & Recovery", description: "Why rest is crucial for results", icon: Moon, color: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30" },
  { id: "myths", title: "Fitness Myths", description: "Common misconceptions debunked", icon: AlertTriangle, color: "text-orange-400", bgColor: "bg-orange-500/20", borderColor: "border-orange-500/30" },
];

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-background/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-foreground">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 pt-2 text-muted-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MacrosContent() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-foreground/90">
        Macronutrients (macros) are the three main nutrients your body needs in large amounts: 
        <span className="text-primary font-semibold"> Protein</span>, 
        <span className="text-yellow-400 font-semibold"> Carbohydrates</span>, and 
        <span className="text-pink-400 font-semibold"> Fats</span>.
      </p>

      <div className="grid gap-4">
        <CollapsibleSection title="Protein - The Building Block" defaultOpen>
          <div className="space-y-2">
            <p>Protein is essential for muscle repair and growth. Each gram provides 4 calories.</p>
            <div className="flex items-center gap-2 text-primary">
              <Target className="w-4 h-4" />
              <span className="font-medium">Goal: 1.6-2.2g per kg of body weight for muscle building</span>
            </div>
            <p className="text-sm">Sources: Chicken, fish, eggs, dairy, legumes, tofu</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Carbohydrates - The Energy Source">
          <div className="space-y-2">
            <p>Carbs are your body's primary energy source. Each gram provides 4 calories.</p>
            <div className="flex items-center gap-2 text-yellow-400">
              <Zap className="w-4 h-4" />
              <span className="font-medium">They fuel workouts and brain function</span>
            </div>
            <p className="text-sm">Sources: Rice, oats, potatoes, fruits, vegetables, whole grains</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Fats - The Essential Nutrient">
          <div className="space-y-2">
            <p>Fats support hormone production and nutrient absorption. Each gram provides 9 calories.</p>
            <div className="flex items-center gap-2 text-pink-400">
              <Heart className="w-4 h-4" />
              <span className="font-medium">Essential for testosterone and overall health</span>
            </div>
            <p className="text-sm">Sources: Nuts, avocados, olive oil, fatty fish, eggs</p>
          </div>
        </CollapsibleSection>
      </div>

      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
        <p className="text-sm">
          <span className="font-semibold text-primary">Pro Tip:</span> Don't fear any macro! Balance is key. 
          A good starting point is 30% protein, 40% carbs, 30% fats.
        </p>
      </div>
    </div>
  );
}

function FatLossContent() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-foreground/90">
        Fat loss happens when you consume <span className="text-pink-400 font-semibold">fewer calories</span> than your body burns. 
        This is called a <span className="text-pink-400 font-semibold">calorie deficit</span>.
      </p>

      <div className="grid gap-4">
        <CollapsibleSection title="The Simple Math" defaultOpen>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <div className="text-2xl font-display font-bold text-primary">TDEE</div>
                <div className="text-xs text-muted-foreground">Calories burned</div>
              </div>
              <div className="flex items-center justify-center text-2xl text-muted-foreground">-</div>
              <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/30">
                <div className="text-2xl font-display font-bold text-pink-400">500</div>
                <div className="text-xs text-muted-foreground">Deficit</div>
              </div>
            </div>
            <p>A 500 calorie daily deficit = ~0.5kg fat loss per week</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Why Crash Diets Don't Work">
          <div className="space-y-2">
            <p>Extreme deficits (eating too little) cause:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Muscle loss (slower metabolism)</li>
              <li>Hormonal disruption</li>
              <li>Intense hunger and cravings</li>
              <li>Inevitable weight regain</li>
            </ul>
            <div className="flex items-center gap-2 text-yellow-400 mt-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Slow and steady wins the race!</span>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Keys to Sustainable Fat Loss">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span>Moderate deficit (300-500 cal below TDEE)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span>High protein intake (preserves muscle)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span>Resistance training (builds/maintains muscle)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              <span>Adequate sleep (7-9 hours)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">5.</span>
              <span>Patience and consistency</span>
            </li>
          </ul>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function MuscleContent() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-foreground/90">
        Muscle grows when you <span className="text-accent font-semibold">challenge it progressively</span> and 
        provide adequate <span className="text-accent font-semibold">protein and recovery</span>.
      </p>

      <div className="grid gap-4">
        <CollapsibleSection title="Progressive Overload Explained" defaultOpen>
          <div className="space-y-2">
            <p>Your muscles only grow when forced to adapt to increasing demands:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Increase weight lifted over time</li>
              <li>Add more reps or sets</li>
              <li>Improve exercise form and range of motion</li>
              <li>Reduce rest time between sets</li>
            </ul>
            <div className="flex items-center gap-2 text-accent mt-2">
              <Dumbbell className="w-4 h-4" />
              <span className="font-medium">Small improvements each week add up!</span>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Muscle Protein Synthesis (MPS)">
          <div className="space-y-2">
            <p>MPS is the process where your body repairs and builds muscle after training.</p>
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-sm"><span className="font-semibold text-accent">Key:</span> MPS stays elevated for 24-48 hours after training. 
              This is why protein timing and distribution matter!</p>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="The Muscle Building Formula">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
              <Dumbbell className="w-6 h-6 text-accent mx-auto mb-1" />
              <div className="text-xs">Training</div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <Apple className="w-6 h-6 text-primary mx-auto mb-1" />
              <div className="text-xs">Nutrition</div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <Moon className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <div className="text-xs">Recovery</div>
            </div>
          </div>
          <p className="text-sm mt-3">All three must be optimized. Missing any one will limit your results.</p>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function SupplementsContent() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-foreground/90">
        Supplements can help, but they're just the <span className="text-purple-400 font-semibold">cherry on top</span>. 
        Focus on diet and training first!
      </p>

      <div className="grid gap-4">
        <CollapsibleSection title="Actually Useful Supplements" defaultOpen>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="font-semibold text-primary mb-1">Creatine Monohydrate</h4>
              <p className="text-sm">The most researched supplement. Improves strength, power, and muscle growth. 
              Take 3-5g daily. Cheap and effective.</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
              <h4 className="font-semibold text-accent mb-1">Protein Powder</h4>
              <p className="text-sm">Convenient way to hit protein goals. Not magic - just food in powder form. 
              Whey, casein, or plant-based all work.</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <h4 className="font-semibold text-yellow-400 mb-1">Vitamin D3</h4>
              <p className="text-sm">Most people are deficient, especially if you're indoors a lot. 
              Important for energy, mood, and hormones.</p>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Overrated/Overhyped">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>BCAAs - waste of money if you eat enough protein</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Fat burners - mostly caffeine with marketing</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Testosterone boosters - don't work</span>
            </li>
          </ul>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function SleepContent() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-foreground/90">
        Sleep is when your body <span className="text-yellow-400 font-semibold">repairs, grows, and recovers</span>. 
        Poor sleep = poor results.
      </p>

      <div className="grid gap-4">
        <CollapsibleSection title="Why Sleep Matters for Fitness" defaultOpen>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Dumbbell className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Muscle protein synthesis peaks during deep sleep</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>Growth hormone is released during sleep</span>
            </li>
            <li className="flex items-start gap-2">
              <Brain className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Poor sleep increases hunger hormones (ghrelin)</span>
            </li>
            <li className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <span>Testosterone production depends on quality sleep</span>
            </li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Sleep Optimization Tips">
          <ul className="space-y-2 text-sm">
            <li><span className="text-primary font-medium">1.</span> Aim for 7-9 hours per night</li>
            <li><span className="text-primary font-medium">2.</span> Keep a consistent sleep schedule</li>
            <li><span className="text-primary font-medium">3.</span> Dark, cool room (18-20°C ideal)</li>
            <li><span className="text-primary font-medium">4.</span> No screens 1 hour before bed</li>
            <li><span className="text-primary font-medium">5.</span> Avoid caffeine after 2 PM</li>
            <li><span className="text-primary font-medium">6.</span> Magnesium before bed can help</li>
          </ul>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function MythsContent() {
  return (
    <div className="space-y-6">
      <p className="text-lg text-foreground/90">
        Let's clear up some <span className="text-orange-400 font-semibold">common misconceptions</span> that hold people back.
      </p>

      <div className="grid gap-4">
        <CollapsibleSection title='Myth: "Lifting makes women bulky"' defaultOpen>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">FALSE</span>
            </div>
            <p>Women have ~15-20x less testosterone than men. Building significant muscle is extremely difficult 
            without enhanced hormone levels. Lifting will make you toned and strong, not bulky.</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title='Myth: "You need to eat every 2-3 hours"'>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">FALSE</span>
            </div>
            <p>Meal timing doesn't significantly impact metabolism. Total daily protein and calories matter more. 
            Eat in whatever pattern fits your lifestyle.</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title='Myth: "Cardio is best for fat loss"'>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">PARTIALLY FALSE</span>
            </div>
            <p>Resistance training is equally (if not more) important. Muscle burns more calories at rest. 
            The best approach combines both with a calorie deficit.</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title='Myth: "Spot reduction works"'>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">FALSE</span>
            </div>
            <p>You cannot target fat loss from specific areas by exercising them. Fat loss happens 
            systemically through a calorie deficit. Where you lose fat first is genetic.</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title='Myth: "Supplements are necessary"'>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">FALSE</span>
            </div>
            <p>You can achieve amazing results with just food and training. Supplements are 
            convenience tools, not requirements. Focus on the basics first.</p>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function TopicContent({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  const Icon = topic.icon;

  const renderContent = () => {
    switch (topic.id) {
      case "macros": return <MacrosContent />;
      case "fatloss": return <FatLossContent />;
      case "muscle": return <MuscleContent />;
      case "supplements": return <SupplementsContent />;
      case "sleep": return <SleepContent />;
      case "myths": return <MythsContent />;
      default: return null;
    }
  };

  return (
    <Card className={`bg-card/80 backdrop-blur-sm border ${topic.borderColor} overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${topic.bgColor.replace('bg-', 'from-')} to-transparent pointer-events-none`} />
      <CardHeader className="relative">
        <Button variant="ghost" onClick={onBack} className="w-fit mb-4 hover:bg-muted/50">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Knowledge Hub
        </Button>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl ${topic.bgColor} flex items-center justify-center`}>
            <Icon className={`w-7 h-7 ${topic.color}`} />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">{topic.title}</CardTitle>
            <CardDescription>{topic.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {renderContent()}
      </CardContent>
    </Card>
  );
}

export default function Knowledge() {
  const [, setLocation] = useLocation();
  const [activeTopic, setActiveTopic] = useState<TopicId>(null);

  const activeTopicData = topics.find(t => t.id === activeTopic);

  return (
    <PageWrapper>
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!activeTopic ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button variant="ghost" onClick={() => setLocation("/")} className="mb-8 hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>

                <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                    Knowledge <span className="text-neon-blue">Hub</span>
                  </h1>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Learn the science behind fitness in simple, easy-to-understand terms
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topics.map((topic, index) => {
                    const Icon = topic.icon;
                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer bg-card/80 backdrop-blur-sm border ${topic.borderColor} hover:shadow-lg transition-all overflow-hidden h-full`}
                          onClick={() => setActiveTopic(topic.id)}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${topic.bgColor.replace('bg-', 'from-')} to-transparent pointer-events-none`} />
                          <CardHeader className="relative space-y-4">
                            <div className={`w-14 h-14 rounded-xl ${topic.bgColor} flex items-center justify-center`}>
                              <Icon className={`w-7 h-7 ${topic.color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-display">{topic.title}</CardTitle>
                              <CardDescription className="mt-1">{topic.description}</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="relative">
                            <div className={`flex items-center text-sm ${topic.color}`}>
                              <span>Learn more</span>
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : activeTopicData && (
              <motion.div
                key="topic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <TopicContent topic={activeTopicData} onBack={() => setActiveTopic(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
