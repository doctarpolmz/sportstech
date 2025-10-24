import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'

type AuthState = { token: string | null, role?: string, userId?: string, farmerId?: string }

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<{ role?: string; farmerId?: string }>
  register: (payload: { email: string, password: string, role?: string, name?: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null })

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) setState(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state))
  }, [state])

  async function login(email: string, password: string) {
    const res = await apiFetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    setState({ token: data.token, role: data.role, userId: data.userId, farmerId: data.farmerId })
    return { role: data.role as string | undefined, farmerId: data.farmerId as string | undefined }
  }

  async function register(payload: { email: string, password: string, role?: string, name?: string }) {
    const res = await apiFetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error('Register failed')
  }

  function logout() { setState({ token: null }); localStorage.removeItem('auth') }

  return <AuthContext.Provider value={{ ...state, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
