import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

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
      <h1>AgriRisk Intelligence Platform (ARIP)</h1>
      <p>AI-driven climate resilience and financial inclusion for Uganda's smallholder farmers.</p>
      <div className="grid">
        <div className="card">
          <h3>Executive Summary</h3>
          <p>
            ARIP fuses satellite, climate, mobile money, and VSLA data to build a
            composite climate-resilient credit score, linking to parametric insurance and
            climate-smart input financing.
          </p>
        </div>
        <div className="card">
          <h3>Status</h3>
          <p>API health: <strong>{health}</strong></p>
          <p>USSD endpoint: <code>POST /api/ussd</code></p>
        </div>
      </div>
    </div>
  )
}
