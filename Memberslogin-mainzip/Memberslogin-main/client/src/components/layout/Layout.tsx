import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Calendar, 
  Utensils, 
  TrendingUp, 
  User, 
  Settings, 
  Menu, 
  Activity,
  HeartPulse
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavItem = ({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) => (
  <Link href={href}>
    <a className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]" 
        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
    )}>
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active && "animate-pulse")} />
      <span className="font-medium tracking-wide">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,157,0.8)]" />}
    </a>
  </Link>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/app", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/app/bodymap", icon: Activity, label: "Body Map" },
    { href: "/app/workouts", icon: Dumbbell, label: "Workouts" },
    { href: "/app/workout-partner", icon: HeartPulse, label: "Workout Partner" },
    { href: "/app/plans", icon: Calendar, label: "Plans" },
    { href: "/app/nutrition", icon: Utensils, label: "Nutrition" },
    { href: "/app/progress", icon: TrendingUp, label: "Progress" },
    { href: "/app/profile", icon: User, label: "Profile" },
    { href: "/app/streak", icon: Calendar, label: "Streak" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-white/5">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.4)]">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-widest">
            CAP'S<span className="text-primary">FITNESS</span>
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem 
            key={item.href} 
            {...item} 
            active={location === item.href} 
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Current Plan</p>
          <p className="font-display font-bold text-sm text-white">Hybrid Athlete</p>
          <div className="w-full bg-black/40 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full w-[65%] shadow-[0_0_10px_rgba(0,255,157,0.5)]" />
          </div>
          <p className="text-[10px] text-right text-primary mt-1">Week 4 / 8</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl">CAP'S<span className="text-primary">FITNESS</span></span>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r border-white/10 bg-black w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 w-full min-h-screen overflow-y-auto pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="container mx-auto p-4 lg:p-8 max-w-7xl animate-in fade-in duration-500">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Nav (Optional, for app-like feel) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-white/10 h-16 flex items-center justify-around z-40 px-2 pb-safe">
        {navItems.slice(0, 5).map((item) => (
           <Link key={item.href} href={item.href}>
             <a className={cn(
               "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
               location === item.href ? "text-primary" : "text-muted-foreground"
             )}>
               <item.icon className="w-5 h-5 mb-1" />
               <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
             </a>
           </Link>
        ))}
      </div>
    </div>
  );
}
