import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { ProjectPostForm } from "@/components/projects/ProjectPostForm";
import { ProjectCard, type Project } from "@/components/projects/ProjectCard";
import { FilterBar } from "@/components/projects/FilterBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{ search?: string; duration?: string; workType?: string; techStack?: string }>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { projects: fetchedProjects } = await api.getProjects({
          search: filters.search || undefined,
          duration: filters.duration === "all" ? undefined : filters.duration,
          workType: filters.workType === "all" ? undefined : filters.workType,
          techStack: filters.techStack || undefined,
        });
        const transformedProjects = fetchedProjects.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          deadline: new Date(p.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          duration: p.duration === 'short' ? 'Short (1-4 weeks)' : p.duration === 'medium' ? 'Medium (1-3 months)' : 'Long (3+ months)',
          workType: p.workType.map((wt: string) => wt.charAt(0).toUpperCase() + wt.slice(1)),
          techStack: p.techStack || [],
          budget: p.budget,
        }));
        setProjects(transformedProjects);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [filters.search, filters.duration, filters.workType, filters.techStack, refreshKey]);

  const handleApply = async (projectId: string) => {
    try {
      await api.applyToProject(projectId);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes("token") || error?.message?.toLowerCase().includes("authenticated") || error?.message?.toLowerCase().includes("unauthorized")) {
        toast.error("Please sign in to apply");
        window.location.href = "/login";
      } else {
        toast.error(error.message || "Failed to submit application");
      }
    }
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
            <FilterBar filters={filters} onFilterChange={setFilters} />
            
            {isLoading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No projects found</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onApply={handleApply}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="post">
            <div className="max-w-2xl mx-auto">
              {user ? (
                <ProjectPostForm onSuccess={() => setRefreshKey((k) => k + 1)} />
              ) : (
                <div className="rounded-lg border bg-card p-8 text-center">
                  <p className="text-muted-foreground mb-4">Sign in to post a project and find freelancers.</p>
                  <Link to="/login">
                    <Button variant="gradient">Sign in</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Home;
