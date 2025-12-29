import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, User, Lock, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";

const ADMIN_USERNAME = "Iamadmincap";
const ADMIN_PASSWORD = "Capfitness@2025";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { adminLogin } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      adminLogin();
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin panel",
      });
      setLocation("/admin");
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse" />
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

        <Card className="bg-card/80 backdrop-blur-lg border-destructive/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-xl bg-destructive/20 flex items-center justify-center border border-destructive/30">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-display">
                <span className="text-foreground">Admin </span>
                <span className="text-destructive">Access</span>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Secure Login Required
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-11 bg-background/50 border-border/50 focus:border-destructive"
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
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 bg-background/50 border-border/50 focus:border-destructive"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Access Admin Panel
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <p className="text-xs text-muted-foreground text-center">
                This area is restricted to authorized administrators only.
                All login attempts are monitored and logged.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
