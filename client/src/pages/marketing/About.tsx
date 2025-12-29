import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Heart, Zap, Award, Dumbbell, Brain, Users, Clock } from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";

export default function About() {
  const [, setLocation] = useLocation();

  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "We focus on measurable outcomes and sustainable progress",
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Every client gets a custom plan tailored to their unique needs",
      color: "text-pink-500",
      bgColor: "bg-pink-500/20",
    },
    {
      icon: Zap,
      title: "Science-Based",
      description: "Our methods are backed by the latest research and proven techniques",
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in coaching and client service",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
  ];

  const stats = [
    { icon: Dumbbell, value: "9+", label: "Years Experience" },
    { icon: Users, value: "100+", label: "Clients Trained" },
    { icon: Brain, value: "100%", label: "Personalized Plans" },
    { icon: Clock, value: "24/7", label: "Support Available" },
  ];

  return (
    <PageWrapper>
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="mb-8 hover:bg-primary/10"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          <div className="space-y-16">
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold">
                About <span className="text-primary neon-text">Cap's FITNESS</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Empowering individuals to achieve their peak physical potential through 
                personalized coaching and evidence-based training
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-display font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border border-primary/30 neon-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <CardHeader className="relative">
                  <CardTitle className="text-3xl font-display">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4 text-lg leading-relaxed text-foreground/90">
                  <p>
                    Hey I am Anto, Cap's FITNESS was created with a simple vision: make fitness easier for people who feel lost.
                    I built my body alone — no coach, no mentor, no guidance — and I understand the confusion, the mistakes, and the slow progress that comes with it.
                  </p>
                  <p>
                    Now, I guide others with what I never had: structured, science-backed, and experience-tested coaching that actually works.
                  </p>
                  <p>
                    Whether you're just starting your fitness journey or looking to break through a plateau, 
                    we're here to guide, support, and motivate you every step of the way.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <div>
              <motion.h2 
                className="text-3xl font-display font-bold text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Our Core <span className="text-neon-blue">Values</span>
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Card 
                        className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 h-full"
                        data-testid={`card-value-${value.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <CardHeader className="space-y-4">
                          <div className={`w-12 h-12 rounded-xl ${value.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${value.color}`} />
                          </div>
                          <CardTitle className="text-xl font-display">{value.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{value.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border border-accent/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent pointer-events-none" />
                <CardHeader className="relative">
                  <CardTitle className="text-3xl font-display">Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                      <h3 className="font-display font-semibold text-lg mb-2 text-primary">Tried, Tested & Practical Guidance</h3>
                      <p className="text-muted-foreground">
                        Everything I teach comes from years of hands-on training, experimentation, and science-backed principles that actually work in the real world.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                      <h3 className="font-display font-semibold text-lg mb-2 text-accent">Experienced Personal Coach</h3>
                      <p className="text-muted-foreground">
                        With over 9 years of dedicated weight-training experience, I bring real, practical knowledge to help you transform safely and effectively.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                      <h3 className="font-display font-semibold text-lg mb-2 text-pink-500">Flexible Programming</h3>
                      <p className="text-muted-foreground">
                        Whether you train at home, outdoors, or in a gym, we create programs 
                        that fit your lifestyle and equipment availability.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                      <h3 className="font-display font-semibold text-lg mb-2 text-yellow-500">Continuous Support</h3>
                      <p className="text-muted-foreground">
                        We're with you beyond the workout - providing nutrition guidance, 
                        accountability, and motivation throughout your journey.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              className="text-center space-y-6 py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-neon-purple/10 border border-primary/30 neon-border max-w-2xl mx-auto">
                <h2 className="text-3xl font-display font-bold mb-4">Ready to Start Your Journey?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Take the first step towards your fitness goals today
                </p>
                <Button
                  size="lg"
                  onClick={() => setLocation("/intake")}
                  className="neon-glow bg-primary hover:bg-primary/90"
                  data-testid="button-start-intake"
                >
                  Complete Your Assessment
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
