import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, Sparkles, ChevronDown, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  topics: string[];
  completed: boolean;
  progress: number;
}

const AIRoadmap = () => {
  const [skill, setSkill] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapModule[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRoadmap = () => {
    if (!skill.trim()) {
      toast.error("Please enter a skill to generate roadmap");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setRoadmap([
        {
          id: "1",
          title: "Fundamentals",
          description: "Master the core concepts and basics",
          topics: ["Introduction to " + skill, "Basic Syntax", "Core Principles", "Best Practices"],
          completed: true,
          progress: 100,
        },
        {
          id: "2",
          title: "Intermediate Concepts",
          description: "Build on fundamentals with advanced topics",
          topics: ["Advanced Patterns", "State Management", "Performance Optimization", "Testing"],
          completed: false,
          progress: 60,
        },
        {
          id: "3",
          title: "Advanced Techniques",
          description: "Master expert-level concepts",
          topics: ["Architecture Design", "Scalability", "Security", "Production Deployment"],
          completed: false,
          progress: 30,
        },
        {
          id: "4",
          title: "Career Paths",
          description: "Explore career opportunities",
          topics: ["Senior Developer", "Technical Lead", "Solution Architect", "Consultant"],
          completed: false,
          progress: 0,
        },
      ]);
      setIsGenerating(false);
      toast.success("Roadmap generated successfully!");
    }, 2000);
  };

  const toggleModuleComplete = (moduleId: string) => {
    setRoadmap(prev =>
      prev?.map(module =>
        module.id === moduleId
          ? { ...module, completed: !module.completed, progress: module.completed ? 0 : 100 }
          : module
      ) || null
    );
  };

  const overallProgress = roadmap
    ? Math.round(roadmap.reduce((acc, m) => acc + m.progress, 0) / roadmap.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-primary">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AI Roadmap Explorer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a personalized learning roadmap powered by AI. Enter any skill and discover the path to mastery.
            </p>
          </div>

          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate Your Roadmap
              </CardTitle>
              <CardDescription>Enter a skill to get started with AI-powered learning path</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., React, Data Science, Machine Learning..."
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && generateRoadmap()}
                  className="flex-1"
                />
                <Button
                  onClick={generateRoadmap}
                  variant="gradient"
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {roadmap && (
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
              )}
            </CardContent>
          </Card>

          {roadmap && (
            <div className="space-y-4 animate-fade-in">
              {roadmap.map((module, idx) => (
                <Collapsible key={module.id} defaultOpen={idx === 0}>
                  <Card className="border-border hover:shadow-lg transition-all duration-300">
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex items-start gap-3 text-left">
                          <div className="mt-1">
                            {module.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-success" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                            <CardDescription className="mt-1">{module.description}</CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                              <Progress value={module.progress} className="h-2 w-32" />
                              <span className="text-xs text-muted-foreground">{module.progress}%</span>
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200" />
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Topics to Master:</p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {module.topics.map((topic, topicIdx) => (
                              <Badge key={topicIdx} variant="skill" className="justify-start">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => toggleModuleComplete(module.id)}
                          variant={module.completed ? "outline" : "default"}
                          size="sm"
                          className="w-full"
                        >
                          {module.completed ? "Mark as Incomplete" : "Mark as Complete"}
                        </Button>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          )}

          {roadmap && (
            <Card className="bg-gradient-card border-primary/20 shadow-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Career Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your {skill} skills, here are some career paths you might excel in:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-3 rounded-lg border bg-background/50">
                    <p className="font-medium mb-1">{skill} Developer</p>
                    <p className="text-xs text-muted-foreground">Build applications using {skill}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-background/50">
                    <p className="font-medium mb-1">Technical Consultant</p>
                    <p className="text-xs text-muted-foreground">Advise companies on {skill} solutions</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-background/50">
                    <p className="font-medium mb-1">Solution Architect</p>
                    <p className="text-xs text-muted-foreground">Design scalable {skill} systems</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-background/50">
                    <p className="font-medium mb-1">Technical Lead</p>
                    <p className="text-xs text-muted-foreground">Lead {skill} development teams</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIRoadmap;
