import { Route, Routes, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">SportsTech AI</h1>
      <p className="text-gray-600">AI-powered sports technique analysis and training</p>
      <div className="mt-4 flex gap-4">
        <Link className="px-4 py-2 bg-blue-600 text-white rounded" to="/login">Login</Link>
        <Link className="px-4 py-2 bg-gray-200 rounded" to="/register">Register</Link>
      </div>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    // placeholder
  }, [])
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="p-4 bg-white shadow flex gap-4">
        <Link to="/">Home</Link>
        <a href={String((__API_URL__ as unknown) || '') + '/health'} target="_blank">API Health</a>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
