import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dumbbell, 
  Menu, 
  X, 
  Home, 
  Calculator, 
  BookOpen, 
  ClipboardList,
  DollarSign,
  Users,
  Newspaper,
  HelpCircle,
  LogIn,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Tools", path: "/calculators", icon: Calculator },
  { name: "Knowledge", path: "/knowledge", icon: BookOpen },
  { name: "Quiz", path: "/quiz", icon: HelpCircle },
  { name: "Pricing", path: "/pricing", icon: DollarSign },
  { name: "About", path: "/about", icon: Users },
  { name: "Blog", path: "/blog", icon: Newspaper },
];

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setLocation("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-primary">
              Cap's FITNESS
            </span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    flex items-center gap-2
                    ${isActive 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </motion.button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button 
              onClick={() => setLocation("/admin-login")}
              variant="ghost"
              className="text-secondary hover:bg-secondary/20 hover:text-secondary border border-transparent hover:border-secondary/30"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <Button 
              onClick={() => setLocation("/login")}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white font-bold neon-glow-accent"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Members - Click Here
            </Button>
            <Button 
              onClick={() => setLocation("/intake")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-primary"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Start Assessment
            </Button>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card/95 backdrop-blur-lg border-b border-border/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      setLocation(item.path);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 rounded-lg text-left font-medium
                      flex items-center gap-3 transition-all
                      ${isActive 
                        ? "bg-primary/20 text-primary border border-primary/30" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </motion.button>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4 space-y-2"
              >
                <Button 
                  onClick={() => {
                    setLocation("/admin-login");
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="w-full text-secondary hover:bg-secondary/20 border border-secondary/30"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
                <Button 
                  onClick={() => {
                    setLocation("/login");
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-white font-bold neon-glow-accent"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Members - Click Here
                </Button>
                <Button 
                  onClick={() => {
                    setLocation("/intake");
                    setIsOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 neon-glow-primary"
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
