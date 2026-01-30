import { login as sheetLogin, verifyUserAge, resetPassword } from "@/lib/googleSheetsApi";
import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, ArrowLeft, KeyRound, Calendar, Eye, EyeOff, X, CheckCircle } from "lucide-react";
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
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'verify' | 'reset' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotAge, setForgotAge] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStep('email');
    setForgotEmail("");
    setForgotAge("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleVerifyAge = async () => {
    if (!forgotEmail || !forgotAge) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and age",
        variant: "destructive",
      });
      return;
    }

    setForgotLoading(true);
    try {
      const result = await verifyUserAge(forgotEmail, parseInt(forgotAge));
      if (result.ok) {
        setForgotStep('reset');
        toast({
          title: "Verified!",
          description: "Age verified successfully. You can now set a new password.",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "The age you entered does not match our records.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify. Please try again.",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Missing Password",
        description: "Please enter and confirm your new password",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setForgotLoading(true);
    try {
      const result = await resetPassword(forgotEmail, newPassword);
      if (result.ok) {
        setForgotStep('success');
        toast({
          title: "Password Updated!",
          description: "Your password has been changed successfully.",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: "Failed to update password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

    try {
      const profile = await sheetLogin(email, password);

      if (!profile) {
        throw new Error("Invalid credentials");
      }

      // Plan expiration check
      if (profile.plan_end_date) {
        const endDate = new Date(profile.plan_end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (endDate < today) {
          toast({
            title: "Plan Expired",
            description: "Plan expired, contact Cap's Coach to re-activate your account.",
            variant: "destructive",
          });
          return;
        }
      }

      // Store user in auth context
      login({
        user_id: profile.user_id,
        email: profile.email,
        name: profile.name,
        gender: profile.gender,
        age: Number(profile.age),
        height_cm: Number(profile.height_cm),
        muscle_mass: 'medium', // Defaulting since it's missing from profile
        starting_weight: Number(profile.starting_weight),
        current_weight: Number(profile.current_weight),
        goal_weight: Number(profile.goal_weight),
        calorie_target: Number(profile.calorie_target),
        protein_target: Number(profile.protein_target),
        carbs_target: Number(profile.carbs_target),
        fats_target: Number(profile.fats_target),
        plan_assigned: profile.plan_assigned || '',
        plan_start_date: profile.plan_start_date,
        plan_end_date: profile.plan_end_date,
        next_session_date: profile.next_session_date,
        currentStreak: 0
      } as any);


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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
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

      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && resetForgotPassword()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-primary/20 rounded-2xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={resetForgotPassword}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {forgotStep === 'success' ? 'Password Changed!' : 'Reset Password'}
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                  {forgotStep === 'email' && "Enter your email and verify your age"}
                  {forgotStep === 'reset' && "Create your new password"}
                  {forgotStep === 'success' && "You can now login with your new password"}
                </p>
              </div>

              {forgotStep === 'email' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="your@email.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="pl-11 bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="forgot-age">Confirm Your Age</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="forgot-age"
                        type="number"
                        placeholder="Enter your age"
                        value={forgotAge}
                        onChange={(e) => setForgotAge(e.target.value)}
                        className="pl-11 bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the age you registered with to verify your identity
                    </p>
                  </div>

                  <Button
                    onClick={handleVerifyAge}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Continue"
                    )}
                  </Button>
                </div>
              )}

              {forgotStep === 'reset' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-11 pr-11 bg-background/50 border-border/50 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 pr-11 bg-background/50 border-border/50 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Updating Password...
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              )}

              {forgotStep === 'success' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                  </div>
                  <Button
                    onClick={resetForgotPassword}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5"
                  >
                    Back to Login
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
