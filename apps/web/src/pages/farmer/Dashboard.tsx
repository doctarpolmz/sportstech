import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export function FarmerDashboard(){
  const { token, farmerId } = useAuth()
  const [score, setScore] = useState<{ ari: number, frl: number, bonus: number, total: number } | null>(null)

  useEffect(() => {
    if (!farmerId) return
    fetch(`/api/farmers/${farmerId}/arip-score`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setScore).catch(()=>setScore(null))
  }, [farmerId, token])

  const bars = useMemo(() => {
    if (!score) return null
    const canvas = document.getElementById('score-bars') as HTMLCanvasElement | null
    if (!canvas) return null
    const ctx = canvas.getContext('2d')!
    new Chart(ctx, {
      type: 'bar',
      data: { labels: ['ARI','FRL','BONUS','TOTAL'], datasets: [{ label: 'Score', data: [score.ari, score.frl, score.bonus, score.total], backgroundColor: '#2ecc71' }] },
      options: { responsive: true, scales: { y: { beginAtZero: true, max: 200 } } }
    })
    return () => { Chart.getChart(ctx)?.destroy() }
  }, [score])

  return (
    <div className="grid">
      <div className="card">
        <h3>Your ARIP Score</h3>
        {score ? <canvas id="score-bars" height={160}></canvas> : <p>Loading…</p>}
      </div>
    </div>
  )
}
