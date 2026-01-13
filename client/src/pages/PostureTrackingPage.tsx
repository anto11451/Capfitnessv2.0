import { RotateCcw } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader, AlertCircle, CheckCircle, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function PostureTrackingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [workoutName, setWorkoutName] = useState("Push-ups");
  const [isActive, setIsActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [posture, setPosture] = useState("neutral");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const postureRef = useRef("neutral");


  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const repStateRef = useRef("up");
  const lastRepTimeRef = useRef(0);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(null);
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(null);
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"),
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"),
    ])
      .then(() => {
        // Correctly capture MediaPipe globals from window
        const drawingUtils = (window as any).drawing_utils;
        const pose = (window as any).pose;

        if (drawingUtils && pose) {
          (window as any).drawConnectors = drawingUtils.drawConnectors;
          (window as any).drawLandmarks = drawingUtils.drawLandmarks;
          (window as any).POSE_CONNECTIONS = pose.POSE_CONNECTIONS;
        }
        
        setScriptsLoaded(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load MediaPipe scripts:", err);
        setError("Failed to load pose detection library. Please check your internet connection.");
        setIsLoading(false);
      });
  }, []);

  const calculateAngle = (a: any, b: any, c: any) => {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  };

  const processRepCount = useCallback(
    (landmarks: any[]) => {
      if (isPaused) return;

      const now = Date.now();
      // Adjust debounce for better responsiveness across all exercises
      if (now - lastRepTimeRef.current < 600) return;

      let angle = 0;
      let isDown = false;
      let postureGood = true;
      let feedbackMsg = "";

      const workout = workoutName.toLowerCase();
      
      if (workout.includes("push-up")) {
        const shoulder = landmarks[11];
        const elbow = landmarks[13];
        const wrist = landmarks[15];
        angle = calculateAngle(shoulder, elbow, wrist);
        isDown = angle < 90;

        const hip = landmarks[23];
        const backAngle = Math.abs(shoulder.y - hip.y);
        if (backAngle > 0.3) {
          postureGood = false;
          feedbackMsg = "Keep your back straight";
        }
      } else if (workout.includes("squat")) {
        const hip = landmarks[23];
        const knee = landmarks[25];
        const ankle = landmarks[27];
        angle = calculateAngle(hip, knee, ankle);
        isDown = angle < 100;

        if (isDown && angle > 70) {
          feedbackMsg = "Go lower for full rep";
        }

        const footDist = Math.abs(landmarks[27].x - landmarks[28].x);
        if (footDist < 0.2) {
          postureGood = false;
          feedbackMsg = "Widen your stance";
        }
      } else if (workout.includes("lunge")) {
        const hip = landmarks[23];
        const knee = landmarks[25];
        const ankle = landmarks[27];
        angle = calculateAngle(hip, knee, ankle);
        isDown = angle < 100;

        if (isDown && angle > 70) {
          feedbackMsg = "Lower your back knee more";
        }
      } else if (workout.includes("sit-up") || workout.includes("crunch")) {
        const shoulder = landmarks[11];
        const hip = landmarks[23];
        const knee = landmarks[25];
        angle = calculateAngle(shoulder, hip, knee);
        isDown = angle > 100;

        if (!isDown && angle < 60) {
          feedbackMsg = "Curl up higher";
        }
      } else if (workout.includes("jumping jack")) {
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        const head = landmarks[0];
        isDown = leftWrist.y < head.y && rightWrist.y < head.y;
        
        if (isDown && Math.abs(leftWrist.x - rightWrist.x) < 0.5) {
          feedbackMsg = "Clap your hands above head";
        }
      } else if (workout.includes("burpee")) {
        const shoulder = landmarks[11];
        const hip = landmarks[23];
        isDown = hip.y > 0.7; // Squatting or prone
        
        if (isDown && shoulder.y > 0.8) {
           feedbackMsg = "Get low for the push-up";
        }
      } else {
        const shoulder = landmarks[11];
        const elbow = landmarks[13];
        const wrist = landmarks[15];
        angle = calculateAngle(shoulder, elbow, wrist);
        isDown = angle < 90;
      }

      if (repStateRef.current === "up" && isDown) {
        repStateRef.current = "down";
      } else if (repStateRef.current === "down" && !isDown) {
        repStateRef.current = "up";
        lastRepTimeRef.current = now;
        if (postureGood) {
          setRepCount((prev) => prev + 1);
        }
      }

      if (!postureGood) {
        setPosture("bad");
        setFeedback(feedbackMsg);
      } else if (feedbackMsg) {
        setPosture("warning");
        setFeedback(feedbackMsg);
      } else {
        setPosture("good");
        setFeedback("");
      }
    },
    [workoutName, isPaused]
  );

  const onResults = useCallback(
    (results: any) => {
      if (!canvasRef.current || !videoRef.current || isPaused) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Match canvas dimensions to video
      if (canvas.width !== videoRef.current.videoWidth || canvas.height !== videoRef.current.videoHeight) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
      }

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        const drawConnectors = (window as any).drawConnectors;
        const drawLandmarks = (window as any).drawLandmarks;
        const POSE_CONNECTIONS = (window as any).POSE_CONNECTIONS;

        if (drawConnectors && POSE_CONNECTIONS) {
          // Use the live posture state for color feedback
          const postureColor = posture === "good" ? "#00FF00" : (posture === "warning" ? "#FFFF00" : "#FF0000");
          
          try {
            drawConnectors(
              ctx,
              results.poseLandmarks,
              POSE_CONNECTIONS,
              { color: postureColor, lineWidth: 5 }
            );

            if (drawLandmarks) {
              drawLandmarks(ctx, results.poseLandmarks, {
                color: "#FFFFFF",
                lineWidth: 2,
                radius: 4,
              });
            }
          } catch (e) {
            console.error("Drawing error:", e);
          }
        }

        processRepCount(results.poseLandmarks);
      }
      ctx.restore();
    },
    [processRepCount, posture, isPaused]
  );

  const startTracking = useCallback(async () => {
    if (!scriptsLoaded || typeof window === "undefined") return;
    if (!(window as any).Pose || !(window as any).Camera) return;

    try {
      const pose = new (window as any).Pose({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onResults);
      poseRef.current = pose;

      if (videoRef.current) {
        const camera = new (window as any).Camera(videoRef.current, {
          onFrame: async () => {
            if (poseRef.current && videoRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720,
        });

        await camera.start();
        cameraRef.current = camera;
        toast({
          title: "Camera Started",
          description: "Posture tracking is now active",
        });
      }
    } catch (err) {
      console.error("Error starting pose detection:", err);
      setError("Cannot access camera. Please check permissions and try again.");
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Check browser permissions.",
        variant: "destructive",
      });
    }
  }, [scriptsLoaded, onResults, toast]);

  useEffect(() => {
    if (isActive && scriptsLoaded) {
      startTracking();
    }

    return () => {
      // Clean up MediaPipe instances correctly to prevent memory leaks and runtime errors
      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch (e) {
          console.error("Camera stop error:", e);
        }
        cameraRef.current = null;
      }
      if (poseRef.current) {
        try {
          poseRef.current.close();
        } catch (e) {
          console.error("Pose close error:", e);
        }
        poseRef.current = null;
      }
    };
  }, [isActive, scriptsLoaded, startTracking]);

  const workoutOptions = [
    "Push-ups",
    "Squats",
    "Lunges",
    "Sit-ups",
    "Jumping Jacks",
    "Burpees",
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col">
      {/* FULL SCREEN CAMERA VIEW */}
      <div className="relative flex-1 bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover hidden"
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* TOP NAVIGATION OVERLAY */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="ghost"
            onClick={() => setLocation("/app")}
            className="bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 h-10 px-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
        </div>

        {/* WORKOUT SELECTION OVERLAY */}
        <div className="absolute top-4 right-4 z-20 w-40 sm:w-64">
          <select
            value={workoutName}
            onChange={(e) => {
              setWorkoutName(e.target.value);
              setRepCount(0);
              setFeedback("");
            }}
            disabled={isActive}
            className="w-full px-3 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
          >
            {workoutOptions.map((workout) => (
              <option key={workout} value={workout} className="bg-zinc-900">
                {workout}
              </option>
            ))}
          </select>
        </div>

        {/* REFERENCE IMAGE OVERLAY (LEFT) - HIDDEN ON SMALL MOBILE OR MINIMIZED */}
        <div className="absolute left-4 top-20 z-20 space-y-3 max-w-[120px] sm:max-w-[192px]">
          <div className="w-full aspect-square bg-black/60 backdrop-blur-md border border-primary/30 rounded-2xl overflow-hidden p-1 sm:p-2 hidden xs:block">
            <div className="w-full h-full rounded-xl bg-zinc-800 flex items-center justify-center relative overflow-hidden">
               <img 
                 src={workoutName === "Push-ups" ? "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&q=80&w=400"} 
                 alt={workoutName}
                 className="w-full h-full object-cover opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 sm:p-3">
                 <p className="text-[8px] sm:text-[10px] text-white font-bold uppercase tracking-widest">Form</p>
               </div>
            </div>
          </div>
          <div className="w-full p-2 sm:p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl hidden md:block">
            <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mb-1 sm:mb-2">Info</p>
            <p className="text-[10px] sm:text-xs text-white leading-tight sm:leading-relaxed">
              {workoutName === "Push-ups" 
                ? "Keep core tight and back flat."
                : "Keep chest up and heels flat."}
            </p>
          </div>
        </div>

        {/* STATS OVERLAY (BOTTOM) - ADAPTED FOR MOBILE */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 sm:p-6 shadow-2xl flex items-center justify-between gap-4 sm:gap-8">
            <div className="flex-1 space-y-0.5 sm:space-y-1">
              <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">Reps</p>
              <p className="text-3xl sm:text-5xl font-display font-bold text-primary tabular-nums">{repCount}</p>
            </div>

            <div className="h-10 sm:h-16 w-px bg-white/10" />

            <div className="flex-[2] space-y-0.5 sm:space-y-1">
              <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">Form Status</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse ${
                  posture === "good" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : 
                  posture === "warning" ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" : 
                  "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                }`} />
                <p className={`text-sm sm:text-xl font-bold uppercase tracking-tight ${
                  posture === "good" ? "text-green-400" : 
                  posture === "warning" ? "text-yellow-400" : 
                  "text-red-400"
                }`}>
                  {posture === "neutral" ? "Ready" : posture}
                </p>
              </div>
              <p className="text-[10px] sm:text-xs text-white/60 truncate max-w-[100px] sm:max-w-none">{feedback || "Scanning..."}</p>
            </div>

            <div className="flex gap-1.5 sm:gap-2">
              <Button
                onClick={() => setIsActive(!isActive)}
                className={`h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl transition-all active:scale-95 ${
                  isActive 
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg" 
                  : "bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/20"
                }`}
              >
                {isActive ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
              </Button>
              <Button
                onClick={() => {
                  setRepCount(0);
                  setFeedback("");
                  setPosture("neutral");
                }}
                variant="outline"
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white p-0"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-black flex items-center justify-center">
             <div className="text-center space-y-4">
               <Loader className="w-10 h-10 text-primary animate-spin mx-auto" />
               <p className="text-muted-foreground font-display tracking-widest">Initializing AI Vision...</p>
             </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
             <Card className="max-w-md bg-zinc-900 border-red-500/30">
               <CardHeader className="text-center">
                 <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                 <CardTitle className="text-white">Camera Access Error</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6 text-center">
                 <p className="text-muted-foreground">{error}</p>
                 <Button onClick={() => window.location.reload()} className="w-full bg-red-500 hover:bg-red-600">Retry Camera</Button>
               </CardContent>
             </Card>
          </div>
        )}

        {!isActive && !isLoading && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center space-y-6"
             >
               <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto border border-primary/30">
                  <Play className="w-10 h-10 text-primary" />
               </div>
               <h2 className="text-3xl font-display text-white">READY TO TRACK?</h2>
               <p className="text-muted-foreground max-w-xs mx-auto">Position yourself in full view of the camera and press play.</p>
             </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
