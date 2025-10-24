import { NavLink, Route, Routes } from 'react-router-dom'
import { Home } from './Home'
import { Tech } from './Tech'
import { Partners } from './Partners'
import { Impact } from './Impact'

export function App() {
  return (
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
          <Route path="/tech" element={<Tech />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/impact" element={<Impact />} />
        </Routes>
      </main>
    </div>
  )
}
