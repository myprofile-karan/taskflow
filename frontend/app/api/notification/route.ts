// app/api/notifications/mark-all-read/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/models/Notification'; // Adjust import path as needed

export async function PUT(req: Request) {
    try {
        await connectDB();
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }
        const result = await Notification.updateMany(
            { 
                userId: userId,
                read: false // Only update unread notifications
            },
            { 
                read: true 
            }
        );
        return NextResponse.json(
            { 
                success: true,
                message: "All notifications marked as read",
                updatedCount: result.modifiedCount
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}