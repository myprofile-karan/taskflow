// app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        message: "No authentication token found" 
      }, { status: 401 });
    }
    
    try {
      // Verify the token
      const decodedToken: any = verifyToken(token);
      
      // Get fresh user data from database
      await connectDB();
      const user = await User.findById(decodedToken.id);
      
      if (!user) {
        return NextResponse.json({ 
          authenticated: false,
          message: "User not found" 
        }, { status: 401 });
      }
      
      // Return authenticated status and user data
      return NextResponse.json({
        authenticated: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`
        }
      });
    } catch (error) {
      // Token verification failed
      console.error("Token verification failed:", error);
      return NextResponse.json({ 
        authenticated: false,
        message: "Invalid or expired token" 
      }, { status: 401 });
    }
  } catch (err) {
    console.error("Auth verify error:", err);
    return NextResponse.json({ 
      error: "Internal Server Error" 
    }, { status: 500 });
  }
}