import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Sparkles, Crown, Rocket } from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";

export default function Pricing() {
  const [, setLocation] = useLocation();

  const plans = [
    {
      name: "Weekly Starter Plan",
      price: "₹199",
      period: "/week",
      description: "Perfect for beginners who want light guidance and a basic structured plan",
      features: [
        "Basic personalised diet",
        "Basic workout plan",
        "Weekly check-in",
        "Light guidance",
        "No mid-week adjustments"
      ],
      popular: false,
      icon: Sparkles,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      name: "4-Week Coaching Plan",
      price: "₹699",
      period: "/4 weeks",
      description: "Full coaching experience with adjustments, support & complete personalization",
      features: [
        "Fully personalised diet plan",
        "Custom workout plan (home/gym)",
        "Weekly check-ins",
        "Weekly adjustments",
        "WhatsApp support (reasonable hours)",
        "Lifestyle habit guidance"
      ],
      popular: true,
      icon: Crown,
      gradient: "from-primary/20 to-accent/20",
      borderColor: "border-primary/50",
    },
    {
      name: "8-Week Transformation Plan",
      price: "₹1499",
      period: "/8 weeks",
      description: "Complete transformation program with priority support and weekly upgrades",
      features: [
        "Everything in 4-week plan",
        "Weekly personalised updates",
        "Habit & lifestyle coaching",
        "Priority support",
        "Form review (video-based)",
        "Progress tracking",
        "End-of-program review",
        "Maintenance strategy"
      ],
      popular: false,
      icon: Rocket,
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
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
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Choose Your <span className="text-primary neon-text">Coaching Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing. No hidden charges. Choose the plan that fits your goal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className={plan.popular ? "md:-mt-4 md:mb-4" : ""}
                >
                  <Card
                    className={`
                      relative overflow-hidden h-full
                      bg-card/80 backdrop-blur-sm
                      border ${plan.borderColor}
                      transition-all duration-300
                      hover:scale-[1.02]
                      ${plan.popular ? "neon-glow" : ""}
                    `}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} pointer-events-none`} />
                    
                    {plan.popular && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2">
                        <Badge className="px-4 py-1 bg-primary text-primary-foreground rounded-b-lg rounded-t-none neon-glow">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="relative space-y-4 pb-8 pt-8">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-2xl text-center font-display">{plan.name}</CardTitle>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold font-display text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <CardDescription className="text-base text-center">{plan.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <motion.li 
                            key={idx} 
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.05 }}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm text-foreground/90">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${plan.popular ? "neon-glow bg-primary hover:bg-primary/90" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        onClick={() => setLocation("/intake")}
                      >
                        Get Started
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
