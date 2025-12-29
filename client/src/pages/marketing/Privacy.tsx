import PageWrapper from "@/components/PageWrapper";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-12 px-6 text-foreground">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-display font-bold mb-6">
          Privacy <span className="text-primary">Policy</span>
        </h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Cap’s Fitness ("we", "our", "us") is committed to protecting your personal 
            information in accordance with the Digital Personal Data Protection Act (DPDPA), 2023.
          </p>

          <h2 className="text-2xl font-semibold text-primary">1. What Information We Collect</h2>
          <p>
            We collect the information you provide through our fitness intake form, including 
            your name, email, phone, age, gender, health details, goals, and lifestyle data.
          </p>

          <h2 className="text-2xl font-semibold text-primary">2. Why We Collect It</h2>
          <p>
            To create personalized fitness recommendations, assess your needs, communicate with 
            you, and improve our services.
          </p>

          <h2 className="text-2xl font-semibold text-primary">3. How Your Data Is Stored</h2>
          <p>
            Your data is securely stored in Google Workspace (Sheets) and is not shared, sold, 
            or transferred to any third party.
          </p>

          <h2 className="text-2xl font-semibold text-primary">4. Your Rights</h2>
          <p>
            Under DPDPA, you may request access, correction, or deletion of your data at any time 
            by emailing anto.anand111@gmail.com
          </p>

          <h2 className="text-2xl font-semibold text-primary">5. Consent</h2>
          <p>
            By submitting the fitness intake form, you consent to the processing of your personal 
            data for fitness-related services.
          </p>

          <h2 className="text-2xl font-semibold text-primary">6. Contact Us</h2>
          <p>
            For questions or requests: <br />
            📧 <span className="text-primary">anto.anand111@gmail.com</span>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
