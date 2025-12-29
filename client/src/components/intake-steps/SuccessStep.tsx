import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Sparkles, Dumbbell } from "lucide-react";
import { useLocation } from "wouter";

export default function SuccessStep() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        className="relative z-10 max-w-2xl w-full text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative">
            <div className="rounded-full bg-primary/20 p-6 neon-glow animate-glow-pulse">
              <CheckCircle2 className="w-24 h-24 text-primary" data-testid="icon-success" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Bravo, you <span className="text-primary neon-text">nailed it!</span>
          </h1>
        </motion.div>

        <motion.div 
          className="bg-card/80 backdrop-blur-sm border border-primary/30 neon-border rounded-2xl p-8 space-y-4 max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <p className="text-lg text-foreground font-medium">
            Thank you for completing your assessment!
          </p>
          <p className="text-sm text-muted-foreground">
            Cap is reviewing your information and will reach out within 24-48 hours 
            with your personalized fitness plan tailored to your goals and preferences.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            onClick={() => setLocation("/")}
            className="neon-glow bg-primary hover:bg-primary/90"
            data-testid="button-home"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        <motion.p 
          className="text-sm text-muted-foreground pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Your fitness transformation starts now. Stay motivated!
        </motion.p>
      </motion.div>
    </div>
  );
}
