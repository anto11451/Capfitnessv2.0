import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator, Bot, LogIn, X, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageWrapper from "./PageWrapper";
import ChatBot from "./ChatBot";
import rohitImg from "@/assets/success-rohit.jpg";
import tabuImg from "@/assets/success-tabu.jpg";
import satyaImg from "@/assets/success-satya.jpg";
import michaelImg from "@/assets/success-michael.jpg";

interface Story {
  name: string;
  age: number;
  image: string;
  shortDesc: string;
  fullStory: string;
  color: string;
}

const STORIES: Story[] = [
  {
    name: "Rohit",
    age: 32,
    image: rohitImg,
    shortDesc: "Lost 9 kg in 14 weeks while working night shifts.",
    fullStory: "Rohit struggled with irregular sleep and poor eating habits due to his night shift schedule. By focusing on meal timing and high-intensity, short workouts, he dropped 9kg and completely transformed his energy levels.",
    color: "primary",
  },
{
  name: "Tabu",
  age: 25, // adjust if needed
  image: tabuImg, // import image accordingly
  shortDesc: "Reduced weight from 75 kg to 64 kg in 8 weeks through discipline and structure.",
  fullStory: "Tabu is a college student dealing with high body fat, late-night sleeping, frequent overeating, and no fixed routine. Instead of shortcuts, we focused on a strict but structured diet, consistent workouts, and gradually fixing her sleep pattern. Over 8 weeks, she reduced her weight from 75 kg to 64 kg and, more importantly, learned how to stay disciplined and in control of her habits.",
  color: "accent",
},
  {
  name: "Satya",
  age: 30, // adjust if needed
  image: satyaImg, // import image accordingly
  shortDesc: "Dropped from 98.2 kg to 93.5 kg in 4 weeks despite a 12–9 desk job.",
  fullStory: "Satya works long 12–9 shifts with mostly table work and struggled with frequent binge eating and street food cravings. Instead of extreme restrictions, we focused on structured meals, smarter food choices, and realistic workouts that fit his schedule. In just 4 weeks, he reduced his weight from 98.2 kg to 93.5 kg and gained control over his eating habits without feeling deprived.",
  color: "primary",
},
  {
    name: "Michael",
    age: 29,
    image: michaelImg,
    shortDesc: "Gained 7 kg of lean muscle in 16 weeks through structured bulking.",
    fullStory: "Michael was always the 'skinny guy' who couldn't put on weight. We dialed in his surplus with nutrient-dense foods and heavy compound lifting. He's gained 7kg of lean mass and finally has the physique he always wanted.",
    color: "accent",
  },
];

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [showLoginPopup, setShowLoginPopup] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % STORIES.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PageWrapper>
      {/* MEMBERS LOGIN POPUP */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed left-6 top-32 z-[60] max-w-[280px]"
          >
            <div className="relative bg-black/90 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,255,157,0.2)]">
              <button 
                onClick={() => setShowLoginPopup(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Member Access</h3>
                    <p className="text-[10px] text-primary font-medium uppercase tracking-tighter">Already a Champ?</p>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Log in to access your custom dashboard, track your macros, and check your progress.
                </p>
                
                <Button 
                  onClick={() => setLocation("/login")}
                  className="w-full bg-primary text-black hover:bg-white transition-all font-bold text-xs h-9 rounded-full"
                >
                  LOG IN NOW
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* SUCCESS STORIES SECTION */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.05)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-primary font-display font-bold uppercase tracking-[0.3em] text-sm"
            >
              Real Results
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold mt-4 text-white"
            >
              Success Stories
            </motion.h2>
          </div>
          
          <div className="relative flex items-center justify-center gap-4 md:gap-8">
            {/* Left Arrow */}
            <button
              onClick={prevStory}
              className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-primary/30 transition-all touch-manipulation active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Story Card */}
            <div className="flex-1 max-w-md">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStoryIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedStory(STORIES[currentStoryIndex])}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${STORIES[currentStoryIndex].color === 'primary' ? 'from-primary to-accent' : 'from-accent to-primary'} opacity-0 group-hover:opacity-20 rounded-3xl blur transition duration-500`} />
                  <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col">
                    <div className={`relative w-20 h-20 mb-6 rounded-2xl overflow-hidden border-2 ${STORIES[currentStoryIndex].color === 'primary' ? 'border-primary/30' : 'border-accent/30'}`}>
                      <img src={STORIES[currentStoryIndex].image} alt={STORIES[currentStoryIndex].name} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 ${STORIES[currentStoryIndex].color === 'primary' ? 'bg-primary/20' : 'bg-accent/20'} mix-blend-overlay`} />
                    </div>
                    <Quote className={`w-8 h-8 ${STORIES[currentStoryIndex].color === 'primary' ? 'text-primary/20' : 'text-accent/20'} absolute top-6 right-6 md:top-8 md:right-8`} />
                    <h3 className="font-display font-bold text-white text-xl md:text-2xl mb-2">{STORIES[currentStoryIndex].name}, {STORIES[currentStoryIndex].age}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
                      {STORIES[currentStoryIndex].shortDesc}
                    </p>
                    <div className={`mt-auto pt-6 border-t border-white/5 flex items-center gap-2 ${STORIES[currentStoryIndex].color === 'primary' ? 'text-primary' : 'text-accent'} text-sm font-bold uppercase tracking-widest`}>
                      View Transformation <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextStory}
              className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-primary/30 transition-all touch-manipulation active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {STORIES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStoryIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all touch-manipulation ${
                  index === currentStoryIndex 
                    ? 'bg-primary w-8 shadow-[0_0_10px_rgba(0,255,157,0.5)]' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STORY MODAL */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedStory(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-black/90 border border-white/10 p-8 rounded-[2rem] shadow-2xl"
            >
              <button 
                onClick={() => setSelectedStory(null)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 ${selectedStory.color === 'primary' ? 'border-primary/30' : 'border-accent/30'}`}>
                  <img src={selectedStory.image} alt={selectedStory.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-3xl font-display font-bold text-white">{selectedStory.name}, {selectedStory.age}</h3>
                  <p className={`text-sm font-bold uppercase tracking-widest ${selectedStory.color === 'primary' ? 'text-primary' : 'text-accent'}`}>Success Story</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 italic text-lg text-white/90 leading-relaxed">
                  "{selectedStory.fullStory}"
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Impact</p>
                    <p className={`text-lg font-bold ${selectedStory.color === 'primary' ? 'text-primary' : 'text-accent'}`}>100% Personal</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Mindset</p>
                    <p className="text-lg font-bold text-white">Consistent</p>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setSelectedStory(null);
                    setLocation("/intake");
                  }}
                  className={`w-full py-7 rounded-2xl text-lg font-bold text-black neon-glow ${selectedStory.color === 'primary' ? 'bg-primary' : 'bg-accent'}`}
                >
                  Start Your Journey
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
