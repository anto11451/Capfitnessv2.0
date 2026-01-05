import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  Users, 
  Target, 
  TrendingUp, 
  UserCircle,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";

const guideItems = [
  {
    title: "Dashboard",
    description: "Your daily mission control. See what's next and track your core stats.",
    icon: LayoutDashboard,
    path: "/app",
    color: "text-primary"
  },
  {
    title: "Workouts",
    description: "Science-based training programs tailored to your current body type and goals.",
    icon: Dumbbell,
    path: "/app/workouts",
    color: "text-blue-500"
  },
  {
    title: "Nutrition",
    description: "Fuel your progress with macro tracking, protein hacks, and performance recipes.",
    icon: Utensils,
    path: "/app/nutrition",
    color: "text-accent"
  },
  {
    title: "Workout Partner",
    description: "Real-time AI posture correction to ensure every rep counts toward your results.",
    icon: Users,
    path: "/app/workout-partner",
    color: "text-secondary"
  },
  {
    title: "Plans",
    description: "View your full multi-week transformation roadmap and scheduled sessions.",
    icon: Target,
    path: "/app/plans",
    color: "text-orange-500"
  },
  {
    title: "Progress",
    description: "Visual charts and data history showing your weight, strength, and consistency.",
    icon: TrendingUp,
    path: "/app/progress",
    color: "text-indigo-500"
  },
  {
    title: "Body Analysis",
    description: "Deep dive into your current metrics, BMI, and ideal transformation targets.",
    icon: UserCircle,
    path: "/app/bodymap",
    color: "text-primary"
  }
];

export default function GuidePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4">
        <header className="space-y-2">
          <p className="text-primary text-xs uppercase tracking-[0.2em] font-bold">Orientation</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">GUIDE</span>
          </h1>
          <p className="text-muted-foreground text-sm">Everything you need to master your transformation.</p>
        </header>

        <div className="grid gap-4">
          {guideItems.map((item, i) => (
            <Link key={i} href={item.path}>
              <Card className="bg-white/[0.02] border-white/5 p-6 rounded-3xl hover:bg-white/[0.04] transition-all cursor-pointer group flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Card>
            </Link>
          ))}
        </div>

        <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] text-center space-y-4">
          <p className="text-white font-bold">Still have questions?</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Our AI Guide is available 24/7 at the bottom right of your screen to help you navigate or answer quick queries.
          </p>
        </div>
      </div>
    </Layout>
  );
}
