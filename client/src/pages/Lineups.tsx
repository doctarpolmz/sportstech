import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface Player { id: string; name: string; x: number; y: number; photoUrl?: string }

export default function Lineups() {
  const [teamName, setTeamName] = useState('My Team');
  const [formation, setFormation] = useState('4-3-3');
  const [players, setPlayers] = useState<Player[]>([...Array(11)].map((_,i)=>({ id: String(i+1), name: `P${i+1}`, x: 50, y: 10 + i*8 })));
  const [lineups, setLineups] = useState<any[]>([]);
  const fieldRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const { data } = await axios.get('/api/lineups');
    setLineups(data.lineups);
  };
  useEffect(()=>{ load(); }, [])

  const onDrag = (id: string, e: React.MouseEvent) => {
    const rect = fieldRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left)/rect.width)*100;
    const y = ((e.clientY - rect.top)/rect.height)*100;
    setPlayers(ps => ps.map(p => p.id===id ? { ...p, x, y } : p));
  }

  const save = async () => {
    const { data } = await axios.post('/api/lineups', { teamName, formation, players });
    setLineups([data.lineup, ...lineups]);
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8">
        <div ref={fieldRef} className="relative bg-green-600 rounded-lg aspect-video">
          {players.map(p => (
            <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move" style={{ left: `${p.x}%`, top: `${p.y}%` }} onMouseDown={(e)=>{
              const move = (ev: MouseEvent) => onDrag(p.id, ev as any);
              const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
              window.addEventListener('mousemove', move);
              window.addEventListener('mouseup', up);
            }}>
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-sm font-semibold">{p.name}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input className="border rounded p-2" value={teamName} onChange={e=>setTeamName(e.target.value)} />
          <input className="border rounded p-2" value={formation} onChange={e=>setFormation(e.target.value)} />
          <button onClick={save} className="bg-blue-600 text-white px-3 py-2 rounded">Save Lineup</button>
        </div>
      </div>
      <div className="col-span-4 bg-white rounded shadow p-3">
        <h2 className="font-semibold mb-2">Saved Lineups</h2>
        <ul className="space-y-2">
          {lineups.map(l => (
            <li key={l.id} className="p-2 border rounded">
              <div className="font-medium">{l.teamName}</div>
              <div className="text-sm text-gray-500">{l.formation}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
