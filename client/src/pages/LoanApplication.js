import React, { useState } from 'react';
import axios from 'axios';
import './LoanApplication.css';

function LoanApplication({ user }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    loanType: '',
    amount: '',
    purpose: '',
    duration: '6',
    crops: user.profile?.crops?.join(', ') || '',
    landSize: user.profile?.landSize || '',
    hasInsurance: false,
    vslaStatus: user.profile?.vslaStatus === 'active'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const loanTypes = [
    {
      id: 'input',
      name: 'Input Loan',
      range: 'UGX 200,000 - 1,000,000',
      description: 'Seeds, fertilizers, and agricultural inputs',
      icon: '🌾'
    },
    {
      id: 'equipment',
      name: 'Equipment Loan',
      range: 'UGX 500,000 - 5,000,000',
      description: 'Farm machinery and equipment',
      icon: '🚜'
    },
    {
      id: 'climate-smart',
      name: 'Climate-Smart Loan',
      range: 'UGX 100,000 - 2,000,000',
      description: 'Climate-resilient farming practices',
      icon: '🌱'
    },
    {
      id: 'emergency',
      name: 'Emergency Loan',
      range: 'UGX 50,000 - 500,000',
      description: 'Quick access for urgent needs',
      icon: '⚡'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/credit/applications', {
        farmerId: user.id,
        farmerName: user.name,
        ...formData,
        submittedAt: new Date()
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="loan-application-page container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h1>Application Submitted Successfully!</h1>
          <p>Your loan application has been received and is being processed.</p>
          
          <div className="next-steps">
            <h3>What happens next?</h3>
            <div className="steps-list">
              <div className="step-item">
                <span className="step-number">1</span>
                <div>
                  <h4>Review & Verification</h4>
                  <p>Our team will review your application within 24 hours</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <div>
                  <h4>Credit Assessment</h4>
                  <p>Your ARIP score will be evaluated with climate data</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <div>
                  <h4>Approval & Disbursement</h4>
                  <p>Funds will be sent to your mobile money account</p>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-details">
            <h4>Application Summary</h4>
            <div className="detail-row">
              <span>Loan Type:</span>
              <strong>{loanTypes.find(t => t.id === formData.loanType)?.name}</strong>
            </div>
            <div className="detail-row">
              <span>Amount:</span>
              <strong>UGX {parseInt(formData.amount).toLocaleString()}</strong>
            </div>
            <div className="detail-row">
              <span>Duration:</span>
              <strong>{formData.duration} months</strong>
            </div>
            <div className="detail-row">
              <span>Contact:</span>
              <strong>{user.phone || user.email}</strong>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/'}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-application-page container">
      <div className="page-header">
        <h1>Apply for a Loan</h1>
        <p>Access climate-smart financing for your farm</p>
      </div>

      <div className="progress-bar-container">
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-label">Loan Type</div>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-label">Details</div>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Review</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="application-form">
        {step === 1 && (
          <div className="form-step">
            <h2>Select Loan Type</h2>
            <div className="loan-types-grid">
              {loanTypes.map(type => (
                <div
                  key={type.id}
                  className={`loan-type-card ${formData.loanType === type.id ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, loanType: type.id }))}
                >
                  <div className="loan-type-icon">{type.icon}</div>
                  <h3>{type.name}</h3>
                  <p className="loan-range">{type.range}</p>
                  <p className="loan-description">{type.description}</p>
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!formData.loanType}
                onClick={() => setStep(2)}
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Loan Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Loan Amount (UGX)*</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="form-group">
                <label>Loan Duration*</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Purpose of Loan*</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="Describe how you will use this loan"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Crops Planted</label>
                <input
                  type="text"
                  name="crops"
                  value={formData.crops}
                  onChange={handleInputChange}
                  placeholder="e.g., Coffee, Maize"
                />
              </div>

              <div className="form-group">
                <label>Land Size (acres)</label>
                <input
                  type="number"
                  step="0.1"
                  name="landSize"
                  value={formData.landSize}
                  onChange={handleInputChange}
                  placeholder="Enter land size"
                />
              </div>

              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasInsurance"
                    checked={formData.hasInsurance}
                    onChange={handleInputChange}
                  />
                  <span>I am interested in parametric insurance coverage</span>
                </label>
              </div>

              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="vslaStatus"
                    checked={formData.vslaStatus}
                    onChange={handleInputChange}
                  />
                  <span>I am an active member of a VSLA group</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(3)}
              >
                Review Application →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Review Your Application</h2>
            <div className="review-section">
              <div className="review-card">
                <h3>Loan Information</h3>
                <div className="review-detail">
                  <span>Type:</span>
                  <strong>{loanTypes.find(t => t.id === formData.loanType)?.name}</strong>
                </div>
                <div className="review-detail">
                  <span>Amount:</span>
                  <strong>UGX {parseInt(formData.amount).toLocaleString()}</strong>
                </div>
                <div className="review-detail">
                  <span>Duration:</span>
                  <strong>{formData.duration} months</strong>
                </div>
                <div className="review-detail">
                  <span>Purpose:</span>
                  <strong>{formData.purpose}</strong>
                </div>
              </div>

              <div className="review-card">
                <h3>Farm Information</h3>
                <div className="review-detail">
                  <span>Crops:</span>
                  <strong>{formData.crops || 'Not specified'}</strong>
                </div>
                <div className="review-detail">
                  <span>Land Size:</span>
                  <strong>{formData.landSize ? `${formData.landSize} acres` : 'Not specified'}</strong>
                </div>
                <div className="review-detail">
                  <span>VSLA Member:</span>
                  <strong>{formData.vslaStatus ? 'Yes' : 'No'}</strong>
                </div>
                <div className="review-detail">
                  <span>Insurance Interest:</span>
                  <strong>{formData.hasInsurance ? 'Yes' : 'No'}</strong>
                </div>
              </div>

              <div className="review-card highlight">
                <h3>Estimated Terms</h3>
                <div className="review-detail">
                  <span>Interest Rate:</span>
                  <strong>12-18% per annum*</strong>
                </div>
                <div className="review-detail">
                  <span>Processing Time:</span>
                  <strong>24-48 hours</strong>
                </div>
                <div className="review-detail">
                  <span>Disbursement Method:</span>
                  <strong>Mobile Money</strong>
                </div>
                <p className="terms-note">*Actual rate based on your ARIP credit score</p>
              </div>
            </div>

            <div className="terms-agreement">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the terms and conditions and authorize ARIP to process my credit information</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoanApplication;
