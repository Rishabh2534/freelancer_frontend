import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/services/api";

interface ProjectPostFormProps {
  onSuccess?: () => void;
}

export const ProjectPostForm = ({ onSuccess }: ProjectPostFormProps) => {
  const [date, setDate] = useState<Date>();
  const [techStack, setTechStack] = useState<{ name: string; proficiency: number }[]>([]);
  const [currentTech, setCurrentTech] = useState("");
  const [currentProficiency, setCurrentProficiency] = useState(50);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTech = () => {
    if (currentTech.trim()) {
      setTechStack([...techStack, { name: currentTech, proficiency: currentProficiency }]);
      setCurrentTech("");
      setCurrentProficiency(50);
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const toggleWorkType = (type: string) => {
    setWorkTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !duration || workTypes.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await api.createProject({
        title,
        description,
        deadline: date.toISOString(),
        duration: duration,
        workType: workTypes.map(wt => wt.toLowerCase()),
        budget: budget || undefined,
        techStack,
      });
      
      toast.success("Project posted successfully!");
      setTitle("");
      setDescription("");
      setDate(undefined);
      setDuration("");
      setWorkTypes([]);
      setBudget("");
      setTechStack([]);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to post project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Post a Project</CardTitle>
        <CardDescription>Fill in the details to find the perfect freelancer</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
              id="title" 
              placeholder="e.g., Build a React Dashboard" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project requirements in detail..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Expected Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (1-4 weeks)</SelectItem>
                  <SelectItem value="medium">Medium (1-3 months)</SelectItem>
                  <SelectItem value="long">Long (3+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Work Type</Label>
            <div className="flex flex-wrap gap-4">
              {["Remote", "On-site", "Hybrid"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={workTypes.includes(type)}
                    onCheckedChange={() => toggleWorkType(type)}
                  />
                  <label htmlFor={type} className="text-sm cursor-pointer">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tech Stack Required</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., React"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
              />
              <Input
                type="number"
                min="0"
                max="100"
                value={currentProficiency}
                onChange={(e) => setCurrentProficiency(Number(e.target.value))}
                className="w-24"
                placeholder="%"
              />
              <Button type="button" onClick={handleAddTech} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((tech, idx) => (
                <Badge key={idx} variant="skill" className="gap-2">
                  {tech.name} ({tech.proficiency}%)
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(idx)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (Optional)</Label>
            <Input 
              id="budget" 
              placeholder="e.g., $3,000-$5,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" variant="gradient" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
