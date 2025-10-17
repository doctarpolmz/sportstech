import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'

const API_BASE = (import.meta as any).env.VITE_API_BASE || 'http://localhost:4000/api'

type Thread = { id: string; coachId: string; athleteId: string }
type Message = { id: string; threadId: string; senderId: string; recipientId: string; content: string; createdAt: string }

export default function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selected, setSelected] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  const socket = useMemo(() => io(API_BASE.replace('/api','')), [])

  useEffect(() => { axios.get('/chat/thread').then((d) => setThreads(d.data.threads)) }, [])
  useEffect(() => {
    if (!selected) return
    socket.emit('joinThread', selected.id)
    axios.get(`/chat/messages/${selected.id}`).then((d) => setMessages(d.data.messages))
    const handler = (msg: Message) => { if (msg.threadId === selected.id) setMessages((m) => [...m, msg]) }
    socket.on('message', handler)
    return () => { socket.off('message', handler) }
  }, [selected])

  async function send() {
    if (!selected || !text.trim()) return
    const recipientId = prompt('Recipient ID?') || ''
    socket.emit('message', { threadId: selected.id, senderId: recipientId, recipientId, content: text })
    setText('')
  }

  return (
    <div className="flex h-[70vh]">
      <aside className="w-64 border-r p-3 space-y-2">
        <button className="w-full border rounded p-2" onClick={async () => {
          const coachId = prompt('Coach ID?') || ''
          const athleteId = prompt('Athlete ID?') || ''
          const { data } = await axios.post('/chat/thread', { coachId, athleteId })
          setThreads((t) => Array.from(new Map([...t, data.thread].map((x: Thread) => [x.id, x])).values()))
        }}>New Thread</button>
        {threads.map(t => (
          <div key={t.id} className={`p-2 rounded border cursor-pointer ${selected?.id === t.id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(t)}>
            {t.id.substring(0,8)}...
          </div>
        ))}
      </aside>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map(m => (
            <div key={m.id} className={`max-w-[60%] p-2 rounded bg-gray-100`}>{m.content}</div>
          ))}
        </div>
        <div className="p-3 border-t flex gap-2">
          <input className="flex-1 border p-2 rounded" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
          <button className="px-3 bg-blue-600 text-white rounded" onClick={send}>Send</button>
        </div>
      </main>
    </div>
  )
}
