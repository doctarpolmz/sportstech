import { useState } from 'react'
import axios from 'axios'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [sport, setSport] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const form = new FormData()
    form.append('video', file)
    form.append('sport', sport)
    const { data } = await axios.post('/videos/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    setStatus(`Uploaded! Status: ${data.status}`)
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
