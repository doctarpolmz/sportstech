import { create } from 'zustand';

interface WebSocketState {
  ws: WebSocket | null;
  connected: boolean;
  messages: any[];
  connect: (token: string) => void;
  disconnect: () => void;
  sendMessage: (message: any) => void;
  addMessage: (message: any) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  ws: null,
  connected: false,
  messages: [],

  connect: (token: string) => {
    const wsUrl = `ws://localhost:5000/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      set({ connected: true });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        set((state) => ({
          messages: [...state.messages, data.data]
        }));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      set({ connected: false, ws: null });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    set({ ws });
  },

  disconnect: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
    }
    set({ ws: null, connected: false });
  },

  sendMessage: (message: any) => {
    const { ws } = get();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  },

  addMessage: (message: any) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },
}));
