import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = generateToken({ id: user?._id, email: user.email });
    
    // Set the token in an HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
    });
    
    return NextResponse.json({
      user: {
        _id: user?._id,
        name: user.name,
        email: user.email,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}