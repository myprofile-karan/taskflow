"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Notification, Task } from "@/lib/types";
import { users, generateTasks, generateNotifications } from "@/lib/data";
import { CheckCircle, BellOff } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import axios from "axios";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/notification/${user?._id}`);
          setNotifications(response.data);
          console.log(response)
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task._id === id);
  };

  const getUserById = (id: string) => {
    return users.find((user) => user?._id === id);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader 
        unreadNotifications={notifications.filter(n => !n.read).length}
      />
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {notifications.some((notification) => !notification.read) && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <BellOff className="h-12 w-12 text-muted mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You don&apos;t have any notifications yet.
                </p>
              </div>
            ) : (
              notifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((notification) => {
                  const task = getTaskById(notification.taskId);
                  const creator = task ? getUserById(task.createdBy) : null;
                  
                  return (
                    <div key={notification._id}>
                      <div className={`flex items-start gap-4 py-4 px-2 ${notification.read ? "" : "bg-muted/30"}`}>
                        <div className="flex-shrink-0 mt-1">
                          {notification.read ? (
                            <div className="h-2 w-2 rounded-full" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p>{notification.message}</p>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}
                            {creator && (
                              <span> • From {creator.name}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          {task && (
                            <Link href="/tasks">
                              <Button variant="outline" size="sm">
                                View Task
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}