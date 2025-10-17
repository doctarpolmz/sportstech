import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function Register() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'athlete'|'coach'|'admin'>('athlete');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password, name, role });
      setMsg('Registered! Check your email for verification link.');
      setError('');
      setTimeout(()=>navigate('/login'), 1500);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Registration failed');
      setMsg('');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      {msg && <div className="text-green-600 text-sm mb-2">{msg}</div>}
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="w-full border rounded p-2" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="athlete">Athlete</option>
          <option value="coach">Coach</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full bg-blue-600 text-white rounded p-2">Create Account</button>
      </form>
      <p className="text-sm mt-3">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  )
}
