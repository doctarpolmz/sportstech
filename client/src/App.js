import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import FSPDashboard from './pages/FSPDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreditScore from './pages/CreditScore';
import LoanApplication from './pages/LoanApplication';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('arip_token');
    const userData = localStorage.getItem('arip_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('arip_token', token);
    localStorage.setItem('arip_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('arip_token');
    localStorage.removeItem('arip_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading ARIP...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Navigation user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
          />
          
          <Route 
            path="/" 
            element={
              user ? (
                user.role === 'farmer' ? <FarmerDashboard user={user} /> :
                user.role === 'fsp' ? <FSPDashboard user={user} /> :
                <AdminDashboard user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/credit-score" 
            element={user ? <CreditScore user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/loan-application" 
            element={user ? <LoanApplication user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
