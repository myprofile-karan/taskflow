import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";
import { Task } from "@/models/Tasks";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

// GET all tasks
export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE a task
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    console.log("data", data)
    const task = await Task.create(data);

    const createdUser = await User.findById(task.createdBy);
    console.log("createdUser---", createdUser);

    Notification.create({
      userId: task.assignedTo,
      taskId: task._id,
      message: `${createdUser?.name} assigned you a new task: ${task?.title}`,
      read: false,
    })   

    // 🔔 Notify the user via WebSocket server HTTP endpoint
    try {
      await fetch("https://taskflow-backend-socket.onrender.com/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toUserId: task?.assignedTo,
          message: `${createdUser?.name} assigned you a new task: ${task?.title}`,
        }),
      });
    } catch (error) {
      console.error("Failed to notify user:", error);
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 400 }
    );
  }
}
