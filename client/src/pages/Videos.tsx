import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [file, setFile] = useState<File|null>(null);
  const [sport, setSport] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios.get('/api/videos').then(({data})=>setVideos(data.videos));
  }, [])

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('video', file);
    form.append('sport', sport);
    await axios.post('/api/videos/upload', form);
    const { data } = await axios.get('/api/videos');
    setVideos(data.videos);
    setFile(null);
    setUploading(false);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">Your Videos</h1>
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-2 items-center">
        <input type="file" accept="video/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
        <input className="border rounded p-2" placeholder="Sport (e.g., tennis)" value={sport} onChange={e=>setSport(e.target.value)} />
        <button disabled={!file||uploading} onClick={upload} className="bg-blue-600 text-white px-3 py-2 rounded">{uploading?'Uploading...':'Upload & Analyze'}</button>
      </div>
      <ul className="space-y-2">
        {videos.map(v => (
          <li key={v.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-medium">{v.originalName}</div>
              <div className="text-sm text-gray-500">Status: {v.status} {typeof v.score==='number' && `(Score: ${v.score})`}</div>
            </div>
            <Link to={`/videos/${v.id}`} className="text-blue-600 text-sm">View</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
