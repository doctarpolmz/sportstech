import { useEffect, useState } from 'react'
import { apiGet, API_BASE, authHeaders } from '../lib/api'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => { apiGet('/users/me').then((d:any) => setUser(d.user)) }, [])
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const form = new FormData()
    form.append('photo', f)
    const resp = await fetch(`${API_BASE}/users/me/photo`, { method: 'POST', headers: { ...authHeaders() }, body: form })
    const data = await resp.json()
    setUser((u:any) => ({ ...u, profilePhotoUrl: data.url }))
  }
  if (!user) return <div className="p-4">Loading...</div>
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        {user.profilePhotoUrl ? <img src={user.profilePhotoUrl} className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-gray-200" />}
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
      <input type="file" accept="image/*" onChange={onFile} />
    </div>
  )
}
