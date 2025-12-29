import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Settings, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";

const GOOGLE_API_URL =
  "https://script.google.com/macros/s/AKfycbxIPA6NY5sx6bYco5LjpjDJ9RspDys-yXESJ851AUAPcnKQBtmihkJiGMGDVaMKOaC8GQ/exec";

export default function Blog() {
  const [, setLocation] = useLocation();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      const res = await fetch(GOOGLE_API_URL);
      const data = await res.json();

      const sorted = data.sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPosts(sorted);
    } catch (error) {
      console.error("Failed to load blogs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Fitness Tips": "bg-primary/20 text-primary border-primary/30",
      "Nutrition": "bg-green-500/20 text-green-400 border-green-500/30",
      "Workouts": "bg-accent/20 text-accent border-accent/30",
      "Motivation": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Fat Loss": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    };
    return colors[category] || "bg-muted text-muted-foreground border-muted";
  };

  return (
    <PageWrapper>
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="mb-8 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Fitness <span className="text-primary neon-text">Blog</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tips, workouts, and inspiration from our coaches to help you on your fitness journey
            </p>
          </motion.div>

          <motion.div 
            className="flex justify-end mb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => setLocation("/admin")}
              variant="outline"
              className="hover:bg-primary/10 hover:border-primary/50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          </motion.div>

          {loading && (
            <motion.div 
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading posts...</p>
            </motion.div>
          )}

          {!loading && posts.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">
                No blog posts yet. Check back soon!
              </p>
            </motion.div>
          )}

          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => setLocation(`/blog/${post.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className={getCategoryColor(post.category)}
                      >
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.content}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-primary" />
                        <span>{post.author}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-accent" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
