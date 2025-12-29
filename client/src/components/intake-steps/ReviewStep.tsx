// /src/components/intake-steps/ReviewStep.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit2 } from "lucide-react";
import type { FormData } from "../IntakeForm";

interface ReviewStepProps {
  formData: FormData;
  onEdit: (step: number) => void;
}

export default function ReviewStep({ formData, onEdit }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Personal Details</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(1)}
            data-testid="button-edit-step-1"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium" data-testid="text-review-name">{formData.name || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Age</p>
              <p className="font-medium">{formData.age || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium capitalize">{formData.gender || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{formData.phone || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{formData.email || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Body & Lifestyle</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(2)}
            data-testid="button-edit-step-2"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Height</p>
              <p className="font-medium">{formData.height ? `${formData.height} cm` : "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Weight</p>
              <p className="font-medium">{formData.weight ? `${formData.weight} kg` : "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sleep Hours</p>
              <p className="font-medium">{formData.sleepHours || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sitting Hours</p>
              <p className="font-medium">{formData.sittingHours || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stress Level</p>
              <p className="font-medium">{formData.stressLevel}/10</p>
            </div>
            <div>
              <p className="text-muted-foreground">Activity Level</p>
              <p className="font-medium capitalize">{formData.activityLevel?.replace("-", " ") || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Health Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(3)}
            data-testid="button-edit-step-3"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Medical Conditions</p>
            <p className="font-medium">{formData.medicalConditions || "—"}</p>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground mb-1">Medications</p>
            {formData.onMedications ? (
              <div className="space-y-1">
                <Badge variant="secondary">Yes</Badge>
                <p className="font-medium mt-2">{formData.medicationDetails || "—"}</p>
              </div>
            ) : (
              <Badge variant="outline">No</Badge>
            )}
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground mb-1">Past Surgeries</p>
            {formData.pastSurgeries ? (
              <div className="space-y-1">
                <Badge variant="secondary">Yes</Badge>
                <p className="font-medium mt-2">{formData.surgeryDetails || "—"}</p>
              </div>
            ) : (
              <Badge variant="outline">No</Badge>
            )}
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground mb-1">Consulted Doctor</p>
            <Badge variant={formData.consultedDoctor ? "default" : "outline"}>
              {formData.consultedDoctor ? "Yes" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Goals & Training</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(4)}
            data-testid="button-edit-step-4"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Primary Goal</p>
            <p className="font-medium capitalize">{formData.primaryGoal?.replace("-", " ") || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Short-Term Goal</p>
            <p className="font-medium">{formData.shortTermGoal || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Long-Term Goal</p>
            <p className="font-medium">{formData.longTermGoal || "—"}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Motivation</p>
              <p className="font-medium capitalize">{formData.motivation || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Training Style</p>
              <p className="font-medium capitalize">{formData.trainingStyle || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Days Per Week</p>
              <p className="font-medium">{formData.daysPerWeek || "—"}</p>
            </div>
          </div>
          {formData.equipment.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-2">Equipment</p>
                <div className="flex flex-wrap gap-2">
                  {formData.equipment.map((item, idx) => (
                    <Badge key={idx} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Nutrition Preferences</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(5)}
            data-testid="button-edit-step-5"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Eating Pattern</p>
            <p className="font-medium capitalize">{formData.eatingPattern?.replace("-", " ") || "—"}</p>
          </div>
          {formData.foodsLove.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-2">Foods You Love</p>
                <div className="flex flex-wrap gap-2">
                  {formData.foodsLove.map((food, idx) => (
                    <Badge key={idx} variant="secondary">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
          {formData.foodsAvoid.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-2">Foods You Avoid</p>
                <div className="flex flex-wrap gap-2">
                  {formData.foodsAvoid.map((food, idx) => (
                    <Badge key={idx} variant="outline">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
          {formData.additionalNotes && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Additional Notes</p>
                <p className="font-medium">{formData.additionalNotes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
