import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'

export function Home() {
  const [health, setHealth] = useState<string>("…")
  useEffect(() => {
    fetch('/api/health').then(r=>r.json()).then(j=>setHealth(j.status)).catch(()=>setHealth('offline'))
    const socket = io('/', { path: '/socket.io' })
    socket.on('welcome', (msg) => {
      // eslint-disable-next-line no-console
      console.log(msg)
    })
    return () => { socket.close() }
  },[])
  return (
    <div className="hero">
      <h1 className="text-2xl font-bold mb-2">Welcome to ARIP</h1>
      <p className="mb-4">Log in to access your dashboard or create an account to get started.</p>
      <div className="grid">
        <div className="card">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <div className="flex gap-2">
            <Link className="button" to="/login">Login</Link>
            <Link className="button" to="/register">Register</Link>
          </div>
        </div>
        <div className="card">
          <h3>Status</h3>
          <p>API health: <strong>{health}</strong></p>
        </div>
      </div>
    </div>
  )
}
