import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  function onLogout() {
    logout()
    navigate('/login')
  }
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b">
      <Link to="/" className="font-semibold">SportsTech AI</Link>
      <div className="flex items-center gap-4 text-sm">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/schedules">Schedules</Link>
        <Link to="/lineup">Lineup</Link>
        {user?.role === 'coach' && <Link to="/coach">Coach</Link>}
        <Link to="/live">Live</Link>
        <Link to="/profile">Profile</Link>
        {user ? <button onClick={onLogout} className="text-red-600">Logout</button> : <Link to="/login">Login</Link>}
      </div>
    </nav>
  )
}
