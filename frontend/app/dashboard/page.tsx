"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TaskCard } from "@/components/task/task-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Priority, Status, Task, User } from "@/lib/types";
import { Calendar, CheckCircle, Clock, Plus, AlertCircle } from "lucide-react";
import { generateTasks, generateNotifications } from "@/lib/data";
import { TaskEditForm } from "@/components/task/task-edit-form";
import { useAuth } from "@/components/auth-provider";
import { format, isPast, parseISO, startOfToday, endOfToday, addDays } from "date-fns";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { NotificationHandler } from "@/hooks/notify";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const { user } = useAuth();
  // console.log("user-----", user)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const res = await axios.get("/api/tasks");
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  // fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const { data } = await axios.get("/api/users");
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }finally{
        setIsLoading(false)
      }
    };
    fetchUsers();
  }, []);
  

  const handleCreateTask = async (newTask: Task) => {
    try {
      const res = await axios.post("/api/tasks", newTask);
      const created = res.data;
      setTasks((prev) => [...prev, created]);
      setIsNewTaskDialogOpen(false);
      toast({
        title: "Task Created",
        description: `"${created.title}" has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Create Task",
        description: "Something went wrong while creating the task.",
        variant: "destructive",
      });
      console.error("Failed to create task:", error);
    }
  };
  
  const handleUpdateTask = async (updatedData: Record<string, any>) => {
    try {
      setIsLoading(true)
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
    }finally{
      setIsLoading(false)
    }
  };

  

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      const updatedAt = new Date().toISOString();
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, updatedAt }),
      });
      if (!res.ok) {
        throw new Error('Failed to update task status');
      }
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };
  

  const unreadNotifications = user ? generateNotifications(user?._id).filter(n => !n.read).length : 0;

  // Filter tasks for different sections
  const todayTasks = tasks?.filter((task) => {
    if (!task?.dueDate) return false;
    try {
      const dueDate = parseISO(task.dueDate);
      return dueDate >= startOfToday() && dueDate <= endOfToday();
    } catch {
      return false;
    }
  });
  

  const upcomingTasks = tasks.filter((task) => {
    if (!task?.dueDate) return false;
    const dueDate = parseISO(task.dueDate);
    return dueDate > endOfToday() && dueDate <= addDays(new Date(), 7) && task.status !== Status.COMPLETED;
  });
  
  const overdueTasks = tasks.filter((task) => {
    if (!task?.dueDate) return false;
    const dueDate = parseISO(task.dueDate);
    return isPast(dueDate) && task.status !== Status.COMPLETED;
  });
  

  // Task summary stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === Status.COMPLETED).length;
  const inProgressTasks = tasks.filter(task => task.status === Status.IN_PROGRESS).length;

  return (
    <div className="flex min-h-screen flex-col">
      {user?._id && <NotificationHandler userId={user?._id} />}

      <DashboardHeader 
        search={search}
        setSearch={setSearch}
        unreadNotifications={unreadNotifications}
      />

      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
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
                <TaskEditForm onSubmit={handleCreateTask} type="add" isLoading={isLoading} />
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? <Spinner /> : (
            <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Tasks</CardTitle>
                <CardDescription>All assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalTasks}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {completedTasks} completed
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">In Progress</CardTitle>
                <CardDescription>Tasks currently being worked on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{inProgressTasks}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((inProgressTasks / totalTasks) * 100) || 0}% of total tasks
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Overdue</CardTitle>
                <CardDescription>Tasks past their due date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{overdueTasks.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {overdueTasks.length > 0 ? "Action required" : "Everything is on schedule"}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Due Today
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/tasks" >View all</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {todayTasks.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      <CheckCircle className="mx-auto h-12 w-12 mb-4 text-muted" />
                      <p>No tasks due today.</p>
                    </CardContent>
                  </Card>
                ) : ( 
                    todayTasks.map((task) => (
                      <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onUpdate={handleUpdateTask}
                      />
                    ))
                  )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Tasks
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/tasks">View all</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingTasks.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      <CheckCircle className="mx-auto h-12 w-12 mb-4 text-muted" />
                      <p>No upcoming tasks this week.</p>
                    </CardContent>
                  </Card>
                ) : (
                  isLoading ? <Spinner /> :
                  upcomingTasks.slice(0, 3).map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onUpdate={handleUpdateTask}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {overdueTasks.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center text-destructive">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Overdue Tasks
                </h2>
              </div>
              <div className="space-y-4">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    users={users}
                    onStatusChange={handleStatusChange}
                    onUpdate={handleUpdateTask}
                  />
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}