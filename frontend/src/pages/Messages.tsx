import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWebSocketStore } from '@/store/websocketStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare } from 'lucide-react';
import { Message, User } from '@/types';
import api from '@/lib/api';

export default function Messages() {
  const { user, token } = useAuthStore();
  const { connect, disconnect, sendMessage, messages: wsMessages } = useWebSocketStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (token) {
      connect(token);
    }
    fetchConversations();

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    // Add new WebSocket messages to the list
    if (wsMessages.length > 0 && selectedUser) {
      const lastMsg = wsMessages[wsMessages.length - 1];
      if (lastMsg.senderId === selectedUser.id || lastMsg.receiverId === selectedUser.id) {
        setMessages(prev => [...prev, lastMsg]);
      }
    }
  }, [wsMessages, selectedUser]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser) return;

    sendMessage({
      type: 'chat',
      receiverId: selectedUser.id,
      content: newMessage,
      messageType: 'text'
    });

    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Conversations List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.user._id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-accent ${
                  selectedUser?.id === conv.user._id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedUser(conv.user)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {conv.user.firstName[0]}{conv.user.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {conv.user.firstName} {conv.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">{conv.user.role}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {conversations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-2" />
                <p>No conversations yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="col-span-8 flex flex-col">
          {selectedUser ? (
            <>
              <CardHeader>
                <CardTitle>
                  {selectedUser.firstName} {selectedUser.lastName}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.senderId === user?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button onClick={handleSend}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
