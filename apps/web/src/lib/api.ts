export function apiBase() {
  const env = (window as any).__ARIP_API__ as string | undefined
  return env || '/api'
}

export async function apiFetch(path: string, init?: RequestInit) {
  const base = apiBase()
  const url = path.startsWith('http') ? path : `${base}${path.replace(/^\/api/, '')}`
  return fetch(url, init)
}
