import { login as sheetLogin } from "@/lib/googleSheetsApi";
import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import capLogo from "@/assets/cap-logo.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const profile = await sheetLogin(email, password);

    if (!profile) {
      throw new Error("Invalid credentials");
    }

    // Store user in auth context
  login({
  ...profile,
  userId: profile.user_id, // 🔥 THIS IS THE FIX
});


    toast({
      title: "Welcome back!",
      description: `Logged in as ${profile.name}`,
    });

    setLocation("/app");
  } catch (error) {
    console.error("Login error:", error);
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-card/80 backdrop-blur-lg border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={capLogo} alt="Cap's Fitness" className="w-20 h-20 object-contain" />
            </div>
            <div>
              <CardTitle className="text-3xl font-display">
                <span className="text-foreground">Cap's </span>
                <span className="text-primary neon-text">FITNESS</span>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Member Login
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 neon-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Access Dashboard
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground text-center mb-2">
                To Register Contact Cap's Fitness
              </p>
              <div className="text-xs text-center space-y-1">
                <p>
                  <span className="text-primary">One step close to building it! </span>
                </p>
                 </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
