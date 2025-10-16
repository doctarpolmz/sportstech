import { Server as HTTPServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { Message } from '../models/Message.model';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  role?: string;
}

const clients = new Map<string, AuthenticatedWebSocket>();

export const initWebSocketServer = (server: HTTPServer): void => {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
    console.log('WebSocket client attempting to connect');

    // Authenticate via query parameter
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as {
        userId: string;
        role: string;
      };

      ws.userId = decoded.userId;
      ws.role = decoded.role;
      clients.set(decoded.userId, ws);

      console.log(`✅ User ${decoded.userId} connected via WebSocket`);

      ws.on('message', async (data: string) => {
        try {
          const message = JSON.parse(data.toString());
          
          if (message.type === 'chat') {
            await handleChatMessage(ws, message);
          } else if (message.type === 'typing') {
            handleTypingIndicator(ws, message);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        if (ws.userId) {
          clients.delete(ws.userId);
          console.log(`User ${ws.userId} disconnected`);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

    } catch (error) {
      ws.close(1008, 'Invalid token');
    }
  });

  console.log('✅ WebSocket server initialized');
};

async function handleChatMessage(ws: AuthenticatedWebSocket, message: any): Promise<void> {
  if (!ws.userId) return;

  const newMessage = new Message({
    senderId: ws.userId,
    receiverId: message.receiverId,
    content: message.content,
    type: message.messageType || 'text',
    fileUrl: message.fileUrl
  });

  await newMessage.save();

  // Send to receiver if online
  const receiverWs = clients.get(message.receiverId);
  if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
    receiverWs.send(JSON.stringify({
      type: 'message',
      data: newMessage
    }));
  }

  // Send confirmation to sender
  ws.send(JSON.stringify({
    type: 'message_sent',
    data: newMessage
  }));
}

function handleTypingIndicator(ws: AuthenticatedWebSocket, message: any): void {
  if (!ws.userId) return;

  const receiverWs = clients.get(message.receiverId);
  if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
    receiverWs.send(JSON.stringify({
      type: 'typing',
      senderId: ws.userId,
      isTyping: message.isTyping
    }));
  }
}

export const sendNotification = (userId: string, notification: any): void => {
  const ws = clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'notification',
      data: notification
    }));
  }
};
