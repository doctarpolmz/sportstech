import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'

type Schedule = { id: string; title: string; startTime: string; endTime: string }

export default function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [title, setTitle] = useState('')
  const [athleteId, setAthleteId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [accessToken, setAccessToken] = useState('')

  async function refresh() { const r = await apiGet<{ schedules: Schedule[] }>('/schedules'); setSchedules(r.schedules) }
  useEffect(() => { refresh() }, [])
  async function create(e: React.FormEvent) {
    e.preventDefault()
    await apiPost('/schedules', { athleteId, title, startTime, endTime })
    setTitle(''); setStartTime(''); setEndTime(''); refresh()
  }
  async function addToCalendar(id: string) {
    await apiPost(`/schedules/${id}/calendar`, { accessToken })
    alert('Added to Google Calendar (dev/stub)')
  }
  return (
    <div className="p-4 space-y-4">
      <form className="space-y-2" onSubmit={create}>
        <div className="font-medium">Create Session</div>
        <input className="border p-2 rounded w-full" placeholder="Athlete ID" value={athleteId} onChange={e=>setAthleteId(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 rounded w-full" type="datetime-local" value={startTime} onChange={e=>setStartTime(e.target.value)} />
        <input className="border p-2 rounded w-full" type="datetime-local" value={endTime} onChange={e=>setEndTime(e.target.value)} />
        <button className="bg-blue-600 text-white rounded px-3 py-2">Create</button>
      </form>
      <div>
        <div className="font-medium mb-2">Upcoming</div>
        <ul className="space-y-2">{schedules.map(s => (
          <li key={s.id} className="border rounded p-3 flex justify-between">
            <div>
              <div>{s.title}</div>
              <div className="text-sm text-gray-500">{new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleString()}</div>
            </div>
            <button className="text-blue-600" onClick={() => addToCalendar(s.id)}>Add to Google Calendar</button>
          </li>
        ))}</ul>
      </div>
      <div>
        <div className="font-medium mb-1">Google Access Token</div>
        <input className="border p-2 rounded w-full" placeholder="Paste OAuth access token here (dev)" value={accessToken} onChange={e=>setAccessToken(e.target.value)} />
      </div>
    </div>
  )
}
