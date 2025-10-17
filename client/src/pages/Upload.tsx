import { useState } from 'react'
import { API_BASE, authHeaders } from '../lib/api'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [sport, setSport] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const form = new FormData()
    form.append('video', file)
    form.append('sport', sport)
    const resp = await fetch(`${API_BASE}/videos/upload`, { method: 'POST', headers: { ...authHeaders() }, body: form })
    if (!resp.ok) { setStatus('Upload failed'); return }
    const data = await resp.json()
    setStatus('Uploaded and analyzed!')
  }
  return (
    <div className="p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input type="file" accept=".mp4,.mov,.avi,.mkv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input className="w-full border p-2 rounded" placeholder="Sport (e.g., basketball)" value={sport} onChange={(e) => setSport(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Analyze</button>
        {status && <div className="text-sm mt-2">{status}</div>}
      </form>
    </div>
  )
}
