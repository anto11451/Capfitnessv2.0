import PageWrapper from "@/components/PageWrapper";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Terms() {
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
          Terms & <span className="text-primary">Conditions</span>
        </h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            By accessing Cap’s Fitness website, tools, calculators, or intake form, 
            you agree to these Terms & Conditions.
          </p>

          <h2 className="text-2xl font-semibold text-primary">1. Services</h2>
          <p>
            We provide fitness tools, calculators, blog content, and intake-based 
            personalized guidance. These are for informational and educational 
            purposes only.
          </p>

          <h2 className="text-2xl font-semibold text-primary">2. Health Disclaimer</h2>
          <p>
            Cap’s Fitness does not provide medical advice. Consult a healthcare 
            professional before making changes to your diet or exercise routine.
          </p>

          <h2 className="text-2xl font-semibold text-primary">3. User Responsibilities</h2>
          <p>
            You agree to submit accurate information and use our site responsibly. 
            Misuse may result in removal of access.
          </p>

          <h2 className="text-2xl font-semibold text-primary">4. Limitation of Liability</h2>
          <p>
            We are not responsible for injuries, misuse of information, or outcomes 
            based on user-provided data.
          </p>

          <h2 className="text-2xl font-semibold text-primary">5. Changes to Terms</h2>
          <p>
            These terms may be updated periodically. Continued use means acceptance.
          </p>

          <h2 className="text-2xl font-semibold text-primary">6. Contact Us</h2>
          <p>
            For questions: <br />
            📧 <span className="text-primary">anto.anand111@gmail.com</span>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
