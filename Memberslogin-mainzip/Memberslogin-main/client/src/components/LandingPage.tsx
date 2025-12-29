import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Dumbbell, 
  ClipboardList, 
  DollarSign, 
  Users, 
  Newspaper,
  Calculator,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Zap,
  Target,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "./PageWrapper";
import NeonCard from "./NeonCard";

const mainSections = [
  {
    title: "Client Assessment",
    description: "Complete your personalized fitness assessment in minutes",
    icon: ClipboardList,
    path: "/intake",
    variant: "green" as const,
  },
  {
    title: "Fitness Calculators",
    description: "BMI, Body Fat, TDEE, and more - all in one place",
    icon: Calculator,
    path: "/calculators",
    variant: "blue" as const,
  },
  {
    title: "Knowledge Hub",
    description: "Learn the science behind effective fitness",
    icon: BookOpen,
    path: "/knowledge",
    variant: "purple" as const,
  },
  {
    title: "Fitness Quiz",
    description: "Discover your ideal fitness approach",
    icon: HelpCircle,
    path: "/quiz",
    variant: "gradient" as const,
  },
];

const quickLinks = [
  {
    title: "Pricing",
    description: "Explore our coaching packages",
    icon: DollarSign,
    path: "/pricing",
  },
  {
    title: "About Us",
    description: "Meet the Cap's FITNESS team",
    icon: Users,
    path: "/about",
  },
  {
    title: "Fitness Blog",
    description: "Tips and inspiration from our coaches",
    icon: Newspaper,
    path: "/blog",
  },
];

const features = [
  {
    icon: Zap,
    title: "Science-Based",
    description: "Programs backed by research and proven results",
  },
  {
    icon: Target,
    title: "Personalized",
    description: "Custom plans tailored to your unique goals",
  },
  {
    icon: Award,
    title: "Expert Coaching",
    description: "9+ years of dedicated training experience",
  },
];

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <PageWrapper>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Dumbbell className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Transform Your Life</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold">
              <span className="text-foreground">Cap's </span>
              <span className="text-primary text-neon-green animate-neon-pulse">FITNESS</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform your body, elevate your mind, <br className="hidden md:block" />
              <span className="text-foreground font-medium">achieve your goals</span>
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg" 
                onClick={() => setLocation("/intake")}
                className="neon-glow bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              >
                <ClipboardList className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              One2One Online Coaching <br className="hidden md:block" />
              <span className="text-foreground font-medium"></span>
            </p>
              
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Explore Our <span className="text-primary">Tools</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand, track, and optimize your fitness journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainSections.map((section, index) => (
              <motion.div
                key={section.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NeonCard
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  variant={section.variant}
                  onClick={() => setLocation(section.path)}
                  glowing
                >
                  <div className="flex items-center text-sm text-primary">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Quick <span className="text-neon-blue">Links</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NeonCard
                  title={link.title}
                  description={link.description}
                  icon={link.icon}
                  onClick={() => setLocation(link.path)}
                >
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-neon-purple/10 border border-primary/30 neon-border"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Transform?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Take the first step towards your fitness goals. 
              Complete your assessment and let's build your personalized plan.
            </p>
            <Button 
              size="lg" 
              onClick={() => setLocation("/intake")}
              className="neon-glow bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              <ClipboardList className="w-5 h-5 mr-2" />
              Start Your Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
