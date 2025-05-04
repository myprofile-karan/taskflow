// backend/notify.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const connectedUsers = new Map();

// Handle WebSocket connection
io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`📌 User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of connectedUsers.entries()) {
      if (id === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log("❌ Disconnected:", socket.id);
  });
});

// HTTP endpoint to send a notification to a user
app.post("/notify", (req, res) => {
  const {  toUserId, message } = req.body;
  const socketId = connectedUsers.get(toUserId);

  if (socketId) {
    io.to(socketId).emit("newNotification", message);
    console.log(`📨 Notification sent to ${toUserId}`);
    return res.status(200).json({ success: true });
  }

  console.log(`⚠️ User ${toUserId} not connected`);
  res.status(404).json({ error: "User not connected" });
});

httpServer.listen(4000, () => {
  console.log("🚀 WebSocket server running on port 4000");
});
