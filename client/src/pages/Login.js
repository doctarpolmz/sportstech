import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role) => {
    const credentials = {
      farmer: { email: 'farmer@demo.com', password: 'demo123' },
      fsp: { email: 'fsp@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🌱</div>
          <h1>AgriRisk Intelligence Platform</h1>
          <p>AI-Driven Climate Resilience for Uganda's Farmers</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : t('login')}
          </button>
        </form>

        <div className="demo-accounts">
          <p className="demo-title">Demo Accounts:</p>
          <div className="demo-buttons">
            <button onClick={() => demoLogin('farmer')} className="demo-btn farmer">
              🌾 {t('farmerPortal')}
            </button>
            <button onClick={() => demoLogin('fsp')} className="demo-btn fsp">
              🏦 {t('fspPortal')}
            </button>
            <button onClick={() => demoLogin('admin')} className="demo-btn admin">
              👤 {t('adminPortal')}
            </button>
          </div>
          <p className="demo-note">Password: demo123</p>
        </div>

        <div className="ussd-info">
          <h3>📱 USSD Access</h3>
          <p>Dial <strong>*384*96#</strong> on MTN or Airtel to access ARIP via USSD</p>
          <ul>
            <li>Check your credit score</li>
            <li>Apply for loans</li>
            <li>Get climate tips</li>
            <li>View insurance status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
