import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('farmer@arip.local')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(e: React.FormEvent){
    e.preventDefault()
    try {
      const next = await login(email, password)
      navigate(next.role === 'FSP_STAFF' ? '/fsp' : '/farmer')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 border border-white/10 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Login</h2>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <form onSubmit={submit} className="grid gap-3">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="button" type="submit">Sign in</button>
      </form>
    </div>
  )
}
