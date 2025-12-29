import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "../IntakeForm";

interface Step1Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function Step1Personal({ formData, updateFormData }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          data-testid="input-name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age">
            Age <span className="text-destructive">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            value={formData.age}
            onChange={(e) => updateFormData({ age: e.target.value })}
            data-testid="input-age"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">
            Gender <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData({ gender: value })}>
            <SelectTrigger id="gender" data-testid="select-gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          data-testid="input-phone"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          data-testid="input-email"
        />
      </div>
    </div>
  );
}
