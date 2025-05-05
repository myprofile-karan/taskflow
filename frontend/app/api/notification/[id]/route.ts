import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const notification = await Notification.find({userId: params.id});
      console.log("notification" ,notification)
      if (!notification) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(notification);
    } catch (error) {
      console.error("Failed to fetch notification:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }