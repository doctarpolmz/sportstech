export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}
