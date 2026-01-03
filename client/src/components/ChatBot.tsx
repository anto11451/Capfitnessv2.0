import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatOption {
  id: number;
  label: string;
  response: string;
  linkText: string;
  linkAction: () => void;
}

export default function ChatBot({ 
  onNavigateToSection, 
  onNavigateToRoute 
}: { 
  onNavigateToSection: (id: string) => void;
  onNavigateToRoute: (route: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [currentLink, setCurrentLink] = useState<{ text: string; action: () => void } | null>(null);

  const options: ChatOption[] = [
    {
      id: 1,
      label: "How does Cap’s Fitness work?",
      response: "It’s a simple 3-step process: personal assessment, followed by a custom workout & diet plan, and then guided training with progress tracking.",
      linkText: "View How It Works",
      linkAction: () => onNavigateToSection("how-it-works"),
    },
    {
      id: 2,
      label: "Is this one-to-one coaching?",
      response: "Yes. Every plan is custom-built and you receive individual, personalised coaching directly from Coach Cap.",
      linkText: "Learn about Coaching",
      linkAction: () => onNavigateToSection("coaching-emphasis"),
    },
    {
      id: 3,
      label: "I want to explore before assessment",
      response: "No pressure at all. You can explore our approach and tools to see if we're the right fit for you.",
      linkText: "Start Exploring",
      linkAction: () => onNavigateToRoute("/intake"), // Start Your Journey trigger
    },
    {
      id: 4,
      label: "I’m ready to take the assessment",
      response: "That's great. The assessment helps us understand your goals and current level to build the perfect plan.",
      linkText: "Take Assessment",
      linkAction: () => onNavigateToRoute("/intake"), // Route to Enroll Now (Intake)
    },
    {
      id: 5,
      label: "Pricing & plans",
      response: "Pricing depends on your specific coaching needs and duration. We also offer a starter option to get you moving.",
      linkText: "View Pricing Info",
      linkAction: () => onNavigateToRoute("/pricing"),
    },
    {
      id: 6,
      label: "Any offers or flexibility?",
      response: "We offer flexibility for genuine cases. All special offers and custom arrangements are discussed personally.",
      linkText: "Contact Coach Cap",
      linkAction: () => window.open("https://wa.me/your-number", "_blank"),
    },
  ];

  const handleOptionClick = (option: ChatOption) => {
    setCurrentMessage(option.response);
    setCurrentLink({ text: option.linkText, action: option.linkAction });
  };

  const resetChat = () => {
    setCurrentMessage(null);
    setCurrentLink(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[320px] md:w-[380px] bg-black/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-bold text-white uppercase tracking-widest">Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar">
              {!currentMessage ? (
                <>
                  <p className="text-white text-lg font-light leading-relaxed">
                    Hey 👋 I can help you get started. What would you like to know?
                  </p>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-white"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <p className="text-white text-lg font-light leading-relaxed italic">
                    {currentMessage}
                  </p>
                  
                  {currentLink && (
                    <Button
                      onClick={() => {
                        currentLink.action();
                        setIsOpen(false);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-6 rounded-xl"
                    >
                      {currentLink.text}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  <button
                    onClick={resetChat}
                    className="w-full text-center text-xs text-muted-foreground hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Back to questions
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full h-14 px-6 shadow-2xl transition-all duration-300 ${
          isOpen 
            ? "bg-white/10 text-white" 
            : "bg-primary text-black font-bold hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>Need help?</span>
          </div>
        )}
      </Button>
    </div>
  );
}
