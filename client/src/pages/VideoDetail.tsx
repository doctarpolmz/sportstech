import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGet } from '../lib/api'

type Video = { id: string; originalName: string; score: number | null; analysisJson?: string | null; labelsJson?: string | null }

export default function VideoDetail() {
  const { id } = useParams()
  const [video, setVideo] = useState<Video | null>(null)
  useEffect(() => { apiGet<{ video: Video }>(`/videos/${id}`).then((d) => setVideo(d.video)) }, [id])
  if (!video) return <div className="p-4">Loading...</div>
  const analysis = video.analysisJson ? JSON.parse(video.analysisJson as string) : null
  const labels = video.labelsJson ? JSON.parse(video.labelsJson as string) : []
  const apiBase = (import.meta as any).env.VITE_API_BASE || 'http://localhost:4000/api'
  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">{video.originalName}</h2>
      <div>Score: {video.score ?? 'N/A'}</div>
      {analysis && (
        <div className="border rounded p-3">
          <div className="font-medium">Labels</div>
          <div className="text-sm text-gray-600">{labels.join(', ')}</div>
          <div className="font-medium mt-3">Missing</div>
          <ul className="list-disc ml-5">{(analysis.feedback?.missing || []).map((m: string) => <li key={m}>{m}</li>)}</ul>
          <div className="font-medium mt-3">Improvements</div>
          <ul className="list-disc ml-5">{(analysis.feedback?.improvements || []).map((m: string) => <li key={m}>{m}</li>)}</ul>
          <div className="font-medium mt-3">Recommended YouTube</div>
          <ul className="list-disc ml-5">{(analysis.recommendations || []).map((r: any) => <li key={r.url}><a className="text-blue-600" href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>)}</ul>
        </div>
      )}
      <a className="text-blue-600 underline" href={`${apiBase}/export/coach-report/${video.id}`} target="_blank" rel="noreferrer">Download Coach's Report (PDF)</a>
    </div>
  )
}
