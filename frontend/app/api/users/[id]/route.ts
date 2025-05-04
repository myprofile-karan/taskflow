import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const task = await User.findById(params.id);
      if (!task) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(task);
    } catch (error) {
      console.error("Failed to fetch task:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }