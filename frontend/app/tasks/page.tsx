"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TaskCard } from "@/components/task/task-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TaskEditForm } from "@/components/task/task-edit-form";
import { TaskFilters } from "@/components/task/task-filters";
import { Task, Status, Priority, TaskFilter, User } from "@/lib/types";
import { CheckCircle, Plus, Filter } from "lucide-react";
import { generateTasks, generateNotifications } from "@/lib/data";
import { useAuth } from "@/components/auth-provider";
import { isPast, parseISO, startOfToday, endOfDay, addDays } from "date-fns";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export default function TasksPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TaskFilter>({
    search: "",
    status: null,
    priority: null,
    dueDate: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const filteredTasks  = tasks.filter(task=> task.assignedTo === user?._id)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/users");
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);
  
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const res = await axios.get("/api/tasks");
      setTasks(res.data);
    };
    fetchTasks();
  }, [user]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search }));
  }, [search]);

  
  // const handleCreateTask = async (newTask: Task) => {
  //   try {
  //     const res = await axios.post("/api/tasks", {
  //       ...newTask,
  //       assignedTo: selectedUser?._id, // Use `_id` from MongoDB
  //     });
  //     const created = res.data;

  //     setTasks((prevTasks) => [...prevTasks, res.data]);
  //     setIsNewTaskDialogOpen(false);
  //     toast({
  //       title: "Task Created",
  //       description: `"${created.title}" has been added successfully.`,
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Failed to Create Task",
  //       description: "Something went wrong while creating the task.",
  //       variant: "destructive",
  //     });
  //     console.error("Failed to create task:", error);
  //   }
  // };

  const handleUpdateTask = async (updatedData: Record<string, any>) => {
    console.log(updatedData)
  try {
    const res = await axios.put(`/api/tasks/${updatedData._id}`, updatedData);
    if (res.status !== 200) {
      throw new Error(res.data.error || "Failed to update task");
    }
    toast({
      title: "Task Updated",
      description: `Task has been updated successfully.`,
    });
    return res.data;
  } catch (err: any) {
    toast({
      title: "Failed to Update Task",
      description: "Something went wrong while updating the task.",
      variant: "destructive",
    });  
    return null;
  }
};

  const handleDelete = async (taskId: string) => {
    try {
      const res = await axios.delete(`/api/tasks/${taskId}`);
      console.log("response", res)
      const created = "Fsdfs";

      toast({
        title: "Task Deleted",
        description: `"${created}" has been added successfully.`,
      });    
        return true;
    } catch (err: any) {
      toast({
        title: "Failed to Delete Task",
        description: "Something went wrong while deleting the task.",
        variant: "destructive",
      });    
        return false;
    }
  };

  const handleStatusChange = (id: string, status: Status) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const unreadNotifications = user ? generateNotifications(user?._id).filter(n => !n.read).length : 0;

  // Apply filters

  // const filteredTasks = tasks.filter((task) => {
  //   // Search filter
  //   if (
  //     filters.search &&
  //     !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
  //     !task.description.toLowerCase().includes(filters.search.toLowerCase())
  //   ) {
  //     return false;
  //   }

  //   // Status filter
  //   if (filters.status && task.status !== filters.status) {
  //     return false;
  //   }

  //   // Priority filter
  //   if (filters.priority && task.priority !== filters.priority) {
  //     return false;
  //   }

  //   // Due date filter
  //   if (filters.dueDate) {
  //     const dueDate = parseISO(task.dueDate);
  //     const today = startOfToday();
      
  //     switch (filters.dueDate) {
  //       case "today":
  //         if (!(dueDate >= today && dueDate <= endOfDay(today))) {
  //           return false;
  //         }
  //         break;
  //       case "week":
  //         if (!(dueDate > today && dueDate <= addDays(today, 7))) {
  //           return false;
  //         }
  //         break;
  //       case "overdue":
  //         if (!(isPast(dueDate) && task.status !== Status.COMPLETED)) {
  //           return false;
  //         }
  //         break;
  //     }
  //   }

  //   return true;
  // });
  

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader 
        search={search}
        setSearch={setSearch}
        unreadNotifications={unreadNotifications}
      />
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Tasks</h1>
            {/* <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="gap-1"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-1 h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                  </DialogHeader>
                  <TaskEditForm onSubmit={handleCreateTask} type="add" />
                </DialogContent>
              </Dialog>
            </div> */}
          </div>

          {showFilters && (
            <div className="mb-6">
              <TaskFilters filters={filters} setFilters={setFilters} />
            </div>
          )}

          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 mb-4 text-muted" />
                  <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filters.search || filters.status || filters.priority || filters.dueDate
                      ? "Try adjusting your filters to see more tasks."
                      : "You don't have any tasks yet. Create a new task to get started."}
                  </p>
                  <Button onClick={() => setIsNewTaskDialogOpen(true)}>
                    <Plus className="mr-1 h-4 w-4" />
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  users={users}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onUpdate={handleUpdateTask}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}