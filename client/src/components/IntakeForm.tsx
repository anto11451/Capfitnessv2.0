// /src/components/IntakeForm.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import { useLocation } from "wouter";
import Step1Personal from "./intake-steps/Step1Personal";
import Step2Body from "./intake-steps/Step2Body";
import Step3Health from "./intake-steps/Step3Health";
import Step4Goals from "./intake-steps/Step4Goals";
import Step5Nutrition from "./intake-steps/Step5Nutrition";
import ReviewStep from "./intake-steps/ReviewStep";
import SuccessStep from "./intake-steps/SuccessStep";

export interface FormData {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  height: string;
  weight: string;
  sleepHours: string;
  sittingHours: string;
  stressLevel: number;
  activityLevel: string;
  medicalConditions: string;
  onMedications: boolean;
  medicationDetails: string;
  pastSurgeries: boolean;
  surgeryDetails: string;
  consultedDoctor: boolean;
  primaryGoal: string;
  shortTermGoal: string;
  longTermGoal: string;
  motivation: string;
  trainingStyle: string;
  daysPerWeek: string;
  equipment: string[];
  eatingPattern: string;
  foodsLove: string[];
  foodsAvoid: string[];
  additionalNotes: string;
  privacyAccepted: boolean;
}

const TOTAL_STEPS = 5;

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxIPA6NY5sx6bYco5LjpjDJ9RspDys-yXESJ851AUAPcnKQBtmihkJiGMGDVaMKOaC8GQ/exec";

const stepTitles = [
  "Personal Details",
  "Body & Lifestyle",
  "Health Information",
  "Goals & Training",
  "Nutrition Preferences",
  "Review Your Information",
];

export default function IntakeForm() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    height: "",
    weight: "",
    sleepHours: "",
    sittingHours: "",
    stressLevel: 5,
    activityLevel: "",
    medicalConditions: "",
    onMedications: false,
    medicationDetails: "",
    pastSurgeries: false,
    surgeryDetails: "",
    consultedDoctor: false,
    primaryGoal: "",
    shortTermGoal: "",
    longTermGoal: "",
    motivation: "",
    trainingStyle: "",
    daysPerWeek: "",
    equipment: [],
    eatingPattern: "",
    foodsLove: [],
    foodsAvoid: [],
    additionalNotes: "",
    privacyAccepted: false,
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === TOTAL_STEPS) {
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep <= 6) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 1) {
      setLocation("/");
    }
  };

  const handleSubmit = async () => {
    // Validate privacy checkbox BEFORE sending any data
    if (!formData.privacyAccepted) {
      alert("Please accept the Privacy Policy and Terms before submitting.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      _secret: "CapSecret2025",
      formId: "Cap-Fitness-Intake",
      Name: formData.name,
      Age: formData.age,
      Gender: formData.gender,
      Phone: formData.phone,
      Email: formData.email,
      KnownMedicalConditions: formData.medicalConditions,
      OnMedications: formData.onMedications ? "Yes" : "No",
      PastSurgeries: formData.pastSurgeries ? "Yes" : "No",
      ConsultedDoctor: formData.consultedDoctor ? "Yes" : "No",
      Height: formData.height,
      Weight: formData.weight,
      SleepHours: formData.sleepHours,
      SittingHours: formData.sittingHours,
      StressLevel: formData.stressLevel,
      ActivityLevel: formData.activityLevel,
      CommitmentLevel: formData.daysPerWeek,
      PrimaryGoal: formData.primaryGoal,
      ShortTermGoal: formData.shortTermGoal,
      LongTermGoal: formData.longTermGoal,
      Motivation: formData.motivation,
      TrainingStyle: formData.trainingStyle,
      DaysPerWeek: formData.daysPerWeek,
      EquipmentList: formData.equipment.join(", "),
      EatingPattern: formData.eatingPattern,
      FoodsYouLove: formData.foodsLove.join(", "),
      FoodsYouAvoid: formData.foodsAvoid.join(", "),
      AdditionalNotes: formData.additionalNotes,
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Google Sheets submit error:", error);
      alert("Error submitting intake. Please try again.");
    }

    setIsSubmitting(false);
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSubmitted) {
    return <SuccessStep />;
  }

  const progressValue = currentStep === 6 ? 100 : (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center neon-border">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Cap's <span className="text-primary">FITNESS</span>
              </h1>
            </div>
            <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted/50">
              {currentStep === 6 ? "Review" : `Step ${currentStep} of ${TOTAL_STEPS}`}
            </span>
          </div>

          <div className="relative">
            <Progress value={progressValue} className="h-2 bg-muted/50" data-testid="progress-intake" />
            <div
              className="absolute top-0 left-0 h-2 rounded-full bg-primary neon-glow transition-all duration-500"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border border-primary/30 neon-border overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

            <CardHeader className="relative space-y-1 pb-6">
              <CardTitle className="text-xl md:text-2xl font-display">{stepTitles[currentStep - 1]}</CardTitle>
            </CardHeader>

            <CardContent className="relative space-y-6">
              {currentStep === 1 && <Step1Personal formData={formData} updateFormData={updateFormData} />}
              {currentStep === 2 && <Step2Body formData={formData} updateFormData={updateFormData} />}
              {currentStep === 3 && <Step3Health formData={formData} updateFormData={updateFormData} />}
              {currentStep === 4 && <Step4Goals formData={formData} updateFormData={updateFormData} />}
              {currentStep === 5 && <Step5Nutrition formData={formData} updateFormData={updateFormData} />}
              {currentStep === 6 && <ReviewStep formData={formData} onEdit={handleEdit} />}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/30">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto hover:bg-muted/50 hover:border-primary/50"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                {currentStep < 6 ? (
                  <Button
                    onClick={handleNext}
                    className="w-full sm:flex-1 neon-glow bg-primary hover:bg-primary/90"
                    data-testid="button-next"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 neon-glow bg-primary hover:bg-primary/90"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      "Submit Intake"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
