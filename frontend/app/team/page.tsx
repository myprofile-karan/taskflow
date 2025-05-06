"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TaskEditForm } from "@/components/task/task-edit-form";
import { User, Task, Status, Notification } from "@/lib/types";
import { Mail, MoreHorizontal, Plus } from "lucide-react";
import { generateTasks, generateNotifications } from "@/lib/data";
import { useAuth } from "@/components/auth-provider";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

export default function TeamPage() {
  const { user: currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [selectedUser, setselectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<{ _id: string; name: string, email: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([]);


  // fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
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
  }, [currentUser]);

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

    // fetch user notifications
    useEffect(() => {
      const fetchNotifications = async () => {
        if (currentUser) {
          try {
            const response = await axios.get(`/api/notification/${currentUser?._id}`);
            setNotifications(response.data);
            console.log(response)
          } catch (error) {
            console.error("Failed to fetch notifications:", error);
          }
        }
      };
      fetchNotifications();
    }, [currentUser]);

    const handleCreateTask = async (newTask: Task) => {
      if (!selectedUser) return;
    
      try {
        const res = await axios.post("/api/tasks", {
          ...newTask,
          assignedTo: selectedUser?._id, // Use `_id` from MongoDB
        });
        const created = res.data;

        setTasks((prevTasks) => [...prevTasks, res.data]);
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
    
    const unreadNotifications = currentUser ? notifications?.filter(n => !n.read).length : 0;


  const getTasksForUser = (userId: string) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  const getPendingTasksCount = (userId: string) => {
    return tasks.filter(task => 
      task.assignedTo === userId && 
      task.status !== Status.COMPLETED
    ).length;
  };

  const openNewTaskDialog = (user: User) => {
    setselectedUser(user);
    setIsNewTaskDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader unreadNotifications={unreadNotifications} />
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Team Members</h1>
          </div>
          {isLoading ? <Spinner /> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user?._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        {/* <AvatarImage src={user?.image} /> */}
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openNewTaskDialog(user)}>
                          Assign Task
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <Badge variant="outline" className="mr-1">
                        {getTasksForUser(user?._id).length} Tasks
                      </Badge>
                      {getPendingTasksCount(user?._id) > 0 && (
                        <Badge variant="secondary">
                          {getPendingTasksCount(user?._id)} Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() =>{ openNewTaskDialog(user); console.log("user", user)}}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Assign Task
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          }
        </div>
      </main>

      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? `Assign Task to ${selectedUser.name}` : "Create Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskEditForm 
            onSubmit={handleCreateTask} 
            task={selectedUser}
            type="edit"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}