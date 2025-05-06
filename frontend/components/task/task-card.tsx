"use client";

import { useState } from "react";
import { formatDistanceToNow, isPast, parseISO } from "date-fns";
import { User,Task, Priority, Status } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskEditForm } from "@/components/task/task-edit-form";
import {formatDateAndTime} from "@/lib/utils"

interface TaskCardProps {
  task: Task;
  users?: User[];
  onStatusChange?: (id: string, status: Status) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (task: Task) => void;
}

export function TaskCard({  task, users, onStatusChange, onDelete, onUpdate }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const assignedUser = users?.find((u: any) => u._id === task?.assignedTo);
  const createdByUser = users?.find((u:any) => u._id === task?.createdBy);
  
  const dueDate = task.dueDate ? parseISO(task.dueDate) : new Date();
  const isOverdue = isPast(dueDate) && task.status !== Status.COMPLETED;
  
  const handleStatusToggle = () => {
    if (!onStatusChange) return;
    
    const newStatus = task.status === Status.COMPLETED 
      ? Status.TODO 
      : Status.COMPLETED;
      
    onStatusChange(task._id, newStatus);
  };



  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isOverdue && task.status !== Status.COMPLETED && "border-destructive border-l-4"
    )}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-2">
            <div className="mt-1">
              <Checkbox 
                checked={task.status === Status.COMPLETED}
                onCheckedChange={handleStatusToggle}
              />
            </div>
            <div className={cn(
              task.status === Status.COMPLETED && "line-through text-muted-foreground"
            )}>
              <h3 className="font-semibold text-base">{task.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge 
                  variant={task.status === Status.COMPLETED ? "outline" : "secondary"}
                  className="font-normal"
                >
                  {task.status === Status.TODO ? "To Do" : 
                    task.status === Status.IN_PROGRESS ? "In Progress" : "Completed"}
                </Badge>
                
                <Badge 
                  variant={
                    task.priority === Priority.HIGH 
                      ? "destructive" 
                      : task.priority === Priority.MEDIUM 
                        ? "default"
                        : "outline"
                  }
                  className="font-normal"
                >
                  {task.priority === Priority.HIGH ? "High" : 
                    task.priority === Priority.MEDIUM ? "Medium" : "Low"}
                </Badge>
                
                <Badge 
                  variant={isOverdue ? "destructive" : "outline"} 
                  className={cn("font-normal", 
                    isOverdue && "bg-destructive/10 text-destructive hover:bg-destructive/20",
                    task.status === Status.COMPLETED && "bg-muted hover:bg-muted text-muted-foreground"
                  )}
                >
                  {isOverdue && task.status !== Status.COMPLETED 
                    ? `Overdue: ${formatDistanceToNow(dueDate, { addSuffix: true })}` 
                    : formatDistanceToNow(dueDate, { addSuffix: true })}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 pb-3 px-4">
          <p className="text-sm text-muted-foreground mb-3">
            {task.description}
          </p>
          <div className="flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Assigned to:</span>
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={assignedUser?.image} />
                  <AvatarFallback className="text-[10px]">
                    {assignedUser?.name?.substring(0, 1).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span>{assignedUser?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Created by:</span>
              <div className="flex items-center gap-1">
                {createdByUser && (
                  <Avatar className="h-5 w-5">
                  {/* <AvatarImage src={createdByUser?.image} /> */}
                  <AvatarFallback className="text-[10px]">
                    {createdByUser?.name?.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                )}
                <span>{createdByUser?.email} ({createdByUser?.name || "N/A"})</span>
              </div>
            </div>
          </div>
 
          <div className="text-xs text-muted-foreground mt-2">
            <span>Assigned on: </span>
            <span>{formatDateAndTime(task?.createdAt)}</span>
          </div>

        </CardContent>
      )}
      
      <CardFooter className="flex justify-between px-4 pt-0 pb-3">
        {isExpanded && (
          <div className="flex gap-2">
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(task._id)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
            
            {onUpdate && (
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <TaskEditForm 
                    task={task} 
                    onSubmit={(updatedTask) => {
                      onUpdate(updatedTask);
                      setIsEditDialogOpen(false);
                    }}
                    type="edit"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}