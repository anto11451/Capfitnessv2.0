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
  HeartPulse,
  Zap,
  Flame,
  Layout as SidebarIcon
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import capLogo from '@/assets/cap-logo.png';
import { motion } from "framer-motion";

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
    { href: "/app/bodymap", icon: Zap, label: "Body Map" },
    { href: "/app/workouts", icon: Dumbbell, label: "Workouts" },
    { href: "/app/workout-partner", icon: HeartPulse, label: "Workout Partner" },
    { href: "/app/plans", icon: Calendar, label: "Plans" },
    { href: "/app/nutrition", icon: Utensils, label: "Nutrition" },
    { href: "/app/progress", icon: TrendingUp, label: "Progress" },
    { href: "/app/streak", icon: Flame, label: "Streak" },
    { href: "/app/profile", icon: User, label: "Profile" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-white/5">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={capLogo} alt="Cap's Fitness" className="w-10 h-10 object-contain" />
          <h1 className="text-lg font-display font-bold text-white tracking-widest uppercase">
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
          <img src={capLogo} alt="Cap's Fitness" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-lg">CAP'S<span className="text-primary">FITNESS</span></span>
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
      
      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/10 h-[72px] flex items-center justify-around z-40 px-2 pb-safe safe-area-inset-bottom">
        {navItems.filter(item => ["Dashboard", "Plans", "Streak", "Progress", "Profile"].includes(item.label)).map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex flex-col items-center justify-center p-3 min-w-[56px] rounded-xl transition-all duration-300 relative group touch-manipulation",
                isActive ? "text-primary scale-105" : "text-muted-foreground/60 hover:text-white active:text-white"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -inset-1 bg-primary/20 rounded-xl blur-md"
                  />
                )}
                <item.icon className={cn(
                  "w-6 h-6 mb-1.5 transition-all duration-300",
                  isActive ? "drop-shadow-[0_0_8px_rgba(0,255,157,0.6)]" : "group-hover:scale-110 group-active:scale-110"
                )} />
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-tight transition-all duration-300",
                  isActive ? "opacity-100 translate-y-0" : "opacity-70"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(0,255,157,1)]" />
                )}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
