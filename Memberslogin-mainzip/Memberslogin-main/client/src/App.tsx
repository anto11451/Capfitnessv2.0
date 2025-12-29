import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createContext, useContext, useState, useEffect } from "react";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import WorkoutsPage from "@/pages/WorkoutsPage";
import PlansPage from "@/pages/PlansPage";
import NutritionPage from "@/pages/NutritionPage";
import ProgressPage from "@/pages/ProgressPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";
import BodyMapPage from "@/pages/BodyMapPage";
import StreakPage from "@/pages/StreakPage";
import WorkoutPartnerPage from "@/pages/WorkoutPartnerPage";

import Home from "@/pages/marketing/Home";
import About from "@/pages/marketing/About";
import Pricing from "@/pages/marketing/Pricing";
import Blog from "@/pages/marketing/Blog";
import BlogDetail from "@/pages/marketing/BlogDetail";
import Calculators from "@/pages/marketing/Calculators";
import Knowledge from "@/pages/marketing/Knowledge";
import Quiz from "@/pages/marketing/Quiz";
import Privacy from "@/pages/marketing/Privacy";
import Terms from "@/pages/marketing/Terms";
import Intake from "@/pages/marketing/Intake";

import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";

interface User {
  email: string;
  name: string;
  gender: string;
  planAssigned: string;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  workoutSchedule: string;
  programStartDate: string;
  programEndDate: string;
  nextSession: string;
  startingWeight: number;
  currentWeight: number;
  goalWeight: number;
  currentStreak: number;
  height?: number;
  weight?: number;
  muscleMass?: string;
  userId?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (user: User) => void;
  adminLogin: () => void;
  logout: () => void;
  updateStreak: (newStreak: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  login: () => {},
  adminLogin: () => {},
  logout: () => {},
  updateStreak: () => {},
});

export const useAuth = () => useContext(AuthContext);

function Router() {
  const { user, isAdmin } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/calculators" component={Calculators} />
      <Route path="/knowledge" component={Knowledge} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/intake" component={Intake} />
      
      <Route path="/login" component={LoginPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      
      {user && (
        <>
          <Route path="/app" component={Dashboard} />
          <Route path="/app/dashboard" component={Dashboard} />
          <Route path="/app/workouts" component={WorkoutsPage} />
          <Route path="/app/plans" component={PlansPage} />
          <Route path="/app/nutrition" component={NutritionPage} />
          <Route path="/app/progress" component={ProgressPage} />
          <Route path="/app/profile" component={ProfilePage} />
          <Route path="/app/bodymap" component={BodyMapPage} />
          <Route path="/app/streak" component={StreakPage} />
          <Route path="/app/workout-partner" component={WorkoutPartnerPage} />
        </>
      )}
      
      {isAdmin && (
        <Route path="/admin" component={AdminPage} />
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("capsfitness_user");
    const storedAdmin = localStorage.getItem("capsfitness_admin");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAdmin === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("capsfitness_user", JSON.stringify(userData));
  };

  const adminLogin = () => {
    setIsAdmin(true);
    localStorage.setItem("capsfitness_admin", "true");
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("capsfitness_user");
    localStorage.removeItem("capsfitness_admin");
  };

  const updateStreak = (newStreak: number) => {
    if (user) {
      const updatedUser = { ...user, currentStreak: newStreak };
      setUser(updatedUser);
      localStorage.setItem("capsfitness_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, adminLogin, logout, updateStreak }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
