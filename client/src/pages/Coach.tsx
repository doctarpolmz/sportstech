import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'
import { useAuth } from '../store/auth'

export default function Coach() {
  const { user } = useAuth()
  const [athleteId, setAthleteId] = useState('')
  const [athletes, setAthletes] = useState<any[]>([])
  const [drills, setDrills] = useState<any[]>([])
  const [drill, setDrill] = useState({ athleteId: '', title: '', description: '' })
  async function refresh() {
    const a = await apiGet<{ athletes: any[] }>('/coach/athletes'); setAthletes(a.athletes)
    const d = await apiGet<{ drills: any[] }>('/coach/drills'); setDrills(d.drills)
  }
  useEffect(() => { refresh() }, [])
  async function assignAthlete() {
    await apiPost('/coach/assign', { athleteId })
    setAthleteId(''); refresh()
  }
  async function createDrill(e: React.FormEvent) {
    e.preventDefault()
    await apiPost('/coach/drill', drill)
    setDrill({ athleteId: '', title: '', description: '' }); refresh()
  }
  if (user?.role !== 'coach' && user?.role !== 'admin') return <div className="p-4">Forbidden</div>
  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="font-medium mb-2">Link Athlete</div>
        <input className="border p-2 rounded" placeholder="Athlete ID" value={athleteId} onChange={e=>setAthleteId(e.target.value)} />
        <button className="ml-2 bg-blue-600 text-white rounded px-3 py-2" onClick={assignAthlete}>Link</button>
      </div>
      <div>
        <div className="font-medium mb-2">Athletes</div>
        <ul className="space-y-1">{athletes.map(a => <li key={a.id} className="border rounded p-2">{a.name} — {a.email}</li>)}</ul>
      </div>
      <div>
        <div className="font-medium mb-2">Assign Drill</div>
        <form className="space-y-2" onSubmit={createDrill}>
          <input className="border p-2 rounded w-full" placeholder="Athlete ID" value={drill.athleteId} onChange={e=>setDrill({ ...drill, athleteId: e.target.value })} />
          <input className="border p-2 rounded w-full" placeholder="Title" value={drill.title} onChange={e=>setDrill({ ...drill, title: e.target.value })} />
          <textarea className="border p-2 rounded w-full" placeholder="Description" value={drill.description} onChange={e=>setDrill({ ...drill, description: e.target.value })} />
          <button className="bg-blue-600 text-white rounded px-3 py-2">Create</button>
        </form>
      </div>
      <div>
        <div className="font-medium mb-2">Drills</div>
        <ul className="space-y-1">{drills.map(d => <li key={d.id} className="border rounded p-2">{d.title} — {d.description}</li>)}</ul>
      </div>
    </div>
  )
}
