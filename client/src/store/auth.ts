import { create } from 'zustand';
import axios from 'axios';

interface User { id: string; email: string; role: 'athlete'|'coach'|'admin'; name: string }
interface AuthState {
  user?: User;
  token?: string;
  refreshToken?: string;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {email: string; password: string; name: string; role: User['role']}) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  token: localStorage.getItem('token') || undefined,
  refreshToken: localStorage.getItem('refreshToken') || undefined,
  async login(email, password) {
    const { data } = await axios.post('/api/auth/login', { email, password });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    set({ user: data.user, token: data.token, refreshToken: data.refreshToken });
  },
  async register(payload) {
    await axios.post('/api/auth/register', payload);
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: undefined, token: undefined, refreshToken: undefined });
  }
}))
