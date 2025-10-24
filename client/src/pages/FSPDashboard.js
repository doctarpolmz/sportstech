import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

function FSPDashboard({ user }) {
  const [dashboard, setDashboard] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, portfolioRes] = await Promise.all([
        axios.get('/api/fsp/dashboard'),
        axios.get('/api/fsp/portfolio')
      ]);

      setDashboard(dashboardRes.data);
      setPortfolio(portfolioRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const riskData = dashboard?.riskDistribution ? [
    { name: 'Excellent', value: dashboard.riskDistribution.excellent },
    { name: 'Good', value: dashboard.riskDistribution.good },
    { name: 'Fair', value: dashboard.riskDistribution.fair },
    { name: 'Poor', value: dashboard.riskDistribution.poor }
  ] : [];

  return (
    <div className="dashboard-layout container">
      <div className="dashboard-header">
        <h1>FSP Dashboard - {user.organization || user.name}</h1>
        <p>Portfolio management and risk analysis</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green">👥</div>
          </div>
          <div className="stat-card-value">{dashboard?.summary?.totalFarmers?.toLocaleString() || 0}</div>
          <div className="stat-card-label">Total Farmers</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon blue">💼</div>
          </div>
          <div className="stat-card-value">{dashboard?.summary?.activeLoans?.toLocaleString() || 0}</div>
          <div className="stat-card-label">Active Loans</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon yellow">💰</div>
          </div>
          <div className="stat-card-value">
            UGX {((dashboard?.summary?.portfolioValue || 0) / 1000000000).toFixed(2)}B
          </div>
          <div className="stat-card-label">Portfolio Value</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green">✓</div>
          </div>
          <div className="stat-card-value">
            {((dashboard?.summary?.repaymentRate || 0) * 100).toFixed(1)}%
          </div>
          <div className="stat-card-label">Repayment Rate</div>
          <div className="stat-card-trend up">Above industry average</div>
        </div>
      </div>

      <div className="chart-section">
        <h2>Borrower Risk Distribution</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Loan Applications</h2>
        <div className="applications-table">
          <table>
            <thead>
              <tr>
                <th>Farmer Name</th>
                <th>Amount</th>
                <th>ARIP Score</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.recentApplications?.map(app => (
                <tr key={app.id}>
                  <td>{app.farmerName}</td>
                  <td>UGX {(app.amount / 1000000).toFixed(1)}M</td>
                  <td>
                    <span className={`score-badge ${app.score >= 170 ? 'excellent' : app.score >= 150 ? 'good' : 'fair'}`}>
                      {app.score}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${app.status}`}>{app.status}</span>
                  </td>
                  <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-small btn-primary">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {portfolio && (
        <div className="dashboard-section">
          <h2>Portfolio Performance</h2>
          <div className="performance-grid">
            <div className="performance-card">
              <h4>Loan Performance</h4>
              <div className="performance-stats">
                <div className="stat-row">
                  <span>Current</span>
                  <strong className="text-green">{portfolio.performance.current}</strong>
                </div>
                <div className="stat-row">
                  <span>1-30 days overdue</span>
                  <strong className="text-yellow">{portfolio.performance.overdue1to30}</strong>
                </div>
                <div className="stat-row">
                  <span>31-60 days overdue</span>
                  <strong className="text-orange">{portfolio.performance.overdue31to60}</strong>
                </div>
                <div className="stat-row">
                  <span>60+ days overdue</span>
                  <strong className="text-red">{portfolio.performance.overdue60plus}</strong>
                </div>
              </div>
            </div>

            <div className="performance-card">
              <h4>By Product Type</h4>
              <div className="performance-stats">
                <div className="stat-row">
                  <span>Input Loans</span>
                  <strong>UGX {(portfolio.byProduct.inputLoans.value / 1000000000).toFixed(2)}B</strong>
                </div>
                <div className="stat-row">
                  <span>Equipment Loans</span>
                  <strong>UGX {(portfolio.byProduct.equipmentLoans.value / 1000000000).toFixed(2)}B</strong>
                </div>
                <div className="stat-row">
                  <span>Climate-Smart Loans</span>
                  <strong>UGX {(portfolio.byProduct.climateSmartLoans.value / 1000000000).toFixed(2)}B</strong>
                </div>
                <div className="stat-row">
                  <span>Emergency Loans</span>
                  <strong>UGX {(portfolio.byProduct.emergencyLoans.value / 1000000000).toFixed(2)}B</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FSPDashboard;
