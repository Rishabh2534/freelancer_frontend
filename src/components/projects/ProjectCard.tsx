import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Zap } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
  duration: string;
  workType: string[];
  techStack: { name: string; proficiency: number }[];
  budget?: string;
}

interface ProjectCardProps {
  project: Project;
  onApply?: (projectId: string) => void;
}

export const ProjectCard = ({ project, onApply }: ProjectCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 animate-fade-in">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>
          {project.budget && (
            <Badge variant="accent" className="shrink-0">
              {project.budget}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{project.deadline}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{project.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{project.workType.join(", ")}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Required Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <Badge key={idx} variant="skill" className="gap-1">
                {tech.name}
                <span className="text-[10px] opacity-70">{tech.proficiency}%</span>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onApply?.(project.id)}
          variant="gradient"
          className="w-full"
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};
