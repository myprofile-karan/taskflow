"use client";

import { TaskFilter, Priority, Status } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface TaskFiltersProps {
  filters: TaskFilter;
  setFilters: (filters: TaskFilter) => void;
}

export function TaskFilters({ filters, setFilters }: TaskFiltersProps) {
  const handleStatusChange = (value: string | undefined) => {
    setFilters({
      ...filters,
      status: value === "all" ? null : (value as Status | null),
    });
  };

  const handlePriorityChange = (value: string | undefined) => {
    setFilters({
      ...filters,
      priority: value === "all" ? null : (value as Priority | null),
    });
  };

  const handleDueDateChange = (value: string | undefined) => {
    setFilters({
      ...filters,
      dueDate: value === "all" ? null : (value as 'today' | 'week' | 'overdue' | null),
    });
  };

  const clearFilters = () => {
    setFilters({
      search: filters.search,
      status: null,
      priority: null,
      dueDate: null,
    });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.dueDate;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value={Status.TODO}>To Do</SelectItem>
              <SelectItem value={Status.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={Status.COMPLETED}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={filters.priority || "all"}
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any priority</SelectItem>
              <SelectItem value={Priority.LOW}>Low</SelectItem>
              <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
              <SelectItem value={Priority.HIGH}>High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Due Date</Label>
          <Select
            value={filters.dueDate || "all"}
            onValueChange={handleDueDateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any time</SelectItem>
              <SelectItem value="today">Due today</SelectItem>
              <SelectItem value="week">Due this week</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}