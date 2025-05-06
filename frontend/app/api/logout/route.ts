// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the auth token cookie
    const cookieStore = cookies();
    cookieStore.delete("auth_token");
    
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}