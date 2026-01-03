import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "./PageWrapper";
import ChatBot from "./ChatBot";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PageWrapper>
      {/* FLOATING ROBOT COACH */}
      <motion.div
        className="fixed left-6 bottom-32 z-50 flex flex-col items-center gap-2 group"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/calculators")}
            className="w-16 h-16 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 group-hover:border-primary/50 transition-all flex items-center justify-center relative z-10"
          >
            <Bot className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          </Button>
          
          <motion.div 
            className="absolute left-20 top-1/2 -translate-y-1/2 bg-black/80 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Coach Bot</p>
            <p className="text-sm text-white font-medium">Click me to calculate your stats!</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* CHATBOT */}
      <ChatBot 
        onNavigateToSection={scrollToSection}
        onNavigateToRoute={setLocation}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,hsla(150,100%,50%,0.15),transparent_60%)] blur-[160px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight">
              <span className="text-foreground">Cap's </span>
              <span className="text-primary uppercase">Fitness</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              One-to-one online fitness coaching, not templates but built around you.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => setLocation("/intake")}
                className="neon-glow bg-primary hover:bg-primary/90 text-lg px-10 py-7 font-bold text-black rounded-full transition-all hover:scale-105"
              >
                Enroll Now
              </Button>

              <Button 
                variant="outline"
                size="lg" 
                onClick={() => setLocation("/quiz")}
                className="border-white/10 text-lg px-10 py-7 hover:bg-white/5 rounded-full transition-all"
              >
                Take Fitness Assessment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CURIOSITY TEXT */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-white font-light italic"
          >
            “Most people don’t fail. They’re just following the wrong plan.”
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-primary font-medium"
          >
            “Clarity creates consistency.”
          </motion.p>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-black/20 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            {[
              "Explore the program and approach",
              "Get a personalised workout & diet plan",
              "Train with guidance and track progress"
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-8 group"
              >
                <span className="text-4xl md:text-6xl font-display font-bold text-white/10 group-hover:text-primary/20 transition-colors">0{index + 1}</span>
                <p className="text-xl md:text-2xl text-white/80 font-light">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ONE-TO-ONE COACHING EMPHASIS */}
      <section id="coaching-emphasis" className="py-32 border-y border-white/5 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-display font-bold text-white leading-tight"
          >
            This is not a library of workouts.<br />
            Every plan is custom-built, trained individually, and guided personally.
          </motion.h2>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => setLocation("/intake")}
              className="neon-glow bg-primary hover:bg-primary/90 text-lg px-10 py-7 font-bold text-black rounded-full transition-all hover:scale-105"
            >
              Enroll Now
            </Button>

            <Button 
              variant="outline"
              size="lg" 
              onClick={() => setLocation("/quiz")}
              className="border-white/10 text-lg px-10 py-7 hover:bg-white/5 rounded-full transition-all"
            >
              Take Fitness Assessment
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
