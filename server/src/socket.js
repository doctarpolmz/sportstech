import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function attachSocketHandlers(io) {
  io.on('connection', (socket) => {
    // Expect client to join with a threadId to receive messages
    socket.on('joinThread', (threadId) => {
      socket.join(`thread:${threadId}`);
    });

    socket.on('message', async (payload) => {
      try {
        const { threadId, senderId, recipientId, content } = payload;
        const message = await prisma.message.create({
          data: { threadId, senderId, recipientId, content }
        });
        io.to(`thread:${threadId}`).emit('message', message);
      } catch (e) {
        console.error('Socket message error', e);
      }
    });
  });
}
