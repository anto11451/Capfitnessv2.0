import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface NeonCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "green" | "blue" | "purple" | "gradient";
  className?: string;
  animated?: boolean;
  glowing?: boolean;
}

export default function NeonCard({
  title,
  description,
  icon: Icon,
  children,
  onClick,
  variant = "default",
  className = "",
  animated = true,
  glowing = false,
}: NeonCardProps) {
  const variants = {
    default: {
      border: "border-border/50 hover:border-primary/30",
      glow: "neon-card",
      icon: "bg-primary/20 text-primary",
      gradient: "from-primary/10 to-transparent",
    },
    green: {
      border: "border-primary/30 hover:border-primary/50",
      glow: "neon-glow-primary",
      icon: "bg-primary/20 text-primary",
      gradient: "from-primary/20 to-transparent",
    },
    blue: {
      border: "border-accent/30 hover:border-accent/50",
      glow: "neon-glow-accent",
      icon: "bg-accent/20 text-accent",
      gradient: "from-accent/20 to-transparent",
    },
    purple: {
      border: "border-secondary/30 hover:border-secondary/50",
      glow: "neon-glow-secondary",
      icon: "bg-secondary/20 text-secondary",
      gradient: "from-secondary/20 to-transparent",
    },
    gradient: {
      border: "border-primary/30 hover:border-primary/50",
      glow: "neon-border",
      icon: "bg-gradient-to-br from-primary to-accent text-white",
      gradient: "from-primary/10 via-accent/10 to-transparent",
    },
  };

  const style = variants[variant];

  const cardContent = (
    <Card
      className={`
        relative overflow-hidden
        bg-card/80 backdrop-blur-sm
        border ${style.border}
        transition-all duration-300
        ${onClick ? "cursor-pointer" : ""}
        ${glowing ? style.glow : ""}
        ${className}
      `}
      onClick={onClick}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none`} 
      />
      
      <CardHeader className="relative space-y-4">
        {Icon && (
          <div className={`w-14 h-14 rounded-xl ${style.icon} flex items-center justify-center`}>
            <Icon className="w-7 h-7" />
          </div>
        )}
        <div className="space-y-1">
          <CardTitle className="text-xl font-display">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
        </div>
      </CardHeader>
      
      {children && (
        <CardContent className="relative">
          {children}
        </CardContent>
      )}
    </Card>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
