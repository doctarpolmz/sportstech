import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Dashboard.css';

function AdminDashboard({ user }) {
  const [analytics, setAnalytics] = useState(null);
  const [impact, setImpact] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, impactRes, trendsRes] = await Promise.all([
        axios.get('/api/analytics/overview'),
        axios.get('/api/analytics/impact'),
        axios.get('/api/analytics/trends')
      ]);

      setAnalytics(analyticsRes.data);
      setImpact(impactRes.data);
      setTrends(trendsRes.data);
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
        <h1>ARIP Admin Dashboard</h1>
        <p>Platform-wide analytics and impact metrics</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green">👥</div>
          </div>
          <div className="stat-card-value">{analytics?.platform?.totalFarmers?.toLocaleString() || 0}</div>
          <div className="stat-card-label">Total Farmers</div>
          <div className="stat-card-trend up">
            +{analytics?.growth?.farmersThisMonth || 0} this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon blue">💼</div>
          </div>
          <div className="stat-card-value">{analytics?.platform?.totalLoansIssued?.toLocaleString() || 0}</div>
          <div className="stat-card-label">Total Loans Issued</div>
          <div className="stat-card-trend up">
            +{analytics?.growth?.loansThisMonth || 0} this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon yellow">💰</div>
          </div>
          <div className="stat-card-value">
            UGX {((analytics?.platform?.totalValue || 0) / 1000000000).toFixed(2)}B
          </div>
          <div className="stat-card-label">Total Value Disbursed</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green">📊</div>
          </div>
          <div className="stat-card-value">{analytics?.avgCreditScore || 0}</div>
          <div className="stat-card-label">Avg Credit Score</div>
        </div>
      </div>

      {impact && (
        <>
          <div className="dashboard-section">
            <h2>Impact Metrics</h2>
            <div className="impact-grid">
              <div className="impact-card">
                <h3>📈 Financial Inclusion</h3>
                <div className="impact-stat">
                  <div className="big-number">{impact.financialInclusion.farmersWithAccess.toLocaleString()}</div>
                  <p>Farmers with credit access</p>
                </div>
                <div className="impact-detail">
                  <span className="label">Previously unbanked:</span>
                  <strong>{impact.financialInclusion.previouslyUnbanked.toLocaleString()}</strong>
                </div>
                <div className="impact-detail">
                  <span className="label">Percentage increase:</span>
                  <strong className="text-green">+{impact.financialInclusion.percentageIncrease}%</strong>
                </div>
              </div>

              <div className="impact-card">
                <h3>🌱 Climate Resilience</h3>
                <div className="impact-stat">
                  <div className="big-number">{(impact.climateResilience.climateSmartAdoption * 100).toFixed(0)}%</div>
                  <p>Climate-smart adoption rate</p>
                </div>
                <div className="impact-detail">
                  <span className="label">Carbon credits generated:</span>
                  <strong>{impact.climateResilience.carbonCreditsGenerated.toLocaleString()} tons CO2e</strong>
                </div>
                <div className="impact-detail">
                  <span className="label">Water conservation:</span>
                  <strong>{(impact.climateResilience.waterConservationPractices * 100).toFixed(0)}%</strong>
                </div>
              </div>

              <div className="impact-card">
                <h3>💼 Economic Impact</h3>
                <div className="impact-stat">
                  <div className="big-number">+{(impact.economicImpact.averageIncomeIncrease * 100).toFixed(0)}%</div>
                  <p>Average income increase</p>
                </div>
                <div className="impact-detail">
                  <span className="label">Total credit disbursed:</span>
                  <strong>UGX {(impact.economicImpact.totalCreditDisbursed / 1000000000).toFixed(2)}B</strong>
                </div>
                <div className="impact-detail">
                  <span className="label">Jobs created:</span>
                  <strong>{impact.economicImpact.jobsCreated.toLocaleString()}</strong>
                </div>
              </div>

              <div className="impact-card">
                <h3>📊 Loan Performance</h3>
                <div className="impact-stat">
                  <div className="big-number">{(impact.loanPerformance.repaymentRate * 100).toFixed(1)}%</div>
                  <p>Repayment rate</p>
                </div>
                <div className="impact-detail">
                  <span className="label">Default rate:</span>
                  <strong className="text-red">{(impact.loanPerformance.defaultRate * 100).toFixed(1)}%</strong>
                </div>
                <div className="impact-detail">
                  <span className="label">Avg loan size:</span>
                  <strong>UGX {(impact.loanPerformance.averageLoanSize / 1000000).toFixed(2)}M</strong>
                </div>
              </div>
            </div>
          </div>

          {trends?.creditScores && (
            <div className="chart-section">
              <h2>Platform Trends</h2>
              <div className="chart-container">
                <h3>Average Credit Score Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends.creditScores.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Credit Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Monthly Loan Disbursement (UGX)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends.loanDisbursement.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Disbursement" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
