import { Server } from 'socket.io';
import { prisma } from '../index.js';

export function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    socket.on('joinThread', (threadId: string) => {
      socket.join(`thread:${threadId}`);
    });

    socket.on('sendMessage', async (payload: { threadId: string; senderId: string; content: string }) => {
      const message = await prisma.message.create({ data: { threadId: payload.threadId, senderId: payload.senderId, content: payload.content } });
      io.to(`thread:${payload.threadId}`).emit('newMessage', message);
    });
  });
}
