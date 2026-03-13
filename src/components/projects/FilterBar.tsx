import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProjectFilters {
  search?: string;
  duration?: string;
  workType?: string;
  techStack?: string;
}

interface FilterBarProps {
  filters?: ProjectFilters;
  onFilterChange?: (filters: ProjectFilters) => void;
}

export const FilterBar = ({ filters = {}, onFilterChange }: FilterBarProps) => {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  const updateFilter = (key: keyof ProjectFilters, value: string | undefined) => {
    const next = { ...filters, [key]: value || undefined };
    onFilterChange?.(next);
  };

  const handleSearch = () => {
    updateFilter("search", searchInput.trim() || undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          />
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={handleSearch}>
          Search
        </Button>

        <Select value={filters.duration ?? "all"} onValueChange={(v) => updateFilter("duration", v)}>
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

        <Select value={filters.workType ?? "all"} onValueChange={(v) => updateFilter("workType", v)}>
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
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Popular:</span>
        {["React", "Node.js", "Python", "UI/UX", "Full-stack"].map((skill) => (
          <Badge
            key={skill}
            variant={filters.techStack === skill ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => updateFilter("techStack", filters.techStack === skill ? undefined : skill)}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};
