import { Server } from 'socket.io';

let io;
const userSockets = new Map(); // Map userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For production on Render/Vercel, we can refine this later
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Register user socket
    socket.on('register', (userId) => {
      if (userId) {
        userSockets.set(userId.toString(), socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Remove from map on disconnect
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};

export const emitNotification = (userId, notificationData) => {
  if (!io) return;
  const socketId = userSockets.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit('new_notification', notificationData);
  }
};
