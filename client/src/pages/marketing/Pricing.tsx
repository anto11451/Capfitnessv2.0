import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Rocket } from "lucide-react";
import clsx from "clsx";

type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon?: any;
};

const plans: PricingPlan[] = [
  {
    name: "Free Demo",
    price: "₹0",
    period: "72 hours",
    description:
      "Explore the complete Cap’s Fitness platform before committing.",
    features: [
      "Full dashboard access",
      "Body analysis & BMI",
      "Workout repository",
      "Workout partner",
      "Nutrition hub (view + calculate)",
      "Progress & streak (view-only)",
    ],
    cta: "Start Free Demo",
  },
  {
    name: "Platform Access",
    price: "₹499",
    period: "/2 Weeks",
    description:
      "Full access to Cap’s Fitness platform for self-driven users.",
    features: [
      "Save & track progress",
      "Basic Diet plan",
      "Basic workout plan",
      "Workout & nutrition logging",
      "Streak tracking",
      "Progress analytics",
      "All core platform features",
    ],
    cta: "Unlock Platform",
    icon: Sparkles,
  },
  {
    name: "4-Week Coaching + Platform",
    price: "1299",
    period: "/ 4 weeks",
    description:
      "Personal coaching combined with full platform access.",
    features: [
      "Everything in Platform Access",
      "Fully personalised diet plan",
      "Custom workout plan (home/gym)",
      "Weekly check-ins & adjustments",
      "WhatsApp support (fixed hours)",
      "Habit & lifestyle coaching",
      "Progress review",
    ],
    cta: "Start Coaching",
    popular: true,
    icon: Crown,
  },
  {
    name: "8-Week Transformation PRO",
    price: "₹2,999",
    period: "/ 8 weeks",
    description:
      "Complete transformation with priority support and deep analysis.",
    features: [
      "Everything in Coaching plan",
      "Priority WhatsApp support",
      "Video-based form checks",
      "Weekly personalised updates",
      "Advanced progress analysis",
      "End-of-program review",
      "Maintenance roadmap",
    ],
    cta: "Go Pro",
    icon: Rocket,
  },
];

export default function Pricing() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-primary">Plan</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you want to explore the platform or commit to a full
            transformation — there’s a plan for you.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon ?? null;

            return (
              <div
                key={index}
                className={clsx(
                  "relative rounded-2xl border bg-card/40 backdrop-blur p-8 flex flex-col",
                  plan.popular
                    ? "border-primary shadow-[0_0_40px_rgba(0,255,255,0.15)]"
                    : "border-white/10"
                )}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                {Icon && (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold text-white text-center mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground text-center mb-6">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  type="button"
                  className={clsx(
                    "w-full",
                    plan.popular
                      ? "bg-primary text-black hover:bg-primary/90"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

