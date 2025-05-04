
// app/api/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        await connectDB();
        console.log("name", name)

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const savedUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "User registered successfully", user: { name: savedUser.name, email: savedUser.email } });
    } catch (err) {
        console.error("Registration error:", err); // Add this
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
