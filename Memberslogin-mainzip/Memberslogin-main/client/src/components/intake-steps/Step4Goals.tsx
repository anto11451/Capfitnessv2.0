import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { FormData } from "../IntakeForm";
import { useState } from "react";

interface Step4Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const EQUIPMENT_OPTIONS = [
  "Dumbbells",
  "Resistance Bands",
  "Bench",
  "Yoga Mat",
  "Pull-up Bar",
  "Kettlebells",
  "Jump Rope",
  "Foam Roller",
];

export default function Step4Goals({ formData, updateFormData }: Step4Props) {
  const [equipmentInput, setEquipmentInput] = useState("");

  const addEquipment = (item: string) => {
    if (item && !formData.equipment.includes(item)) {
      updateFormData({ equipment: [...formData.equipment, item] });
    }
  };

  const removeEquipment = (item: string) => {
    updateFormData({ equipment: formData.equipment.filter((e) => e !== item) });
  };

  const showEquipmentSelector = formData.trainingStyle === "home";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="primaryGoal">
          Primary Goal <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.primaryGoal} onValueChange={(value) => updateFormData({ primaryGoal: value })}>
          <SelectTrigger id="primaryGoal" data-testid="select-primary-goal">
            <SelectValue placeholder="Select your main goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fat-loss">Fat Loss</SelectItem>
            <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
            <SelectItem value="strength">Strength Building</SelectItem>
            <SelectItem value="general-fitness">General Fitness</SelectItem>
            <SelectItem value="athletic-performance">Athletic Performance</SelectItem>
            <SelectItem value="mobility">Mobility & Flexibility</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortTermGoal">
          Short-Term Goal (3 months) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="shortTermGoal"
          placeholder="e.g., Lose 5kg, Run 5km without stopping"
          value={formData.shortTermGoal}
          onChange={(e) => updateFormData({ shortTermGoal: e.target.value })}
          data-testid="input-short-term-goal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longTermGoal">
          Long-Term Goal (1 year) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="longTermGoal"
          placeholder="e.g., Complete a marathon, Bench press bodyweight"
          value={formData.longTermGoal}
          onChange={(e) => updateFormData({ longTermGoal: e.target.value })}
          data-testid="input-long-term-goal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation">
          Primary Motivation <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.motivation} onValueChange={(value) => updateFormData({ motivation: value })}>
          <SelectTrigger id="motivation" data-testid="select-motivation">
            <SelectValue placeholder="What drives you?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="appearance">Appearance</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="energy">Energy Levels</SelectItem>
            <SelectItem value="sports">Sports Performance</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trainingStyle">
          Training Style <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.trainingStyle} onValueChange={(value) => updateFormData({ trainingStyle: value })}>
          <SelectTrigger id="trainingStyle" data-testid="select-training-style">
            <SelectValue placeholder="Where will you train?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gym">Gym</SelectItem>
            <SelectItem value="home">Home Workout</SelectItem>
            <SelectItem value="outdoor">Outdoor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="daysPerWeek">
          Days Per Week <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.daysPerWeek} onValueChange={(value) => updateFormData({ daysPerWeek: value })}>
          <SelectTrigger id="daysPerWeek" data-testid="select-days-per-week">
            <SelectValue placeholder="How many days can you commit?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-2">1-2 days</SelectItem>
            <SelectItem value="3-4">3-4 days</SelectItem>
            <SelectItem value="5-6">5-6 days</SelectItem>
            <SelectItem value="7">7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showEquipmentSelector && (
        <div className="space-y-3 p-6 rounded-lg bg-muted/30 animate-in slide-in-from-top-2">
          <Label>
            Available Equipment <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">
            Select the equipment you have available at home
          </p>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((item) => (
              <Badge
                key={item}
                variant={formData.equipment.includes(item) ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() =>
                  formData.equipment.includes(item)
                    ? removeEquipment(item)
                    : addEquipment(item)
                }
                data-testid={`badge-equipment-${item.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item}
                {formData.equipment.includes(item) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
          {formData.equipment.length > 0 && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                Selected: {formData.equipment.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
