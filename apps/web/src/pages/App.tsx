import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import { Home } from './Home'
import { Tech } from './Tech'
import { Partners } from './Partners'
import { Impact } from './Impact'
import { Login } from './auth/Login'
import { Register } from './auth/Register'
import { FarmerDashboard } from './farmer/Dashboard'
import { FspDashboard } from './fsp/Dashboard'
import { AuthProvider, useAuth } from '../auth/AuthContext'

function Protected({ children, roles }: { children: JSX.Element, roles?: string[] }) {
  const { token, role } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (roles && role && !roles.includes(role)) return <Navigate to="/" replace />
  return children
}

export function App() {
  return (
    <AuthProvider>
    <div>
      <header>
        <nav className="container">
          <div style={{fontWeight:800}}>ARIP</div>
          <div style={{display:'flex',gap:12}}>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/tech">Architecture</NavLink>
            <NavLink to="/partners">Partners</NavLink>
            <NavLink to="/impact">Impact</NavLink>
          </div>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/farmer" element={<Protected roles={["FARMER"]}><FarmerDashboard /></Protected>} />
          <Route path="/fsp" element={<Protected roles={["FSP_STAFF","ADMIN"]}><FspDashboard /></Protected>} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/impact" element={<Impact />} />
        </Routes>
      </main>
    </div>
    </AuthProvider>
  )
}
