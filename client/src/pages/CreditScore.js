import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './CreditScore.css';

function CreditScore({ user }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateScore();
  }, []);

  const calculateScore = async () => {
    try {
      const response = await axios.post('/api/credit/score', {
        farmerId: user.id,
        location: user.profile?.location || 'Wakiso',
        landSize: user.profile?.landSize || 2.5,
        crops: user.profile?.crops || ['Coffee', 'Maize'],
        mobileMoneyData: {
          transactionFrequency: 8
        },
        vslaData: {
          repaymentRate: 0.95
        }
      });

      setScore(response.data);
    } catch (error) {
      console.error('Error calculating score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const chartData = score?.breakdown ? [
    { name: 'Agroclimatic Risk', value: score.breakdown.agroclimaticRisk },
    { name: 'Financial Repayment', value: score.breakdown.financialRepayment },
    { name: 'Climate Bonus', value: score.breakdown.climateBonus }
  ] : [];

  return (
    <div className="credit-score-page container">
      <div className="page-header">
        <h1>Your ARIP Credit Score</h1>
        <p>Comprehensive climate-resilient credit assessment</p>
      </div>

      <div className="score-hero">
        <div className="score-display">
          <div className="score-circle">
            <div className="score-value">{score?.totalScore || 0}</div>
            <div className="score-max">/ 200</div>
          </div>
          <div className="score-rating" style={{
            color: score?.rating === 'Excellent' ? '#10b981' :
                   score?.rating === 'Good' ? '#3b82f6' :
                   score?.rating === 'Fair' ? '#f59e0b' : '#ef4444'
          }}>
            {score?.rating}
          </div>
        </div>

        <div className="score-breakdown-chart">
          <h3>Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="score-details">
        <h2>Score Components</h2>
        <div className="components-grid">
          <div className="component-card">
            <div className="component-icon green">🌾</div>
            <h3>Agroclimatic Risk Index</h3>
            <div className="component-score">{score?.breakdown?.agroclimaticRisk || 0}<span>/100</span></div>
            <p>Assessment of climate vulnerability based on your location and crops</p>
            <div className="progress-bar">
              <div 
                className="progress-fill green" 
                style={{ width: `${score?.breakdown?.agroclimaticRisk || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="component-card">
            <div className="component-icon blue">💳</div>
            <h3>Financial Repayment Likelihood</h3>
            <div className="component-score">{score?.breakdown?.financialRepayment || 0}<span>/100</span></div>
            <p>Based on mobile money transactions and VSLA history</p>
            <div className="progress-bar">
              <div 
                className="progress-fill blue" 
                style={{ width: `${score?.breakdown?.financialRepayment || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="component-card">
            <div className="component-icon yellow">🌱</div>
            <h3>Climate Resilience Bonus</h3>
            <div className="component-score">{score?.breakdown?.climateBonus || 0}<span>/20</span></div>
            <p>Rewards for adopting climate-smart agricultural practices</p>
            <div className="progress-bar">
              <div 
                className="progress-fill yellow" 
                style={{ width: `${(score?.breakdown?.climateBonus / 20 * 100) || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {score?.recommendations && score.recommendations.length > 0 && (
        <div className="recommendations">
          <h2>💡 Recommendations to Improve Your Score</h2>
          <div className="recommendations-list">
            {score.recommendations.map((rec, index) => (
              <div key={index} className="recommendation-item">
                <span className="recommendation-icon">✓</span>
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="score-benefits">
        <h2>What Your Score Means</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h4>Excellent (170-200)</h4>
            <ul>
              <li>✓ Lowest interest rates (12%)</li>
              <li>✓ Higher loan amounts</li>
              <li>✓ Priority approval</li>
              <li>✓ Premium insurance rates</li>
            </ul>
          </div>

          <div className="benefit-card">
            <h4>Good (150-169)</h4>
            <ul>
              <li>✓ Competitive rates (15%)</li>
              <li>✓ Standard loan amounts</li>
              <li>✓ Fast approval</li>
              <li>✓ Insurance eligible</li>
            </ul>
          </div>

          <div className="benefit-card">
            <h4>Fair (130-149)</h4>
            <ul>
              <li>✓ Moderate rates (18%)</li>
              <li>✓ Smaller loan amounts</li>
              <li>✓ Standard processing</li>
              <li>✓ Basic insurance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditScore;
