import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProjectPostForm } from "@/components/projects/ProjectPostForm";
import { ProjectCard, type Project } from "@/components/projects/ProjectCard";
import { FilterBar } from "@/components/projects/FilterBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Build a Modern E-commerce Dashboard",
    description: "Looking for an experienced React developer to create a responsive admin dashboard with real-time analytics and inventory management.",
    deadline: "Jan 15, 2025",
    duration: "Medium (1-3 months)",
    workType: ["Remote"],
    techStack: [
      { name: "React", proficiency: 90 },
      { name: "TypeScript", proficiency: 85 },
      { name: "Tailwind", proficiency: 80 },
    ],
    budget: "$3,000-$5,000",
  },
  {
    id: "2",
    title: "Mobile App UI/UX Design",
    description: "Need a creative designer to design a fitness tracking mobile app with modern, engaging user interface and smooth user experience.",
    deadline: "Dec 30, 2024",
    duration: "Short (1-4 weeks)",
    workType: ["Remote", "Hybrid"],
    techStack: [
      { name: "Figma", proficiency: 95 },
      { name: "Adobe XD", proficiency: 80 },
      { name: "Prototyping", proficiency: 85 },
    ],
    budget: "$1,500-$2,500",
  },
  {
    id: "3",
    title: "Backend API Development",
    description: "Seeking a Node.js expert to build scalable REST APIs with authentication, database integration, and comprehensive documentation.",
    deadline: "Feb 1, 2025",
    duration: "Medium (1-3 months)",
    workType: ["Remote"],
    techStack: [
      { name: "Node.js", proficiency: 90 },
      { name: "MongoDB", proficiency: 85 },
      { name: "Docker", proficiency: 75 },
    ],
    budget: "$4,000-$6,000",
  },
  {
    id: "4",
    title: "AI Chatbot Integration",
    description: "Integrate an AI-powered chatbot into our customer service platform with natural language processing capabilities.",
    deadline: "Jan 20, 2025",
    duration: "Short (1-4 weeks)",
    workType: ["Remote"],
    techStack: [
      { name: "Python", proficiency: 85 },
      { name: "OpenAI", proficiency: 80 },
      { name: "FastAPI", proficiency: 75 },
    ],
    budget: "$2,000-$3,500",
  },
  {
    id: "5",
    title: "Full-stack SaaS Platform",
    description: "Build a comprehensive SaaS platform from scratch with subscription management, user authentication, and analytics dashboard.",
    deadline: "Mar 15, 2025",
    duration: "Long (3+ months)",
    workType: ["Remote", "Hybrid"],
    techStack: [
      { name: "React", proficiency: 90 },
      { name: "Node.js", proficiency: 90 },
      { name: "PostgreSQL", proficiency: 85 },
      { name: "Stripe", proficiency: 75 },
    ],
    budget: "$10,000-$15,000",
  },
  {
    id: "6",
    title: "Data Visualization Dashboard",
    description: "Create interactive data visualization dashboard with charts, graphs, and real-time data updates for business intelligence.",
    deadline: "Jan 10, 2025",
    duration: "Medium (1-3 months)",
    workType: ["Remote"],
    techStack: [
      { name: "D3.js", proficiency: 85 },
      { name: "React", proficiency: 80 },
      { name: "Python", proficiency: 75 },
    ],
    budget: "$3,500-$5,500",
  },
];

const Home = () => {
  const handleApply = (projectId: string) => {
    toast.success("Application submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center space-y-3 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Welcome to FreelanceAI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with opportunities, grow your skills, and build your career with AI-powered insights
          </p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="browse">Browse Projects</TabsTrigger>
            <TabsTrigger value="post">Post Project</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <FilterBar />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onApply={handleApply}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="post">
            <div className="max-w-2xl mx-auto">
              <ProjectPostForm />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Home;
