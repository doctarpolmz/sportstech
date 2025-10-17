import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuthStore } from './state/auth'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import VideosPage from './pages/VideosPage'
import ChatPage from './pages/ChatPage'
import SchedulePage from './pages/SchedulePage'
import LineupPage from './pages/LineupPage'
import Live from './pages/Live'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div>
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-bold text-xl">SportsTech <span className="text-blue-600">AI</span></Link>
          <nav className="flex-1 flex gap-4 text-sm">
            {user && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/upload">Upload</Link>
                <Link to="/videos">Videos</Link>
                <Link to="/chat">Chat</Link>
                <Link to="/schedule">Schedule</Link>
                <Link to="/live">Live</Link>
                {user.role !== 'athlete' && <Link to="/lineup">Lineup</Link>}
              </>
            )}
          </nav>
          <div className="ml-auto">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{user.name}</span>
                <button className="btn" onClick={logout}>Logout</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn bg-gray-800 hover:bg-gray-900">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
          <Route path="/videos" element={<PrivateRoute><VideosPage /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
          <Route path="/lineup" element={<PrivateRoute><LineupPage /></PrivateRoute>} />
          <Route path="/live" element={<PrivateRoute><Live /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  )
}
