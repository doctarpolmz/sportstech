import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('', { path: '/socket.io' });

export default function Chat() {
  const [threads, setThreads] = useState<any[]>([]);
  const [currentThread, setCurrentThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    axios.get('/api/chat/thread').then(({data})=> setThreads(data.threads));
  }, [])

  useEffect(() => {
    if (!currentThread) return;
    socket.emit('joinThread', currentThread.id);
    axios.get(`/api/chat/messages/${currentThread.id}`).then(({data})=> setMessages(data.messages));
    const onMsg = (msg: any) => {
      if (msg.threadId === currentThread.id) setMessages((m)=>[...m, msg]);
    };
    socket.on('message', onMsg);
    return () => { socket.off('message', onMsg); }
  }, [currentThread])

  const send = async () => {
    if (!text.trim() || !currentThread) return;
    // For demo, we don't know recipient ID. Choose other participant heuristically.
    const me = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])) as any;
    const recipientId = me.id === currentThread.coachId ? currentThread.athleteId : currentThread.coachId;
    socket.emit('message', { threadId: currentThread.id, senderId: me.id, recipientId, content: text });
    setText('');
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4 bg-white rounded shadow p-3">
        <h2 className="font-semibold mb-2">Threads</h2>
        <ul className="space-y-2">
          {threads.map(t => (
            <li key={t.id} className={`p-2 rounded cursor-pointer ${currentThread?.id===t.id?'bg-blue-50':'hover:bg-gray-50'}`} onClick={()=>setCurrentThread(t)}>
              <div className="text-sm">Thread</div>
              <div className="text-xs text-gray-500">Coach/Athlete chat</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-8 bg-white rounded shadow p-3 flex flex-col">
        <div className="flex-1 overflow-auto space-y-2">
          {messages.map(m => (
            <div key={m.id} className="text-sm"><span className="text-gray-500">{new Date(m.createdAt).toLocaleTimeString()}:</span> {m.content}</div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input className="flex-1 border rounded p-2" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" />
          <button onClick={send} className="bg-blue-600 text-white px-3 py-2 rounded">Send</button>
        </div>
      </div>
    </div>
  )
}
