import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

export function FspDashboard(){
  const { token } = useAuth()
  const [data, setData] = useState<{ totalApplications: number, approved: number, rejected: number } | null>(null)
  useEffect(() => {
    fetch('/api/dashboard/fsp-overview', { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setData).catch(()=>setData(null))
  }, [token])
  return (
    <div className="grid">
      <div className="card">
        <h3>Portfolio Overview</h3>
        {data ? (
          <ul>
            <li>Total Applications: {data.totalApplications}</li>
            <li>Approved: {data.approved}</li>
            <li>Rejected: {data.rejected}</li>
          </ul>
        ) : <p>Loading…</p>}
      </div>
    </div>
  )
}
