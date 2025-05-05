// frontend/components/NotificationHandler.tsx
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "./use-toast";

let socket: any;

export const NotificationHandler = ({ userId }: { userId: string }) => {
  useEffect(() => {
    socket = io("https://taskflow-backend-socket.onrender.com/");

    socket.on("connect", () => {
      console.log("🔗 Connected to WebSocket");
      socket.emit("register", userId);
    });

    socket.on("newNotification", (message: string) => {
      toast({
        title: "Task Assigned",
        description: message,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return null; // no UI
};

export default NotificationHandler;
