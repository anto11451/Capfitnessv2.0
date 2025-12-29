import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { FormData } from "../IntakeForm";

interface Step2Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function Step2Body({ formData, updateFormData }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height">
            Height (ft) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="height"
            type="number"
            placeholder="5.9"
            value={formData.height}
            onChange={(e) => updateFormData({ height: e.target.value })}
            data-testid="input-height"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">
            Weight (kg) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            value={formData.weight}
            onChange={(e) => updateFormData({ weight: e.target.value })}
            data-testid="input-weight"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="sleepHours">
            Sleep Hours <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.sleepHours} onValueChange={(value) => updateFormData({ sleepHours: value })}>
            <SelectTrigger id="sleepHours" data-testid="select-sleep">
              <SelectValue placeholder="Select hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<5">Less than 5 hours</SelectItem>
              <SelectItem value="6-7">6-7 hours</SelectItem>
              <SelectItem value="7-8">7-8 hours</SelectItem>
              <SelectItem value=">8">More than 8 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sittingHours">
            Daily Sitting Hours <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.sittingHours} onValueChange={(value) => updateFormData({ sittingHours: value })}>
            <SelectTrigger id="sittingHours" data-testid="select-sitting">
              <SelectValue placeholder="Select hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<2">Less than 2 hours</SelectItem>
              <SelectItem value="2-4">2-4 hours</SelectItem>
              <SelectItem value="4-6">4-6 hours</SelectItem>
              <SelectItem value="6-8">6-8 hours</SelectItem>
              <SelectItem value="8+">8+ hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>
            Stress Level <span className="text-destructive">*</span>
          </Label>
          <span className="text-sm font-medium text-primary" data-testid="text-stress-level">
            {formData.stressLevel}/10
          </span>
        </div>
        <Slider
          value={[formData.stressLevel]}
          onValueChange={(value) => updateFormData({ stressLevel: value[0] })}
          min={1}
          max={10}
          step={1}
          className="py-4"
          data-testid="slider-stress"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="activityLevel">
            Activity Level <span className="text-destructive">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-2 text-sm">
                <p><strong>Sedentary:</strong> Little or no exercise</p>
                <p><strong>Lightly Active:</strong> Light exercise 1-3 days/week</p>
                <p><strong>Moderately Active:</strong> Moderate exercise 3-5 days/week</p>
                <p><strong>Very Active:</strong> Hard exercise 6-7 days/week</p>
                <p><strong>Athlete:</strong> Professional training, twice per day</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={formData.activityLevel} onValueChange={(value) => updateFormData({ activityLevel: value })}>
          <SelectTrigger id="activityLevel" data-testid="select-activity">
            <SelectValue placeholder="Select your activity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">Sedentary (Little or no exercise)</SelectItem>
            <SelectItem value="lightly-active">Lightly Active (Light exercise 1-3 days/week)</SelectItem>
            <SelectItem value="moderately-active">Moderately Active (Moderate exercise 3-5 days/week)</SelectItem>
            <SelectItem value="very-active">Very Active (Hard exercise 6-7 days/week)</SelectItem>
            <SelectItem value="athlete">Athlete (Professional training, twice per day)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
