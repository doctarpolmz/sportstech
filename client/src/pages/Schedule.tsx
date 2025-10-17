import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Schedule() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ athleteId: '', title: '', description: '', location: '', startTime: '', endTime: '' });

  const load = async () => {
    const { data } = await axios.get('/api/schedules');
    setItems(data.schedules);
  };

  useEffect(() => { load(); }, [])

  const create = async () => {
    await axios.post('/api/schedules', form);
    setForm({ athleteId: '', title: '', description: '', location: '', startTime: '', endTime: '' });
    load();
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-5 bg-white rounded shadow p-3">
        <h2 className="font-semibold mb-2">Create Session</h2>
        <div className="space-y-2">
          <input className="w-full border rounded p-2" placeholder="Athlete ID" value={form.athleteId} onChange={e=>setForm({...form, athleteId: e.target.value})} />
          <input className="w-full border rounded p-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
          <input className="w-full border rounded p-2" placeholder="Location" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} />
          <textarea className="w-full border rounded p-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
          <div className="flex gap-2">
            <input type="datetime-local" className="w-1/2 border rounded p-2" value={form.startTime} onChange={e=>setForm({...form, startTime: e.target.value})} />
            <input type="datetime-local" className="w-1/2 border rounded p-2" value={form.endTime} onChange={e=>setForm({...form, endTime: e.target.value})} />
          </div>
          <button onClick={create} className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
        </div>
      </div>
      <div className="col-span-7 bg-white rounded shadow p-3">
        <h2 className="font-semibold mb-2">Upcoming Sessions</h2>
        <ul className="space-y-2">
          {items.map(i => (
            <li key={i.id} className="p-2 border rounded">
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-gray-500">{new Date(i.startTime).toLocaleString()} → {new Date(i.endTime).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
