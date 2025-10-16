import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore, type User } from '../state/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<User['role']>('athlete')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await register({ name, email, password, role })
      setMessage('Registered! Please check your email to verify your account.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (e) {
      setError('Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold">Create account</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full border p-2 rounded" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="w-full border p-2 rounded" value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="athlete">Athlete</option>
          <option value="coach">Coach</option>
        </select>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <button className="w-full bg-blue-600 text-white rounded p-2">Sign Up</button>
      </form>
      <p className="text-sm mt-3">Have an account? <Link className="underline" to="/login">Login</Link></p>
    </div>
  )
}
