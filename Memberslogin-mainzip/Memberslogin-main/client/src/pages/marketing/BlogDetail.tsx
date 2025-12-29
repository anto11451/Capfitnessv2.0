import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Loader2 } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

export default function BlogDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/blog/:id");
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbxIPA6NY5sx6bYco5LjpjDJ9RspDys-yXESJ851AUAPcnKQBtmihkJiGMGDVaMKOaC8GQ/exec"
        );
        const data = await res.json();

        const found = data.find(
          (p: any) => String(p.id) === String(params?.id)
        );

        setPost(found);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
      setLoading(false);
    }

    if (params?.id) {
      fetchPost();
    }
  }, [params?.id]);

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

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!post) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => setLocation("/blog")}
            className="neon-glow bg-primary hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation("/blog")}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border border-primary/30 neon-border overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            
            <CardHeader className="relative space-y-4">
              {post.category && (
                <Badge 
                  variant="outline"
                  className={`w-fit ${getCategoryColor(post.category)}`}
                >
                  {post.category}
                </Badge>
              )}
              <CardTitle className="text-3xl md:text-4xl font-display font-bold">
                {post.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-6">
              {post.image && (
                <motion.img
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded-xl object-cover border border-border/50"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}

              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-line text-foreground/90">
                  {post.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-muted-foreground mb-4">
            Ready to start your fitness journey?
          </p>
          <Button 
            onClick={() => setLocation("/intake")}
            className="neon-glow bg-primary hover:bg-primary/90"
          >
            Start Your Assessment
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
