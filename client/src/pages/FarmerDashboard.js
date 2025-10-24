import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function FarmerDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, weatherRes] = await Promise.all([
        axios.get(`/api/farmers/${user.id}/stats`),
        axios.get(`/api/climate/weather/${user.profile?.location || 'Wakiso'}`)
      ]);

      setStats(statsRes.data);
      setWeather(weatherRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard-layout container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 🌾</h1>
        <p>Here's your agricultural finance overview</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green">📊</div>
          </div>
          <div className="stat-card-value">{stats?.creditScore || 0}/200</div>
          <div className="stat-card-label">ARIP Credit Score</div>
          <div className="stat-card-trend up">
            ↑ +{stats?.scoreBreakdown?.climateBonus || 0} Climate Bonus
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon blue">💰</div>
          </div>
          <div className="stat-card-value">{stats?.loanHistory?.activeLoans || 0}</div>
          <div className="stat-card-label">Active Loans</div>
          <div className="stat-card-trend up">
            {((stats?.loanHistory?.repaymentRate || 0) * 100).toFixed(0)}% Repayment Rate
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon yellow">🌡️</div>
          </div>
          <div className="stat-card-value">{weather?.current?.temperature?.toFixed(1) || 0}°C</div>
          <div className="stat-card-label">Current Temperature</div>
          <div className="stat-card-trend">
            {weather?.current?.conditions || 'Loading...'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green">🛡️</div>
          </div>
          <div className="stat-card-value">{stats?.insurance?.enrolled ? 'Yes' : 'No'}</div>
          <div className="stat-card-label">Insurance Coverage</div>
          <div className="stat-card-trend">
            {stats?.insurance?.enrolled ? `UGX ${(stats?.insurance?.coverage / 1000000).toFixed(1)}M` : 'Not enrolled'}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <Link to="/credit-score" className="action-card">
            <div className="action-icon">📈</div>
            <h3>View Credit Score</h3>
            <p>Check your detailed ARIP score breakdown</p>
          </Link>

          <Link to="/loan-application" className="action-card">
            <div className="action-icon">💳</div>
            <h3>Apply for Loan</h3>
            <p>Access climate-smart financing options</p>
          </Link>

          <div className="action-card">
            <div className="action-icon">🌦️</div>
            <h3>Climate Insights</h3>
            <p>Get personalized farming recommendations</p>
          </div>

          <div className="action-card">
            <div className="action-icon">📱</div>
            <h3>USSD Access</h3>
            <p>Dial *384*96# for mobile access</p>
          </div>
        </div>
      </div>

      {stats?.climateData && (
        <div className="dashboard-section">
          <h2>Farm Health Indicators</h2>
          <div className="farm-health-grid">
            <div className="health-card">
              <h4>Vegetation Index (NDVI)</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill green" 
                  style={{ width: `${(stats.climateData.ndvi * 100).toFixed(0)}%` }}
                ></div>
              </div>
              <p>{(stats.climateData.ndvi * 100).toFixed(0)}% - Healthy vegetation</p>
            </div>

            <div className="health-card">
              <h4>Soil Moisture</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill blue" 
                  style={{ width: `${(stats.climateData.soilMoisture * 100).toFixed(0)}%` }}
                ></div>
              </div>
              <p>{(stats.climateData.soilMoisture * 100).toFixed(0)}% - Adequate moisture</p>
            </div>
          </div>
        </div>
      )}

      <div className="info-banner">
        <h3>💡 Climate-Smart Tip of the Day</h3>
        <p>Mulching helps retain soil moisture during dry spells. Consider using organic materials like grass clippings or crop residues to cover your soil.</p>
      </div>
    </div>
  );
}

export default FarmerDashboard;
