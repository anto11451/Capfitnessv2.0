import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Dumbbell, Calendar, Lock, Users, Plus, Edit, Trash2, Save, X, Award, Bell, Target, Trophy, Medal, Star, ChevronDown, ChevronUp, Send, Utensils, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminAuth, adminGetAllUsers, adminCreateUser, adminUpdateUser, UserProfile } from '@/lib/googleSheetsApi';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  medal?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'motivation';
  sentAt: string;
  read: boolean;
}

type EnhancedUserProfile = Omit<UserProfile, 'plan_start_date' | 'plan_end_date'> & {
  plan_start_date?: string;
  plan_end_date?: string;
  milestones?: Milestone[];
  medals?: { bronze: number; silver: number; gold: number; platinum: number };
  notifications?: UserNotification[];
};

const defaultMilestones: Milestone[] = [
  { id: '1', title: 'First Week Complete', description: 'Complete your first full week of training', targetDate: '', completed: false, medal: 'bronze' },
  { id: '2', title: 'Weight Goal 25%', description: 'Reach 25% of your weight loss goal', targetDate: '', completed: false, medal: 'bronze' },
  { id: '3', title: 'First Month Strong', description: 'Complete one month of consistent training', targetDate: '', completed: false, medal: 'silver' },
  { id: '4', title: 'Weight Goal 50%', description: 'Reach halfway to your weight goal', targetDate: '', completed: false, medal: 'silver' },
  { id: '5', title: 'Protein Master', description: 'Hit protein targets for 30 consecutive days', targetDate: '', completed: false, medal: 'gold' },
  { id: '6', title: 'Weight Goal Achieved', description: 'Reach your target weight', targetDate: '', completed: false, medal: 'platinum' },
];

const MEDAL_ICONS = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

const MEDAL_COLORS = {
  bronze: 'bg-amber-700/20 border-amber-600 text-amber-500',
  silver: 'bg-slate-400/20 border-slate-400 text-slate-300',
  gold: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
  platinum: 'bg-cyan-400/20 border-cyan-400 text-cyan-300',
};

export default function AdminPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content'>('overview');
  const [users, setUsers] = useState<EnhancedUserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<EnhancedUserProfile | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [userEditTab, setUserEditTab] = useState<'profile' | 'milestones' | 'notifications'>('profile');
  const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'motivation' as const });
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<EnhancedUserProfile>>({
    name: '',
    email: '',
    gender: 'Male',
    age: 25,
    height_cm: 170,
    starting_weight: 70,
    current_weight: 70,
    goal_weight: 65,
    membership_type: 'Standard',
    membership_duration: '3 months',
    calorie_target: 2000,
    protein_target: 150,
    carbs_target: 200,
    fats_target: 65,
    plan_start_date: new Date().toISOString().split('T')[0],
    plan_end_date: '',
    milestones: defaultMilestones,
    medals: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (username === 'iamcap' && password === 'Sunshine@123') {
      setIsAuthenticated(true);
      setError('');
      toast({ title: 'Welcome Admin', description: 'Successfully logged in.' });
    } else {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const fetchedUsers = await adminGetAllUsers(username, password);
    if (fetchedUsers) {
      const enhancedUsers: EnhancedUserProfile[] = fetchedUsers.map(user => {
        const extUser = user as any;
        return {
          ...user,
          plan_start_date: extUser.plan_start_date || new Date().toISOString().split('T')[0],
          plan_end_date: extUser.plan_end_date || '',
          milestones: extUser.milestones || defaultMilestones.map(m => ({ ...m, id: `${user.user_id}-${m.id}` })),
          medals: extUser.medals || { bronze: 0, silver: 0, gold: 0, platinum: 0 },
          notifications: extUser.notifications || [],
        };
      });
      setUsers(enhancedUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'users') {
      loadUsers();
    }
  }, [isAuthenticated, activeTab]);

  const calculatePlanProgress = (user: EnhancedUserProfile): number => {
    if (!user.plan_start_date || !user.plan_end_date) return 0;
    const start = new Date(user.plan_start_date).getTime();
    const end = new Date(user.plan_end_date).getTime();
    const now = Date.now();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const getDaysRemaining = (endDate: string): number => {
    if (!endDate) return 0;
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleCreateUser = async () => {
    setLoading(true);
    const result = await adminCreateUser(username, password, newUser);
    if (result?.ok) {
      toast({ title: 'User Created', description: `User created successfully. Generated password: ${result.generated_password || 'Check email'}` });
      setIsCreating(false);
      setNewUser({
        name: '',
        email: '',
        gender: 'Male',
        age: 25,
        height_cm: 170,
        starting_weight: 70,
        current_weight: 70,
        goal_weight: 65,
        membership_type: 'Standard',
        membership_duration: '3 months',
        calorie_target: 2000,
        protein_target: 150,
        carbs_target: 200,
        fats_target: 65,
        plan_start_date: new Date().toISOString().split('T')[0],
        plan_end_date: '',
        milestones: defaultMilestones,
        medals: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
      });
      loadUsers();
    } else {
      toast({ title: 'Error', description: 'Failed to create user.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setLoading(true);
    const result = await adminUpdateUser(username, password, selectedUser.user_id, selectedUser);
    if (result?.ok) {
      toast({ title: 'User Updated', description: 'User profile updated successfully.' });
      setIsUserDialogOpen(false);
      loadUsers();
    } else {
      toast({ title: 'Error', description: 'Failed to update user.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const toggleMilestone = (milestoneId: string) => {
    if (!selectedUser) return;
    const updatedMilestones = selectedUser.milestones?.map(m => {
      if (m.id === milestoneId) {
        const completed = !m.completed;
        if (completed && m.medal && selectedUser.medals) {
          const newMedals = { ...selectedUser.medals };
          newMedals[m.medal] += 1;
          setSelectedUser({ ...selectedUser, medals: newMedals, milestones: selectedUser.milestones?.map(ms => ms.id === milestoneId ? { ...ms, completed } : ms) });
          return { ...m, completed };
        }
        return { ...m, completed };
      }
      return m;
    });
    setSelectedUser({ ...selectedUser, milestones: updatedMilestones });
  };

  const sendNotification = () => {
    if (!selectedUser || !newNotification.title || !newNotification.message) {
      toast({ title: 'Error', description: 'Please fill in all notification fields.', variant: 'destructive' });
      return;
    }
    const notification: UserNotification = {
      id: Date.now().toString(),
      userId: selectedUser.user_id,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setSelectedUser({
      ...selectedUser,
      notifications: [...(selectedUser.notifications || []), notification],
    });
    setNewNotification({ title: '', message: '', type: 'motivation' });
    toast({ title: 'Notification Queued', description: 'Notification will be sent to the user.' });
  };

  const getTotalMedals = (user: EnhancedUserProfile): number => {
    if (!user.medals) return 0;
    return user.medals.bronze + user.medals.silver + user.medals.gold + user.medals.platinum;
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md p-8 bg-card/40 border-white/5 backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white">ADMIN ACCESS</h1>
              <p className="text-muted-foreground">Restricted area.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="bg-black/20 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-black/20 border-white/10" 
                />
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 font-bold">
                LOGIN
              </Button>
            </form>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">ADMIN <span className="text-red-500">PANEL</span></h1>
            <p className="text-muted-foreground">Content management system.</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)} className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white">
            Logout
          </Button>
        </div>

        <div className="flex gap-2 border-b border-white/10 pb-4">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'bg-red-600 text-white' : ''}
          >
            <FileText className="w-4 h-4 mr-2" /> Overview
          </Button>
          <Button 
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'bg-red-600 text-white' : ''}
          >
            <Users className="w-4 h-4 mr-2" /> Users
          </Button>
          <Button 
            variant={activeTab === 'content' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('content')}
            className={activeTab === 'content' ? 'bg-red-600 text-white' : ''}
          >
            <Dumbbell className="w-4 h-4 mr-2" /> Content
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('content')}>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Upload Exercise</h3>
              <p className="text-muted-foreground text-sm mt-2">Add new exercises to the global repository via Google Sheets.</p>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('content')}>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Upload Plan</h3>
              <p className="text-muted-foreground text-sm mt-2">Push new training blocks and weekly schedules.</p>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('users')}>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Manage Users</h3>
              <p className="text-muted-foreground text-sm mt-2">Create, edit, and manage member accounts.</p>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 hover:border-yellow-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('users')}>
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Award Medals</h3>
              <p className="text-muted-foreground text-sm mt-2">Track milestones and award achievement medals.</p>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 hover:border-blue-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('users')}>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Send Notifications</h3>
              <p className="text-muted-foreground text-sm mt-2">Motivate members with personalized messages.</p>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 hover:border-green-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('content')}>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Manage Recipes</h3>
              <p className="text-muted-foreground text-sm mt-2">Add and edit nutrition recipes with macros.</p>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <Button onClick={() => setIsCreating(true)} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </div>

            {isCreating && (
              <Card className="bg-card/40 border-white/5 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Create New User</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}><X className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={newUser.name || ''} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={newUser.email || ''} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={newUser.gender} onValueChange={(v) => setNewUser({...newUser, gender: v})}>
                      <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" value={newUser.age || ''} onChange={(e) => setNewUser({...newUser, age: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" value={newUser.height_cm || ''} onChange={(e) => setNewUser({...newUser, height_cm: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Weight (kg)</Label>
                    <Input type="number" value={newUser.current_weight || ''} onChange={(e) => setNewUser({...newUser, current_weight: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Goal Weight (kg)</Label>
                    <Input type="number" value={newUser.goal_weight || ''} onChange={(e) => setNewUser({...newUser, goal_weight: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Plan Start Date</Label>
                    <Input type="date" value={newUser.plan_start_date || ''} onChange={(e) => setNewUser({...newUser, plan_start_date: e.target.value})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Plan End Date</Label>
                    <Input type="date" value={newUser.plan_end_date || ''} onChange={(e) => setNewUser({...newUser, plan_end_date: e.target.value})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Calorie Target</Label>
                    <Input type="number" value={newUser.calorie_target || ''} onChange={(e) => setNewUser({...newUser, calorie_target: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Protein Target (g)</Label>
                    <Input type="number" value={newUser.protein_target || ''} onChange={(e) => setNewUser({...newUser, protein_target: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Membership Type</Label>
                    <Select value={newUser.membership_type} onValueChange={(v) => setNewUser({...newUser, membership_type: v})}>
                      <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateUser} disabled={loading} className="mt-4 bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" /> Create User
                </Button>
              </Card>
            )}

            <Card className="bg-card/40 border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/40">
                    <tr>
                      <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Membership</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Plan Progress</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Days Left</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Medals</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{loading ? 'Loading users...' : 'No users found. Users will appear here when loaded from Google Sheets.'}</td></tr>
                    )}
                    {users.map((user) => (
                      <React.Fragment key={user.user_id}>
                        <tr className="border-t border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setExpandedUser(expandedUser === user.user_id ? null : user.user_id)}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {expandedUser === user.user_id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                              <div>
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">{user.membership_type}</span></td>
                          <td className="p-4">
                            <div className="w-32">
                              <Progress value={calculatePlanProgress(user)} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">{calculatePlanProgress(user)}% complete</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`font-bold ${getDaysRemaining(user.plan_end_date || '') < 7 ? 'text-red-400' : 'text-white'}`}>
                              {getDaysRemaining(user.plan_end_date || '')} days
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1 items-center">
                              <span className="text-sm">{MEDAL_ICONS.bronze} {user.medals?.bronze || 0}</span>
                              <span className="text-sm">{MEDAL_ICONS.silver} {user.medals?.silver || 0}</span>
                              <span className="text-sm">{MEDAL_ICONS.gold} {user.medals?.gold || 0}</span>
                              <span className="text-sm">{MEDAL_ICONS.platinum} {user.medals?.platinum || 0}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedUser(user); setIsUserDialogOpen(true); setUserEditTab('profile'); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                        {expandedUser === user.user_id && (
                          <tr className="bg-black/20">
                            <td colSpan={6} className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Plan Details</p>
                                  <p className="text-sm text-white">Start: {user.plan_start_date || 'Not set'}</p>
                                  <p className="text-sm text-white">End: {user.plan_end_date || 'Not set'}</p>
                                  <p className="text-sm text-white">Assigned: {user.plan_assigned || 'None'}</p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Targets</p>
                                  <p className="text-sm text-white">Calories: {user.calorie_target} kcal</p>
                                  <p className="text-sm text-white">Protein: {user.protein_target}g</p>
                                  <p className="text-sm text-white">Goal Weight: {user.goal_weight}kg</p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Milestones</p>
                                  <p className="text-sm text-white">{user.milestones?.filter(m => m.completed).length || 0} / {user.milestones?.length || 0} completed</p>
                                  <p className="text-sm text-white">Total Medals: {getTotalMedals(user)}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <Tabs defaultValue="exercises" className="space-y-6">
              <TabsList className="bg-black/40 border border-white/10 p-1">
                <TabsTrigger value="exercises" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Dumbbell className="w-4 h-4 mr-2" /> Exercises
                </TabsTrigger>
                <TabsTrigger value="recipes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Utensils className="w-4 h-4 mr-2" /> Recipes
                </TabsTrigger>
                <TabsTrigger value="plans" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Calendar className="w-4 h-4 mr-2" /> Workout Plans
                </TabsTrigger>
                <TabsTrigger value="blogs" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <BookOpen className="w-4 h-4 mr-2" /> Protein Blogs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="exercises">
                <Card className="bg-card/40 border-white/5 p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Upload Exercises</h3>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-red-500/50 transition-colors cursor-pointer bg-black/20">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-white font-medium">Drag & Drop exercise files here</p>
                    <p className="text-muted-foreground text-sm mt-1">Supported formats: CSV, JSON</p>
                    <Button variant="secondary" className="mt-6">BROWSE FILES</Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="recipes">
                <Card className="bg-card/40 border-white/5 p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Manage Recipes</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Recipe Name</Label>
                        <Input placeholder="e.g., Protein Smoothie Bowl" className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Calories</Label>
                        <Input type="number" placeholder="450" className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Protein (g)</Label>
                        <Input type="number" placeholder="35" className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Carbs (g)</Label>
                        <Input type="number" placeholder="40" className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Fats (g)</Label>
                        <Input type="number" placeholder="15" className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input placeholder="https://..." className="bg-black/20 border-white/10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ingredients (one per line)</Label>
                      <Textarea placeholder="200g Greek yogurt&#10;1 scoop whey protein&#10;1 banana..." className="bg-black/20 border-white/10 min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label>Instructions (one per line)</Label>
                      <Textarea placeholder="1. Blend yogurt with protein powder&#10;2. Pour into bowl..." className="bg-black/20 border-white/10 min-h-[100px]" />
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 w-fit">
                      <Plus className="w-4 h-4 mr-2" /> Add Recipe
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="plans">
                <Card className="bg-card/40 border-white/5 p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Manage Workout Plans</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Plan Name</Label>
                        <Input placeholder="e.g., 12-Week Fat Loss" className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <Select>
                          <SelectTrigger className="bg-black/20 border-white/10"><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (weeks)</Label>
                        <Input type="number" placeholder="12" className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Goal</Label>
                        <Select>
                          <SelectTrigger className="bg-black/20 border-white/10"><SelectValue placeholder="Select goal" /></SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="fat-loss">Fat Loss</SelectItem>
                            <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                            <SelectItem value="strength">Strength</SelectItem>
                            <SelectItem value="endurance">Endurance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="A comprehensive plan designed to..." className="bg-black/20 border-white/10" />
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 w-fit">
                      <Plus className="w-4 h-4 mr-2" /> Add Plan
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="blogs">
                <Card className="bg-card/40 border-white/5 p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Manage Protein Hack Blogs</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Blog Title</Label>
                        <Input placeholder="e.g., 20 Ways to Hit 100g Protein" className="bg-black/20 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select>
                          <SelectTrigger className="bg-black/20 border-white/10"><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="protein-tips">Protein Tips</SelectItem>
                            <SelectItem value="meal-prep">Meal Prep</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="budget">Budget Friendly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Summary</Label>
                      <Textarea placeholder="A brief summary of the blog post..." className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Content (Markdown supported)</Label>
                      <Textarea placeholder="# Introduction&#10;&#10;Protein is essential for..." className="bg-black/20 border-white/10 min-h-[200px]" />
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700 w-fit">
                      <Plus className="w-4 h-4 mr-2" /> Add Blog Post
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-3xl bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">Edit User: {selectedUser?.name}</DialogTitle>
              <DialogDescription>Update user profile, milestones, and send notifications.</DialogDescription>
            </DialogHeader>
            
            <Tabs value={userEditTab} onValueChange={(v) => setUserEditTab(v as any)} className="mt-4">
              <TabsList className="bg-black/40 border border-white/10 p-1 mb-4">
                <TabsTrigger value="profile" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Users className="w-4 h-4 mr-2" /> Profile
                </TabsTrigger>
                <TabsTrigger value="milestones" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Trophy className="w-4 h-4 mr-2" /> Milestones
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Bell className="w-4 h-4 mr-2" /> Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                {selectedUser && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={selectedUser.name} onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={selectedUser.email} onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Plan Start Date</Label>
                      <Input type="date" value={selectedUser.plan_start_date || ''} onChange={(e) => setSelectedUser({...selectedUser, plan_start_date: e.target.value})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Plan End Date</Label>
                      <Input type="date" value={selectedUser.plan_end_date || ''} onChange={(e) => setSelectedUser({...selectedUser, plan_end_date: e.target.value})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input type="number" value={selectedUser.age} onChange={(e) => setSelectedUser({...selectedUser, age: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (cm)</Label>
                      <Input type="number" value={selectedUser.height_cm} onChange={(e) => setSelectedUser({...selectedUser, height_cm: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Weight (kg)</Label>
                      <Input type="number" value={selectedUser.current_weight} onChange={(e) => setSelectedUser({...selectedUser, current_weight: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Goal Weight (kg)</Label>
                      <Input type="number" value={selectedUser.goal_weight} onChange={(e) => setSelectedUser({...selectedUser, goal_weight: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Calorie Target</Label>
                      <Input type="number" value={selectedUser.calorie_target} onChange={(e) => setSelectedUser({...selectedUser, calorie_target: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Protein Target (g)</Label>
                      <Input type="number" value={selectedUser.protein_target} onChange={(e) => setSelectedUser({...selectedUser, protein_target: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Plan Assigned</Label>
                      <Input value={selectedUser.plan_assigned || ''} onChange={(e) => setSelectedUser({...selectedUser, plan_assigned: e.target.value})} className="bg-black/20 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Membership Type</Label>
                      <Select value={selectedUser.membership_type} onValueChange={(v) => setSelectedUser({...selectedUser, membership_type: v})}>
                        <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="milestones">
                {selectedUser && (
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                      <div className="flex gap-3">
                        <div className={`px-3 py-2 rounded-lg ${MEDAL_COLORS.bronze} border`}>
                          <p className="text-2xl text-center">{MEDAL_ICONS.bronze}</p>
                          <p className="text-sm font-bold">{selectedUser.medals?.bronze || 0}</p>
                        </div>
                        <div className={`px-3 py-2 rounded-lg ${MEDAL_COLORS.silver} border`}>
                          <p className="text-2xl text-center">{MEDAL_ICONS.silver}</p>
                          <p className="text-sm font-bold">{selectedUser.medals?.silver || 0}</p>
                        </div>
                        <div className={`px-3 py-2 rounded-lg ${MEDAL_COLORS.gold} border`}>
                          <p className="text-2xl text-center">{MEDAL_ICONS.gold}</p>
                          <p className="text-sm font-bold">{selectedUser.medals?.gold || 0}</p>
                        </div>
                        <div className={`px-3 py-2 rounded-lg ${MEDAL_COLORS.platinum} border`}>
                          <p className="text-2xl text-center">{MEDAL_ICONS.platinum}</p>
                          <p className="text-sm font-bold">{selectedUser.medals?.platinum || 0}</p>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-2xl font-bold text-white">{getTotalMedals(selectedUser)}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Medals</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedUser.milestones?.map(milestone => (
                        <div 
                          key={milestone.id} 
                          className={`p-4 rounded-lg border flex items-center gap-4 ${milestone.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-black/20 border-white/10'}`}
                        >
                          <button
                            onClick={() => toggleMilestone(milestone.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${milestone.completed ? 'bg-green-500 border-green-500' : 'border-white/30'}`}
                          >
                            {milestone.completed && <Star className="w-3 h-3 text-white" />}
                          </button>
                          <div className="flex-1">
                            <p className={`font-medium ${milestone.completed ? 'text-green-400' : 'text-white'}`}>{milestone.title}</p>
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          </div>
                          {milestone.medal && (
                            <div className={`px-2 py-1 rounded text-sm ${MEDAL_COLORS[milestone.medal]} border`}>
                              {MEDAL_ICONS[milestone.medal]} {milestone.medal}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notifications">
                {selectedUser && (
                  <div className="space-y-4 py-4">
                    <Card className="p-4 bg-black/20 border-white/10">
                      <h4 className="font-bold text-white mb-4">Send New Notification</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input 
                              value={newNotification.title} 
                              onChange={(e) => setNewNotification({...newNotification, title: e.target.value})} 
                              placeholder="e.g., Keep going!" 
                              className="bg-black/20 border-white/10" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={newNotification.type} onValueChange={(v) => setNewNotification({...newNotification, type: v as any})}>
                              <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                              <SelectContent className="bg-card border-white/10">
                                <SelectItem value="motivation">Motivation</SelectItem>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Message</Label>
                          <Textarea 
                            value={newNotification.message} 
                            onChange={(e) => setNewNotification({...newNotification, message: e.target.value})} 
                            placeholder="You're doing amazing! Just 5 more days to hit your weekly goal..." 
                            className="bg-black/20 border-white/10" 
                          />
                        </div>
                        <Button onClick={sendNotification} className="bg-blue-600 hover:bg-blue-700">
                          <Send className="w-4 h-4 mr-2" /> Send Notification
                        </Button>
                      </div>
                    </Card>

                    <div className="space-y-2">
                      <h4 className="font-bold text-white">Sent Notifications</h4>
                      {selectedUser.notifications && selectedUser.notifications.length > 0 ? (
                        selectedUser.notifications.map(notif => (
                          <div key={notif.id} className="p-3 rounded-lg bg-black/20 border border-white/10">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-white">{notif.title}</p>
                                <p className="text-sm text-muted-foreground">{notif.message}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                notif.type === 'motivation' ? 'bg-purple-500/20 text-purple-400' :
                                notif.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                notif.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>{notif.type}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{new Date(notif.sentAt).toLocaleString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No notifications sent yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button onClick={handleUpdateUser} disabled={loading} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
