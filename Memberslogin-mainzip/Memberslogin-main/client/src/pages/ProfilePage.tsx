import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/App';
import { updateUserProfile, getUserById, UserProfile } from '@/lib/googleSheetsApi';
import { Save, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.userId) return;
      setLoading(true);
      try {
        const userData = await getUserById(user.userId);
        if (userData) {
          setProfile(userData);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user?.userId]);

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.userId) {
      toast({
        title: "Not logged in",
        description: "Please log in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const result = await updateUserProfile(user.userId, {
        name: profile.name,
        age: profile.age,
        current_weight: profile.current_weight,
        height_cm: profile.height_cm,
        goal_weight: profile.goal_weight,
        calorie_target: profile.calorie_target,
        protein_target: profile.protein_target,
        carbs_target: profile.carbs_target,
        fats_target: profile.fats_target,
      });

      if (result?.ok) {
        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully. Refresh to see updates.",
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Save failed",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-muted-foreground">Loading profile...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">USER <span className="text-primary">PROFILE</span></h1>
          <p className="text-muted-foreground">Manage your personal stats and preferences.</p>
        </div>

        <Card className="bg-card/40 border-white/5 p-8 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={profile.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-black/20 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  value={profile.email || user?.email || ''} 
                  disabled
                  className="bg-black/20 border-white/10 opacity-60" 
                />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input 
                  type="number"
                  value={profile.age || ''} 
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  className="bg-black/20 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={profile.gender || 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Current Weight (kg)</Label>
                <Input 
                  type="number"
                  step="0.1"
                  value={profile.current_weight || ''} 
                  onChange={(e) => handleInputChange('current_weight', parseFloat(e.target.value) || 0)}
                  className="bg-black/20 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Goal Weight (kg)</Label>
                <Input 
                  type="number"
                  step="0.1"
                  value={profile.goal_weight || ''} 
                  onChange={(e) => handleInputChange('goal_weight', parseFloat(e.target.value) || 0)}
                  className="bg-black/20 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input 
                  type="number"
                  value={profile.height_cm || ''} 
                  onChange={(e) => handleInputChange('height_cm', parseInt(e.target.value) || 0)}
                  className="bg-black/20 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Membership Type</Label>
                <Input 
                  value={profile.membership_type || ''} 
                  disabled
                  className="bg-black/20 border-white/10 opacity-60" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Daily Targets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Calorie Target</Label>
                  <Input 
                    type="number"
                    value={profile.calorie_target || ''} 
                    onChange={(e) => handleInputChange('calorie_target', parseInt(e.target.value) || 0)}
                    className="bg-black/20 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Protein (g)</Label>
                  <Input 
                    type="number"
                    value={profile.protein_target || ''} 
                    onChange={(e) => handleInputChange('protein_target', parseInt(e.target.value) || 0)}
                    className="bg-black/20 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Carbs (g)</Label>
                  <Input 
                    type="number"
                    value={profile.carbs_target || ''} 
                    onChange={(e) => handleInputChange('carbs_target', parseInt(e.target.value) || 0)}
                    className="bg-black/20 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Fats (g)</Label>
                  <Input 
                    type="number"
                    value={profile.fats_target || ''} 
                    onChange={(e) => handleInputChange('fats_target', parseInt(e.target.value) || 0)}
                    className="bg-black/20 border-white/10" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Connected Accounts</h3>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center text-green-500 font-bold">G</div>
                  <div>
                    <p className="font-bold text-white">Google Sheets</p>
                    <p className="text-xs text-muted-foreground">Data synced with Google Sheets</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Connected</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                disabled={saving}
                className="bg-primary text-black hover:bg-primary/90 font-bold"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> SAVING...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> SAVE CHANGES
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
