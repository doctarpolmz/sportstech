import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { apiGet, apiPost, API_BASE } from '../lib/api'
import { useAuth } from '../store/auth'

type Thread = { id: string; coachId: string; athleteId: string }
type Message = { id: string; threadId: string; senderId: string; recipientId: string; content: string; createdAt: string }

export default function Messages() {
  const { user, token } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [selected, setSelected] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')

  const socket = useMemo(() => {
    if (!token) return null
    return io(API_BASE.replace('/api',''))
  }, [token])

  useEffect(() => { apiGet<{ threads: Thread[] }>('/chat/thread').then((d) => setThreads(d.threads)) }, [])
  useEffect(() => {
    if (!selected || !socket) return
    socket.emit('joinThread', selected.id)
    apiGet<{ messages: Message[] }>(`/chat/messages/${selected.id}`).then((d) => setMessages(d.messages))
    const handler = (msg: Message) => { if (msg.threadId === selected.id) setMessages((m) => [...m, msg]) }
    socket.on('message', handler)
    return () => { socket.off('message', handler) }
  }, [selected, socket])

  async function send() {
    if (!selected || !user || !socket || !text.trim()) return
    const recipientId = user.id === selected.coachId ? selected.athleteId : selected.coachId
    socket.emit('message', { threadId: selected.id, senderId: user.id, recipientId, content: text })
    setText('')
  }

  return (
    <div className="flex h-[70vh]">
      <aside className="w-64 border-r p-3 space-y-2">
        <button className="w-full border rounded p-2" onClick={async () => {
          const coachId = user?.role === 'coach' ? user.id : prompt('Coach ID?') || ''
          const athleteId = user?.role === 'athlete' ? user.id : prompt('Athlete ID?') || ''
          const { thread } = await apiPost<{ thread: Thread }>('/chat/thread', { coachId, athleteId })
          setThreads((t) => Array.from(new Map([...t, thread].map((x: Thread) => [x.id, x])).values()))
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
            <div key={m.id} className={`max-w-[60%] p-2 rounded ${m.senderId === user?.id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100'}`}>{m.content}</div>
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
