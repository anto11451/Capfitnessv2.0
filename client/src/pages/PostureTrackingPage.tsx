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
      if (now - lastRepTimeRef.current < 500) return;

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

        if (knee.x < ankle.x - 0.1 || knee.x > ankle.x + 0.1) {
          postureGood = false;
          feedbackMsg = "Keep knees aligned with toes";
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
      if (!canvasRef.current || !videoRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        const drawingUtils = (window as any).drawingUtils;
        const pose = (window as any).pose;

        if (drawingUtils && pose) {
          drawingUtils.drawConnectors(
            ctx,
            results.poseLandmarks,
            pose.POSE_CONNECTIONS,
            { color: "#00FF00", lineWidth: 4 }
          );
          drawingUtils.drawLandmarks(ctx, results.poseLandmarks, {
            color: "#FF0000",
            lineWidth: 2,
            radius: 6,
          });
        }

        processRepCount(results.poseLandmarks);
      }
    },
    [processRepCount]
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
      if (isActive === false && cameraRef.current) {
        cameraRef.current.stop();
      }
      if (!isActive && poseRef.current) {
        poseRef.current.close();
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <Button
          variant="ghost"
          onClick={() => setLocation("/app")}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="bg-card/80 backdrop-blur-lg border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display">
              <span className="text-foreground">Posture </span>
              <span className="text-primary neon-text">TRACKING</span>
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Real-time posture and rep counting using AI
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-100">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Workout Type
              </label>
              <select
                value={workoutName}
                onChange={(e) => {
                  setWorkoutName(e.target.value);
                  setRepCount(0);
                  setFeedback("");
                }}
                disabled={isActive}
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              >
                {workoutOptions.map((workout) => (
                  <option key={workout} value={workout}>
                    {workout}
                  </option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading MediaPipe pose detection...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full bg-black rounded-lg overflow-hidden border border-primary/30">
                  <div className="relative aspect-video bg-black">
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover hidden"
                      playsInline
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center space-y-3">
                          <AlertCircle className="w-12 h-12 text-primary mx-auto" />
                          <p className="text-muted-foreground text-sm">
                            Click "Start Tracking" to begin
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Rep Count</p>
                    <p className="text-3xl font-bold text-primary">{repCount}</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Posture Status</p>
                    <div className="flex items-center gap-2">
                      {posture === "good" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : posture === "warning" ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="capitalize text-sm font-medium">
                        {posture === "neutral" ? "Neutral" : posture}
                      </span>
                    </div>
                  </div>
                </div>

                {feedback && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-100">{feedback}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setIsActive(!isActive);
                      if (!isActive) {
                        toast({
                          title: "Tracking Started",
                          description: `Started tracking ${workoutName}`,
                        });
                      }
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 neon-glow"
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Tracking
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => {
                      setRepCount(0);
                      setFeedback("");
                      setPosture("neutral");
                    }}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    Reset
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Ensure good lighting and camera visibility of your full body</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Keep the camera steady and at a good distance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Move slowly and deliberately for accurate tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Follow the posture feedback to maintain proper form</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
