import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, Scale, Percent, Flame, Target, Beef, ChevronRight, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";

type CalculatorType = "bmi" | "bodyfat" | "tdee" | "idealweight" | "protein" | null;

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: any;
  variant: string;
  onClick: () => void;
}

function CalculatorCard({ title, description, icon: Icon, variant, onClick }: CalculatorCardProps) {
  const variants: Record<string, string> = {
    green: "border-primary/30 from-primary/10",
    blue: "border-accent/30 from-accent/10",
    purple: "border-purple-500/30 from-purple-500/10",
    pink: "border-pink-500/30 from-pink-500/10",
    yellow: "border-yellow-500/30 from-yellow-500/10",
  };

  const iconColors: Record<string, string> = {
    green: "bg-primary/20 text-primary",
    blue: "bg-accent/20 text-accent",
    purple: "bg-purple-500/20 text-purple-400",
    pink: "bg-pink-500/20 text-pink-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer bg-card/80 backdrop-blur-sm border ${variants[variant]} hover:shadow-lg transition-all overflow-hidden h-full`}
        onClick={onClick}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${variants[variant]} to-transparent pointer-events-none`} />
        <CardHeader className="relative space-y-4">
          <div className={`w-14 h-14 rounded-xl ${iconColors[variant]} flex items-center justify-center`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <CardTitle className="text-lg font-display">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center text-sm text-primary">
            <span>Calculate</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

//
// ██████╗ ███╗   ███╗██╗
// ██╔══██╗████╗ ████║██║
// ██████╔╝██╔████╔██║██║
// ██╔══██╗██║╚██╔╝██║██║
// ██████╔╝██║ ╚═╝ ██║███████╗
// ╚═════╝ ╚═╝     ╚═╝╚══════╝
// BMI (unchanged)
//

function BMICalculator({ onBack }: { onBack: () => void }) {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculateBMI = () => {
    const totalInches = parseFloat(feet) * 12 + parseFloat(inches);
    const heightM = totalInches * 0.0254;
    const weightKg = parseFloat(weight);

    const bmi = weightKg / (heightM * heightM);

    let category = "";
    let color = "";
    if (bmi < 18.5) { category = "Underweight"; color = "text-accent"; }
    else if (bmi < 25) { category = "Normal Weight"; color = "text-primary"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-yellow-400"; }
    else { category = "Obese"; color = "text-pink-400"; }

    setResult({ bmi, category, color });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-primary/30 neon-border overflow-hidden">
      <CardHeader className="relative">
        <Button variant="ghost" onClick={onBack} className="w-fit mb-4 hover:bg-primary/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calculators
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">BMI Calculator</CardTitle>
            <CardDescription>Body Mass Index based on height & weight</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Height (feet)</Label>
            <Input value={feet} onChange={(e) => setFeet(e.target.value)} type="number" placeholder="5" />
          </div>
          <div>
            <Label>Height (inches)</Label>
            <Input value={inches} onChange={(e) => setInches(e.target.value)} type="number" placeholder="10" />
          </div>
        </div>

        <div>
          <Label>Weight (kg)</Label>
          <Input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="70" />
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 neon-glow bg-primary" onClick={calculateBMI}>
            <Calculator className="w-4 h-4 mr-2" /> Calculate BMI
          </Button>

          <Button variant="outline" onClick={() => { setFeet(""); setInches(""); setWeight(""); setResult(null); }}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-xl bg-background/50 border"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{result.bmi.toFixed(1)}</div>
                <div className={`text-xl mt-2 ${result.color}`}>{result.category}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

//
// ██████╗  ██████╗ ██████╗ ██╗   ██╗    ███████╗ █████╗ ████████╗
// ██╔══██╗██╔════╝██╔═══██╗██║   ██║    ██╔════╝██╔══██╗╚══██╔══╝
// ██████╔╝██║     ██║   ██║██║   ██║    █████╗  ███████║   ██║
// ██╔══██╗██║     ██║   ██║██║   ██║    ██╔══╝  ██╔══██║   ██║
// ██████╔╝╚██████╗╚██████╔╝╚██████╔╝    ███████╗██║  ██║   ██║
// ╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝     ╚══════╝╚═╝  ╚═╝   ╚═╝
// BODY FAT → Now ft + inches + inches measurements
//

function BodyFatCalculator({ onBack }: { onBack: () => void }) {
  const [gender, setGender] = useState("male");

  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");

  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");

  const [result, setResult] = useState<{ bf: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const totalInches = parseFloat(feet) * 12 + parseFloat(inches);
    const heightCm = totalInches * 2.54;

    const neckCm = parseFloat(neck) * 2.54;
    const waistCm = parseFloat(waist) * 2.54;
    const hipCm = gender === "female" ? parseFloat(hip) * 2.54 : 0;

    let bf = 0;

    if (gender === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }

    let category = "";
    let color = "";

    if (gender === "male") {
      if (bf < 6) { category = "Essential Fat"; color = "text-accent"; }
      else if (bf < 14) { category = "Athletes"; color = "text-primary"; }
      else if (bf < 18) { category = "Fitness"; color = "text-primary"; }
      else if (bf < 25) { category = "Average"; color = "text-yellow-400"; }
      else { category = "Obese"; color = "text-pink-400"; }
    } else {
      if (bf < 14) { category = "Essential Fat"; color = "text-accent"; }
      else if (bf < 21) { category = "Athletes"; color = "text-primary"; }
      else if (bf < 25) { category = "Fitness"; color = "text-primary"; }
      else if (bf < 32) { category = "Average"; color = "text-yellow-400"; }
      else { category = "Obese"; color = "text-pink-400"; }
    }

    setResult({ bf, category, color });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-accent/30 neon-border-blue overflow-hidden">
      <CardHeader className="relative">
        <Button variant="ghost" onClick={onBack} className="w-fit mb-4 hover:bg-accent/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calculators
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
            <Percent className="w-7 h-7 text-accent" />
          </div>
          <div>
            <CardTitle className="text-2xl">Body Fat % Calculator</CardTitle>
            <CardDescription>US Navy Method</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Height (feet)</Label>
            <Input value={feet} onChange={(e) => setFeet(e.target.value)} placeholder="5" type="number" />
          </div>
          <div>
            <Label>Height (inches)</Label>
            <Input value={inches} onChange={(e) => setInches(e.target.value)} placeholder="9" type="number" />
          </div>
        </div>

        {/* Neck + Waist */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Neck (inches)</Label>
            <Input value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="15" type="number" />
          </div>
          <div>
            <Label>Waist (inches)</Label>
            <Input value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="34" type="number" />
          </div>
        </div>

        {/* Hip (female only) */}
        {gender === "female" && (
          <div>
            <Label>Hip (inches)</Label>
            <Input value={hip} onChange={(e) => setHip(e.target.value)} placeholder="40" type="number" />
          </div>
        )}

        <div>
          <Label>Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 neon-glow-blue bg-accent" onClick={calculate}>
            <Calculator className="w-4 h-4 mr-2" /> Calculate Body Fat
          </Button>
          <Button variant="outline"
            onClick={() => {
              setFeet("");
              setInches("");
              setNeck("");
              setWaist("");
              setHip("");
              setResult(null);
            }}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-background/50 border rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-accent">{result.bf.toFixed(1)}%</div>
              <div className={`text-lg mt-2 ${result.color}`}>{result.category}</div>
            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}

//
// ████████╗██████╗ ███████╗███████╗
// ╚══██╔══╝██╔══██╗██╔════╝██╔════╝
//    ██║   ██████╔╝█████╗  ███████╗
//    ██║   ██╔══██╗██╔══╝  ╚════██║
//    ██║   ██║  ██║███████╗███████║
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝
// TDEE (now in ft + inches)
//

function TDEECalculator({ onBack }: { onBack: () => void }) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");

  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");

  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("1.2");

  const [result, setResult] = useState<{ bmr: number; tdee: number; deficit: number; surplus: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = (parseFloat(feet) * 12 + parseFloat(inches)) * 2.54;
    const a = parseFloat(age);
    const act = parseFloat(activity);

    let bmr =
      gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * act;

    setResult({
      bmr,
      tdee,
      deficit: tdee - 500,
      surplus: tdee + 300,
    });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-yellow-500/30 overflow-hidden">
      <CardHeader className="relative">
        <Button variant="ghost" onClick={onBack} className="w-fit mb-4 hover:bg-yellow-500/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calculators
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Flame className="w-7 h-7 text-yellow-400" />
          </div>
          <div>
            <CardTitle className="text-2xl">TDEE Calculator</CardTitle>
            <CardDescription>Total Daily Energy Expenditure</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Age + Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Age</Label>
            <Input value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="25" />
          </div>

          <div>
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Height (ft + in) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Height (feet)</Label>
            <Input value={feet} onChange={(e) => setFeet(e.target.value)} type="number" placeholder="5" />
          </div>
          <div>
            <Label>Height (inches)</Label>
            <Input value={inches} onChange={(e) => setInches(e.target.value)} type="number" placeholder="9" />
          </div>
        </div>

        {/* Weight */}
        <div>
          <Label>Weight (kg)</Label>
          <Input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="70" />
        </div>

        {/* Activity */}
        <div>
          <Label>Activity Level</Label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1.2">Sedentary (desk job, no exercise)</SelectItem>
              <SelectItem value="1.375">Light (walking, light exercise)</SelectItem>
              <SelectItem value="1.55">Moderate (regular gym, 3-4x/week)</SelectItem>
              <SelectItem value="1.725">Active (heavy training 5-6x/week)</SelectItem>
              <SelectItem value="1.9">Very Active (professional training)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-yellow-500 hover:bg-yellow-500/90 text-black" onClick={calculate}>
            <Calculator className="w-4 h-4 mr-2" /> Calculate TDEE
          </Button>

          <Button variant="outline" onClick={() => {
            setAge("");
            setFeet("");
            setInches("");
            setWeight("");
            setResult(null);
          }}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-background/50 border rounded-xl"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">BMR</div>
                  <div className="text-2xl font-bold">{Math.round(result.bmr)}</div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="text-sm text-yellow-400 mb-1">TDEE</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.round(result.tdee)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg text-center">
                  <div className="text-sm text-pink-400 mb-1">Fat Loss</div>
                  <div className="text-xl font-bold text-pink-400">
                    {Math.round(result.deficit)}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
                  <div className="text-sm text-primary mb-1">Muscle Gain</div>
                  <div className="text-xl font-bold text-primary">
                    {Math.round(result.surplus)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}

//
// ██╗██████╗ ███████╗ █████╗ ██╗      ██╗    ██╗███████╗██╗████████╗
// ██║██╔══██╗██╔════╝██╔══██╗██║      ██║    ██║██╔════╝██║╚══██╔══╝
// ██║██████╔╝█████╗  ███████║██║      ██║ █╗ ██║█████╗  ██║   ██║
// ██║██╔══██╗██╔══╝  ██╔══██║██║      ██║███╗██║██╔══╝  ██║   ██║
// ██║██║  ██║███████╗██║  ██║███████╗ ██╔██╗██║██║     ██║   ██║
// ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝ ╚═╝╚═╝╚═╝╚═╝     ╚═╝   ╚═╝
// IDEAL WEIGHT (Devine Formula) with ft + inches
//

function IdealWeightCalculator({ onBack }: { onBack: () => void }) {
  const [gender, setGender] = useState("male");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState<{ min: number; max: number; ideal: number } | null>(null);

  const calculate = () => {
    const totalInches = parseFloat(feet) * 12 + parseFloat(inches);

    let ideal =
      gender === "male"
        ? 50 + 2.3 * (totalInches - 60)
        : 45.5 + 2.3 * (totalInches - 60);

    const min = ideal * 0.9;
    const max = ideal * 1.1;

    setResult({ min, max, ideal });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-purple-500/30 overflow-hidden">
      <CardHeader className="relative">
        <Button variant="ghost" onClick={onBack} className="w-fit mb-4 hover:bg-purple-500/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calculators
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Target className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-2xl">Ideal Weight Calculator</CardTitle>
            <CardDescription>Devine Formula</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        <div>
          <Label>Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height (ft + in) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Height (feet)</Label>
            <Input value={feet} onChange={(e) => setFeet(e.target.value)} type="number" placeholder="5" />
          </div>
          <div>
            <Label>Height (inches)</Label>
            <Input value={inches} onChange={(e) => setInches(e.target.value)} type="number" placeholder="7" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-purple-500 hover:bg-purple-500/90" onClick={calculate}>
            <Calculator className="w-4 h-4 mr-2" /> Calculate Ideal Weight
          </Button>
          <Button variant="outline" onClick={() => { setFeet(""); setInches(""); setResult(null); }}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-background/50 border rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-purple-400">{result.ideal.toFixed(1)} kg</div>
              <div className="text-sm mt-2 text-muted-foreground">
                Healthy Range: {result.min.toFixed(1)} – {result.max.toFixed(1)} kg
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}

//
// ██████╗ ██████╗ ██████╗ ████████╗███████╗██╗███╗   ██╗███████╗
// ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██║████╗  ██║██╔════╝
// ██████╔╝██║  ██║██████╔╝   ██║   █████╗  ██║██╔██╗ ██║███████╗
// ██╔══██╗██║  ██║██╔══██╗   ██║   ██╔══╝  ██║██║╚██╗██║╚════██║
// ██║  ██║██████╔╝██║  ██║   ██║   ██║     ██║██║ ╚████║███████║
// ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝
// PROTEIN CALCULATOR (unchanged)
//

function ProteinCalculator({ onBack }: { onBack: () => void }) {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("moderate");

  const [result, setResult] = useState<{ min: number; max: number; optimal: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    let multiplier = { min: 1.4, max: 1.8, optimal: 1.6 };

    switch (activity) {
      case "sedentary": multiplier = { min: 0.8, max: 1.0, optimal: 0.9 }; break;
      case "light": multiplier = { min: 1.0, max: 1.4, optimal: 1.2 }; break;
      case "moderate": multiplier = { min: 1.4, max: 1.8, optimal: 1.6 }; break;
      case "intense": multiplier = { min: 1.8, max: 2.2, optimal: 2.0 }; break;
      case "athlete": multiplier = { min: 2.0, max: 2.5, optimal: 2.2 }; break;
    }

    setResult({
      min: w * multiplier.min,
      max: w * multiplier.max,
      optimal: w * multiplier.optimal,
    });
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-pink-500/30 overflow-hidden">
      <CardHeader>
        <Button variant="ghost" onClick={onBack} className="w-fit mb-4 hover:bg-pink-500/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calculators
        </Button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Beef className="w-7 h-7 text-pink-400" />
          </div>
          <div>
            <CardTitle className="text-2xl">Protein Intake Calculator</CardTitle>
            <CardDescription>Daily optimal protein intake</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Weight */}
        <div>
          <Label>Body Weight (kg)</Label>
          <Input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="70" />
        </div>

        {/* Activity */}
        <div>
          <Label>Activity Level</Label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
            <SelectItem value="sedentary">Sedentary (desk job, no exercise)</SelectItem>
            <SelectItem value="light">Light Activity (walking, light exercise)</SelectItem>
            <SelectItem value="moderate">Moderate (regular gym, 3-4x/week)</SelectItem>
            <SelectItem value="intense">Intense (heavy training 5-6x/week)</SelectItem>
            <SelectItem value="athlete">Athlete (professional training)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-pink-500 hover:bg-pink-500/90" onClick={calculate}>
            <Calculator className="w-4 h-4 mr-2" /> Calculate Protein
          </Button>

          <Button variant="outline" onClick={() => { setWeight(""); setResult(null); }}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-background/50 border rounded-xl text-center"
            >
              <div className="text-4xl font-bold text-pink-400">{Math.round(result.optimal)}g</div>
              <div className="mt-2 text-muted-foreground">
                Range: {Math.round(result.min)}g – {Math.round(result.max)}g per day
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}

//
// ██████╗  █████╗  ██████╗██╗███████╗
// ██╔══██╗██╔══██╗██╔════╝██║██╔════╝
// ██████╔╝███████║██║     ██║███████╗
// ██╔══██╗██╔══██║██║     ██║╚════██║
// ██║  ██║██║  ██║╚██████╗██║███████║
// ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝╚══════╝
// PAGE WRAPPER
//

export default function Calculators() {
  const [, setLocation] = useLocation();
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>(null);

  const calculators: { id: CalculatorType; title: string; description: string; icon: any; variant: string }[] = [
    { id: "bmi", title: "BMI Calculator", description: "Body Mass Index", icon: Scale, variant: "green" },
    { id: "bodyfat", title: "Body Fat %", description: "US Navy Body Fat", icon: Percent, variant: "blue" },
    { id: "tdee", title: "TDEE Calculator", description: "Maintenance Calories", icon: Flame, variant: "yellow" },
    { id: "idealweight", title: "Ideal Weight", description: "Healthy Weight Range", icon: Target, variant: "purple" },
    { id: "protein", title: "Protein Intake", description: "Daily Protein Needs", icon: Beef, variant: "pink" },
  ];

  return (
    <PageWrapper>
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">

            {!activeCalculator ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button variant="ghost" className="mb-8" onClick={() => setLocation("/")}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>

                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                    Fitness <span className="text-primary neon-text">Calculators</span>
                  </h1>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Understand your body better with science-based calculations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calculators.map((calc, index) => (
                    <motion.div
                      key={calc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CalculatorCard
                        title={calc.title}
                        description={calc.description}
                        icon={calc.icon}
                        variant={calc.variant}
                        onClick={() => setActiveCalculator(calc.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {activeCalculator === "bmi" && <BMICalculator onBack={() => setActiveCalculator(null)} />}
                {activeCalculator === "bodyfat" && <BodyFatCalculator onBack={() => setActiveCalculator(null)} />}
                {activeCalculator === "tdee" && <TDEECalculator onBack={() => setActiveCalculator(null)} />}
                {activeCalculator === "idealweight" && <IdealWeightCalculator onBack={() => setActiveCalculator(null)} />}
                {activeCalculator === "protein" && <ProteinCalculator onBack={() => setActiveCalculator(null)} />}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}

