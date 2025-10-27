import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  onFilterChange?: (filters: any) => void;
}

export const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
          />
        </div>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Durations</SelectItem>
            <SelectItem value="short">Short (1-4 weeks)</SelectItem>
            <SelectItem value="medium">Medium (1-3 months)</SelectItem>
            <SelectItem value="long">Long (3+ months)</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Work Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Popular:</span>
        {["React", "Node.js", "Python", "UI/UX", "Full-stack"].map((skill) => (
          <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-primary/10">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};
