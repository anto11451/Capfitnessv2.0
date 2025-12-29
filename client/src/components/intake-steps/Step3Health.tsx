import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormData } from "../IntakeForm";

interface Step3Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function Step3Health({ formData, updateFormData }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="medicalConditions">
          Known Medical Conditions <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="medicalConditions"
          placeholder="List any medical conditions, injuries, or health concerns (e.g., diabetes, high blood pressure, knee injury). Write 'None' if not applicable."
          value={formData.medicalConditions}
          onChange={(e) => updateFormData({ medicalConditions: e.target.value })}
          rows={4}
          data-testid="textarea-medical-conditions"
        />
      </div>

      <div className="space-y-4 p-6 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="onMedications" className="text-base">
              Currently on Medications?
            </Label>
            <p className="text-sm text-muted-foreground">
              Are you taking any medications or supplements?
            </p>
          </div>
          <Switch
            id="onMedications"
            checked={formData.onMedications}
            onCheckedChange={(checked) => updateFormData({ onMedications: checked })}
            data-testid="switch-medications"
          />
        </div>

        {formData.onMedications && (
          <div className="space-y-2 pt-2 animate-in slide-in-from-top-2">
            <Label htmlFor="medicationDetails">
              Medication Details <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="medicationDetails"
              placeholder="Please list your medications and the reason for taking them"
              value={formData.medicationDetails}
              onChange={(e) => updateFormData({ medicationDetails: e.target.value })}
              rows={3}
              data-testid="textarea-medication-details"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 p-6 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pastSurgeries" className="text-base">
              Past Surgeries?
            </Label>
            <p className="text-sm text-muted-foreground">
              Have you had any surgeries in the past?
            </p>
          </div>
          <Switch
            id="pastSurgeries"
            checked={formData.pastSurgeries}
            onCheckedChange={(checked) => updateFormData({ pastSurgeries: checked })}
            data-testid="switch-surgeries"
          />
        </div>

        {formData.pastSurgeries && (
          <div className="space-y-2 pt-2 animate-in slide-in-from-top-2">
            <Label htmlFor="surgeryDetails">
              Surgery Details <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="surgeryDetails"
              placeholder="Please describe your past surgeries and when they occurred"
              value={formData.surgeryDetails}
              onChange={(e) => updateFormData({ surgeryDetails: e.target.value })}
              rows={3}
              data-testid="textarea-surgery-details"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-6 rounded-lg bg-muted/30">
        <div className="space-y-0.5">
          <Label htmlFor="consultedDoctor" className="text-base">
            Consulted a Doctor?
          </Label>
          <p className="text-sm text-muted-foreground">
            Have you consulted with a doctor before starting this program?
          </p>
        </div>
        <Switch
          id="consultedDoctor"
          checked={formData.consultedDoctor}
          onCheckedChange={(checked) => updateFormData({ consultedDoctor: checked })}
          data-testid="switch-doctor"
        />
      </div>
    </div>
  );
}
