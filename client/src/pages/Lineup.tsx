import { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api'

type Lineup = { id: string; teamName: string; formation: string; playersJson: string }

type Player = { name: string; number?: string; x: number; y: number; photoUrl?: string }

export default function Lineup() {
  const [teamName, setTeamName] = useState('My Team')
  const [formation, setFormation] = useState('4-3-3')
  const [players, setPlayers] = useState<Player[]>([])
  const [lineups, setLineups] = useState<Lineup[]>([])
  useEffect(() => { apiGet<{ lineups: Lineup[] }>('/lineups').then(d => setLineups(d.lineups)) }, [])
  function addPlayer() { setPlayers(p => [...p, { name: 'Player', x: 50, y: 50 }]) }
  async function save() {
    await apiPost('/lineups', { teamName, formation, players })
    alert('Saved lineup'); const d = await apiGet<{ lineups: Lineup[] }>('/lineups'); setLineups(d.lineups)
  }
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="font-medium mb-2">Designer</div>
          <div className="relative border rounded h-[420px] bg-green-700 bg-opacity-20" onClick={(e) => {
            const rect = (e.target as HTMLDivElement).getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            setPlayers(p => [...p, { name: 'P', x, y }])
          }}>
            {players.map((pl, idx) => (
              <div key={idx} className="absolute -translate-x-1/2 -translate-y-1/2 text-xs bg-white rounded px-1 py-0.5 border"
                style={{ left: `${pl.x}%`, top: `${pl.y}%` }}>{pl.name}</div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button className="border px-3 py-1 rounded" onClick={addPlayer}>Add</button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={save}>Save</button>
          </div>
        </div>
        <div className="w-64">
          <div className="font-medium mb-2">Settings</div>
          <input className="border p-2 rounded w-full mb-2" value={teamName} onChange={e=>setTeamName(e.target.value)} />
          <input className="border p-2 rounded w-full" value={formation} onChange={e=>setFormation(e.target.value)} />
        </div>
      </div>
      <div>
        <div className="font-medium mb-2">Saved Lineups</div>
        <ul className="space-y-2">{lineups.map(l => (
          <li key={l.id} className="border rounded p-2">{l.teamName} — {l.formation}</li>
        ))}</ul>
      </div>
    </div>
  )
}
