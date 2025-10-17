import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

type Video = { id: string; originalName: string; score: number | null; createdAt: string }

export default function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  useEffect(() => { apiGet<{ videos: Video[] }>('/videos').then((d) => setVideos(d.videos)) }, [])
  const chartData = videos.slice().reverse().map((v, idx) => ({ index: idx + 1, score: v.score ?? 0, name: v.originalName }))
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Performance Dashboard</h2>
      <div className="h-64 border rounded p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h3 className="font-semibold mt-6 mb-2">Recent Analyses</h3>
      <ul className="space-y-2">
        {videos.map((v) => (
          <li key={v.id} className="border rounded p-3 flex justify-between">
            <div>
              <div className="font-medium">{v.originalName}</div>
              <div className="text-sm text-gray-500">Score: {v.score ?? 'N/A'}</div>
            </div>
            <Link className="text-blue-600" to={`/videos/${v.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
