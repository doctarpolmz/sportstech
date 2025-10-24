import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export function Register(){
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('FARMER')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(e: React.FormEvent){
    e.preventDefault()
    try {
      await register({ email, password, name, role })
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Register failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 border border-white/10 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Register</h2>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <form onSubmit={submit} className="grid gap-3">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input className="input" placeholder="Full name (for farmers)" value={name} onChange={e=>setName(e.target.value)} />
        <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="FARMER">Farmer</option>
          <option value="FSP_STAFF">FSP Staff</option>
        </select>
        <button className="button" type="submit">Create account</button>
      </form>
    </div>
  )
}
