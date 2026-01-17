import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Sparkles, Crown, Rocket, Target } from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [, setLocation] = useLocation();

  const plans = [
    {
      name: "Basic Fitness Blueprint",
      price: "₹799",
      period: "/ one-time",
      description: "A clear, customized fitness roadmap you can follow independently.",
      features: [
        "Detailed assessment report",
        "Customized diet plan",
        "Customized workout plan (home or gym)",
        "Clear calorie & goal guidance",
      ],
      bestFor: [
        "Self-motivated users",
        "People who want a plan without ongoing coaching",
        "Anyone needing clarity before committing long-term",
      ],
      popular: false,
      icon: Sparkles,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      ctaText: "👉 Get My Fitness Blueprint",
    },
    {
      name: "Smart Coaching",
      price: "₹1299",
      period: "/ month",
      description: "Structured coaching built for consistency, accountability, and real progress.",
      features: [
        "Daily check-ins",
        "Customized diet plan",
        "Customized workout plan (home or gym)",
        "Body weight & progress monitoring",
        "Personal dashboard access",
        "Workout partner assistance",
        "Progress & streak tracking",
        "2 one-to-one consultation sessions per month",
      ],
      bestFor: [
        "Beginners starting their fitness journey",
        "People who need accountability & structure",
        "Busy professionals who need guidance without overwhelm",
      ],
      popular: true,
      icon: Crown,
      gradient: "from-primary/20 to-accent/20",
      borderColor: "border-primary/50",
      ctaText: "👉 Start My Coaching Journey",
    },
    {
      name: "Coaching Plus",
      price: "₹1999",
      period: "/ month",
      description: "Advanced coaching with form correction and real-life food decisions.",
      features: [
        "Everything in Smart Coaching",
        "Customized diet plan",
        "Customized workout plan (home or gym)",
        "Video-based workout assistance",
        "Posture & form correction",
        "Travel & hotel food guidance",
        "Smart food swaps & meal framing",
        "Lifestyle-based nutrition decisions",
      ],
      bestFor: [
        "Users who want faster, cleaner results",
        "Frequent travelers or people who eat out often",
        "Anyone struggling with exercise form or posture",
      ],
      popular: false,
      icon: Rocket,
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      ctaText: "👉 Upgrade to Coaching Plus",
    },
    {
      name: "8-Week Transformation PRO",
      price: "₹2,999",
      period: "/ 8 weeks",
      description: "High-touch transformation coaching for serious, visible results.",
      features: [
        "Everything in Coaching Plus",
        "Customized diet plan",
        "Customized workout plan (home or gym)",
        "Weekly transformation reviews",
        "Priority WhatsApp support",
        "Advanced progress analysis",
        "Habit & mindset coaching",
        "Maintenance roadmap after completion",
      ],
      bestFor: [
        "People committed to a visible body transformation",
        "Users stuck despite trying multiple plans",
        "Anyone wanting hands-on, priority-level coaching",
      ],
      popular: false,
      icon: Rocket,
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      ctaText: "👉 Commit to My Transformation",
    },
  ];

  return (
    <PageWrapper>
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="mb-8 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          <motion.div 
            className="text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tighter italic">
              SELECT YOUR <span className="text-primary neon-text">ELITE PLAN</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Join the high-performance community. No compromises. Just pure, science-backed results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                  className={plan.popular ? "lg:-mt-6 lg:mb-6" : ""}
                >
                  <Card
                    className={`
                      relative overflow-hidden h-full
                      bg-white/[0.03] backdrop-blur-2xl
                      border-white/5
                      transition-all duration-500
                      hover:scale-[1.03] hover:-translate-y-2
                      hover:border-primary/20 hover:bg-white/[0.05]
                      group rounded-[2.5rem]
                      ${plan.popular ? "shadow-[0_20px_50px_rgba(0,255,157,0.15)] ring-1 ring-primary/20" : ""}
                    `}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none`} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
                    
                    {plan.popular && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2">
                        <Badge className="px-6 py-1.5 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-b-2xl rounded-t-none shadow-[0_4px_20px_rgba(0,255,157,0.4)] border-none">
                          TOP CHOICE
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="relative space-y-4 pb-8 pt-12 px-8">
                      <div className="w-16 h-16 rounded-3xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Icon className={cn("w-8 h-8", plan.popular ? "text-primary animate-pulse" : "text-white/60")} />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-2xl text-center font-display font-black tracking-wider uppercase italic">{plan.name}</CardTitle>
                        <div className="h-1 w-12 bg-primary/40 mx-auto rounded-full group-hover:w-20 transition-all duration-500" />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black font-display text-white tracking-tighter">{plan.price}</span>
                          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{plan.period}</span>
                        </div>
                      </div>
                      <CardDescription className="text-sm text-center font-medium leading-relaxed opacity-70 px-4">{plan.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative space-y-8 px-8 pb-12">
                      <ul className="space-y-4">
                        {plan.features.map((feature, idx) => (
                          <motion.li 
                            key={idx} 
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.05 }}
                          >
                            <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm font-semibold text-white/70 group-hover:text-white/90 transition-colors">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Best For Section */}
                      <div className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 space-y-3 group-hover:bg-white/[0.04] transition-colors">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                          <Target className="w-3 h-3" />
                          Target Profile
                        </p>
                        <ul className="space-y-2">
                          {plan.bestFor.map((point, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground leading-tight">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        className={cn(
                          "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500",
                          plan.popular 
                            ? "bg-primary text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
                            : "bg-white/5 text-white hover:bg-white hover:text-black border-white/10"
                        )}
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => setLocation("/intake")}
                      >
                        {plan.ctaText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm border border-accent/30 neon-border-blue">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none rounded-lg" />
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-display text-center">Need a Custom Plan?</CardTitle>
                <CardDescription className="text-center">
                  We offer personalised coaching for corporate teams, athletes, or special goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative text-center">
                <Button variant="outline" size="lg" onClick={() => setLocation("/intake")} className="hover:bg-accent/10 hover:border-accent/50">
                  Contact for Custom Pricing
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
