import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

interface UserData {
  email: string;
  name: string;
  gender: string;
  planAssigned: string;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  workoutSchedule: string;
  programStartDate: string;
  programEndDate: string;
  nextSession: string;
  startingWeight: number;
  currentWeight: number;
  goalWeight: number;
  currentStreak: number;
}

const demoUsers: (UserData & { password: string })[] = [
  {
    email: "demo@capsfitness.com",
    password: "demo123",
    name: "Demo User",
    gender: "male",
    planAssigned: "Push Pull Legs",
    calorieTarget: 2800,
    proteinTarget: 200,
    carbsTarget: 300,
    fatsTarget: 80,
    workoutSchedule: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    programStartDate: "2025-01-01",
    programEndDate: "2025-06-30",
    nextSession: "Push Day - Chest & Shoulders",
    startingWeight: 85,
    currentWeight: 82,
    goalWeight: 75,
    currentStreak: 12,
  },
  {
    email: "alex@example.com",
    password: "alex123",
    name: "Alex Runner",
    gender: "female",
    planAssigned: "Hybrid Athlete",
    calorieTarget: 2500,
    proteinTarget: 180,
    carbsTarget: 280,
    fatsTarget: 70,
    workoutSchedule: "Monday, Wednesday, Friday, Saturday",
    programStartDate: "2025-02-01",
    programEndDate: "2025-07-31",
    nextSession: "Cardio & Core",
    startingWeight: 70,
    currentWeight: 68,
    goalWeight: 62,
    currentStreak: 7,
  },
];

async function authenticateWithGoogleSheets(email: string, password: string): Promise<UserData | null> {
  const apiUrl = process.env.GOOGLE_SHEETS_API_URL;

  if (!apiUrl) {
    console.log("Google Sheets API not configured, using demo accounts");
    return null;
  }

  try {
    const requestBody = {
      action: "login",
      email: email,
      password: password,
    };

    console.log("Attempting Google Sheets login for:", email);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Google Sheets API error:", response.statusText);
      return null;
    }

    const result = await response.json();
    console.log("Google Sheets API response:", JSON.stringify(result));
    
    // Apps Script returns { ok: true, profile: {...} } with snake_case fields
    if (result.ok && result.profile) {
      const profile = result.profile;
      return {
        email: profile.email || email,
        name: profile.name || "Member",
        gender: profile.gender || "male",
        planAssigned: profile.plan_assigned || "No Plan Assigned",
        calorieTarget: Number(profile.calorie_target) || 2000,
        proteinTarget: Number(profile.protein_target) || 150,
        carbsTarget: Number(profile.carbs_target) || 250,
        fatsTarget: Number(profile.fats_target) || 65,
        workoutSchedule: profile.workout_schedule || "",
        programStartDate: profile.plan_start_date || "",
        programEndDate: profile.plan_end_date || "",
        nextSession: profile.next_session_date || "",
        startingWeight: Number(profile.starting_weight) || 0,
        currentWeight: Number(profile.current_weight) || 0,
        goalWeight: Number(profile.goal_weight) || 0,
        currentStreak: Number(profile.current_streak) || 0,
      };
    }
    
    if (result.error) {
      console.log("Google Sheets login failed:", result.error);
    }
    
    return null;
  } catch (error) {
    console.error("Error authenticating with Google Sheets:", error);
    return null;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: "Email and password are required" 
        });
      }

      let userData = await authenticateWithGoogleSheets(email, password);

      if (!userData) {
        const demoUser = demoUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (demoUser) {
          const { password: _, ...userWithoutPassword } = demoUser;
          userData = userWithoutPassword;
        }
      }

      if (userData) {
        res.json({ 
          success: true, 
          user: userData 
        });
      } else {
        res.status(401).json({ 
          success: false, 
          error: "Invalid email or password" 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        error: "An error occurred during login" 
      });
    }
  });

  app.get("/api/user/data", async (req, res) => {
    try {
      const email = req.query.email as string;
      const userId = req.query.user_id as string;
      
      if (!email && !userId) {
        return res.status(400).json({ 
          success: false, 
          error: "Email or user_id is required" 
        });
      }

      const apiUrl = process.env.GOOGLE_SHEETS_API_URL;

      if (apiUrl && userId) {
        try {
          // Use getDashboard action to get user data from Google Sheets
          const requestBody = {
            action: "getDashboard",
            user_id: userId,
          };

          console.log("Fetching dashboard for user:", userId);

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("Dashboard API response:", JSON.stringify(result));
            if (result.ok && result.dashboard) {
              return res.json({ success: true, data: result.dashboard });
            }
          }
        } catch (error) {
          console.error("Error fetching from Google Sheets:", error);
        }
      }

      // Fallback to demo users
      const demoUser = demoUsers.find(
        (u) => u.email.toLowerCase() === (email || "").toLowerCase()
      );

      if (demoUser) {
        const { password: _, ...userWithoutPassword } = demoUser;
        return res.json({ success: true, data: userWithoutPassword });
      }

      res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ 
        success: false, 
        error: "An error occurred fetching user data" 
      });
    }
  });

  app.post("/api/submit-intake", async (req, res) => {
    try {
      const formData = req.body;
      
      const apiUrl = process.env.GOOGLE_SHEETS_API_URL;
      const apiSecret = process.env.GOOGLE_SHEETS_API_SECRET;

      if (!apiUrl) {
        console.log("Google Sheets API not configured, intake form submission simulated");
        return res.json({ 
          success: true, 
          message: "Intake submitted successfully (demo mode)",
          data: formData 
        });
      }

      const payload: Record<string, unknown> = {
        action: "submitIntake",
        formId: "cap_form_v1",
        ...formData,
      };

      if (apiSecret) {
        payload._secret = apiSecret;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      res.json({ 
        success: true, 
        message: "Intake submitted successfully",
        data: result 
      });
    } catch (error) {
      console.error("Error submitting to Google Sheets:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/dashboard-data", async (req, res) => {
    try {
      const userId = req.query.user_id as string;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: "user_id is required" 
        });
      }

      const apiUrl = process.env.GOOGLE_SHEETS_API_URL;
      
      if (apiUrl) {
        try {
          const requestBody = {
            action: "getDashboardData",
            user_id: userId,
          };

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.ok) {
              return res.json({ 
                success: true, 
                dailyLog: result.dailyLog,
                weightLog: result.weightLog,
                streak: result.streak
              });
            }
          }
        } catch (error) {
          console.error("Error fetching from Google Sheets API:", error);
        }
      }

      res.json({ 
        success: true, 
        dailyLog: null,
        weightLog: null,
        streak: null,
        message: "No data found" 
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ 
        success: false, 
        error: "An error occurred fetching dashboard data" 
      });
    }
  });

  return httpServer;
}
