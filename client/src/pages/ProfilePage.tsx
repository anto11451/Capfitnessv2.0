import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/App";
import { getUserById, UserProfile } from "@/lib/googleSheetsApi";
import { Loader2, Check, Lock } from "lucide-react";

const READ_ONLY = true;

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.userId) return;
      setLoading(true);
      try {
        const userData = await getUserById(user.userId);
        if (userData) setProfile(userData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user?.userId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-muted-foreground">
            Loading profile…
          </span>
        </div>
      </Layout>
    );
  }

  const roClass =
    "bg-black/30 border-white/10 opacity-60 cursor-not-allowed pointer-events-none";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">
            USER <span className="text-primary">PROFILE</span>
          </h1>
          <p className="text-muted-foreground">
            Profile details are managed by your coach.
          </p>
        </div>

        <Card className="bg-card/40 border-white/5 p-8 backdrop-blur-xl relative">
          {/* LOCK OVERLAY */}
          {READ_ONLY && (
            <div className="absolute inset-0 rounded-xl bg-black/20 backdrop-blur-[1px] z-10 pointer-events-none" />
          )}

          <div className="space-y-6 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Full Name" value={profile.name} roClass={roClass} />
              <Field label="Email" value={profile.email || user?.email} roClass={roClass} />
              <Field label="Age" value={profile.age} roClass={roClass} />
              <Field label="Gender" value={profile.gender} roClass={roClass} />
              <Field label="Current Weight (kg)" value={profile.current_weight} roClass={roClass} />
              <Field label="Goal Weight (kg)" value={profile.goal_weight} roClass={roClass} />
              <Field label="Muscle Mass" value={profile.muscle_mass} roClass={roClass} />
              <Field label="Height (cm)" value={profile.height_cm} roClass={roClass} />
              <Field label="Membership Type" value={profile.membership_type} roClass={roClass} />
            </div>

            {/* DAILY TARGETS */}
            <div className="pt-4 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">
                Daily Targets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input value={String(profile.calorie_target ?? "")} disabled className={roClass} />
                <Input value={String(profile.protein_target ?? "")} disabled className={roClass} />
                <Input value={String(profile.carbs_target ?? "")} disabled className={roClass} />
                <Input value={String(profile.fats_target ?? "")} disabled className={roClass} />
              </div>
            </div>

            {/* CONNECTED ACCOUNTS */}
            <div className="pt-4 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">
                Connected Accounts
              </h3>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center text-green-500 font-bold">
                    G
                  </div>
                  <div>
                    <p className="font-bold text-white">Google Sheets</p>
                    <p className="text-xs text-muted-foreground">
                      Data synced with Google Sheets
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Connected</span>
                </div>
              </div>
            </div>

            {/* LOCKED CTA */}
            <div className="flex justify-end pt-4">
              <Button disabled className="opacity-40 cursor-not-allowed flex gap-2">
                <Lock className="w-4 h-4" />
                PROFILE LOCKED
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-right">
              Contact your coach to update profile details.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

/* ---------- Helper Component ---------- */
function Field({
  label,
  value,
  roClass,
}: {
  label: string;
  value?: string | number;
  roClass: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={String(value ?? "")} disabled className={roClass} />
    </div>
  );
}
