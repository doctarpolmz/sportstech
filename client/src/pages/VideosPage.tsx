import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

type Video = { id: string; originalName: string; score: number | null; createdAt: string }

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  useEffect(() => { axios.get('/videos').then((d) => setVideos(d.data.videos)) }, [])
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      <ul className="space-y-2">
        {videos.map((v) => (
          <li key={v.id} className="border rounded p-3 flex justify-between">
            <div>
              <div className="font-medium">{v.originalName}</div>
              <div className="text-sm text-gray-500">Score: {v.score ?? 'N/A'}</div>
            </div>
            <Link className="text-blue-600" to={`/videos/${v.id}`}>Open</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
