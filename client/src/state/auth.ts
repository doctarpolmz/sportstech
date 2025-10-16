import { create } from 'zustand'
import axios from 'axios'

export type User = { id: string; email: string; role: 'athlete'|'coach'|'admin'; name: string }

type AuthState = {
  user?: User
  token?: string
  refreshToken?: string
  login: (email: string, password: string) => Promise<void>
  register: (payload: {email: string; password: string; name: string; role: User['role']}) => Promise<void>
  logout: () => void
}

axios.defaults.baseURL = (import.meta as any).env.VITE_API_BASE || 'http://localhost:4000/api'

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  token: localStorage.getItem('token') || undefined,
  refreshToken: localStorage.getItem('refreshToken') || undefined,
  async login(email, password) {
    const { data } = await axios.post('/auth/login', { email, password })
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    set({ user: data.user, token: data.token, refreshToken: data.refreshToken })
  },
  async register(payload) {
    await axios.post('/auth/register', payload)
  },
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    delete axios.defaults.headers.common['Authorization']
    set({ user: undefined, token: undefined, refreshToken: undefined })
  }
}))
