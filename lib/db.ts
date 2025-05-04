import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

export async function connectDB(): Promise<void> {
    
    // check if connection already there
    if (connection.isConnected) {
        console.log("Already connected to DB")
        return
    }

    // connect if there is no connection 
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState
        console.log("DB connect successfully");
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1);
    }
}
