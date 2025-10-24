const { v4: uuidv4 } = require('uuid');

const applications = new Map();

class CreditController {
  /**
   * Calculate ARIP Credit Score
   * Composite score: ARI + FRL + Climate Bonus
   */
  calculateScore(req, res) {
    const { farmerId, location, landSize, crops, mobileMoneyData, vslaData } = req.body;
    
    // Agroclimatic Risk Index (0-100)
    const ari = this.calculateARI(location, crops);
    
    // Financial Repayment Likelihood (0-100)
    const frl = this.calculateFRL(mobileMoneyData, vslaData);
    
    // Climate Resilience Bonus (0-20)
    const climateBonus = this.calculateClimateBonus(crops, landSize);
    
    const totalScore = ari + frl + climateBonus;
    
    const score = {
      totalScore: Math.min(200, Math.round(totalScore)),
      breakdown: {
        agroclimaticRisk: Math.round(ari),
        financialRepayment: Math.round(frl),
        climateBonus: Math.round(climateBonus)
      },
      rating: this.getScoreRating(totalScore),
      recommendations: this.generateRecommendations(totalScore, ari, frl),
      calculatedAt: new Date()
    };
    
    res.json(score);
  }
  
  calculateARI(location, crops) {
    // Mock climate risk calculation based on location and crops
    const baseScore = 70;
    
    // Drought-resistant crops bonus
    const droughtResistantCrops = ['cassava', 'millet', 'sorghum', 'sweet potato'];
    const hasResistantCrops = crops?.some(crop => 
      droughtResistantCrops.includes(crop.toLowerCase())
    );
    
    const cropBonus = hasResistantCrops ? 15 : 0;
    
    // Location risk (simplified - would use real climate data)
    const locationRisk = Math.random() * 15;
    
    return baseScore + cropBonus - locationRisk;
  }
  
  calculateFRL(mobileMoneyData, vslaData) {
    const baseScore = 65;
    
    // Mobile money transaction regularity
    const mobileScore = mobileMoneyData?.transactionFrequency 
      ? Math.min(20, mobileMoneyData.transactionFrequency * 2) 
      : 10;
    
    // VSLA repayment history
    const vslaScore = vslaData?.repaymentRate 
      ? vslaData.repaymentRate * 25 
      : 5;
    
    return baseScore + mobileScore + vslaScore;
  }
  
  calculateClimateBonus(crops, landSize) {
    let bonus = 0;
    
    // Climate-smart practices
    const climateCrops = ['agroforestry', 'intercropping'];
    const hasClimatePractices = crops?.some(crop => 
      climateCrops.includes(crop.toLowerCase())
    );
    
    if (hasClimatePractices) bonus += 10;
    
    // Diversification
    if (crops && crops.length >= 3) bonus += 5;
    
    // Sustainable land use
    if (landSize && landSize >= 2 && landSize <= 5) bonus += 5;
    
    return Math.min(20, bonus);
  }
  
  getScoreRating(score) {
    if (score >= 170) return 'Excellent';
    if (score >= 150) return 'Good';
    if (score >= 130) return 'Fair';
    return 'Needs Improvement';
  }
  
  generateRecommendations(total, ari, frl) {
    const recommendations = [];
    
    if (ari < 70) {
      recommendations.push('Consider planting drought-resistant crops like cassava or millet');
      recommendations.push('Implement water conservation techniques such as mulching');
    }
    
    if (frl < 70) {
      recommendations.push('Build a stronger mobile money transaction history');
      recommendations.push('Join or actively participate in a VSLA group');
    }
    
    if (total < 150) {
      recommendations.push('Adopt climate-smart agricultural practices');
      recommendations.push('Diversify your crop portfolio to reduce risk');
    }
    
    return recommendations;
  }
  
  getApplications(req, res) {
    const appList = Array.from(applications.values());
    res.json({
      total: appList.length,
      applications: appList
    });
  }
  
  submitApplication(req, res) {
    const application = {
      id: uuidv4(),
      ...req.body,
      status: 'pending',
      submittedAt: new Date(),
      updatedAt: new Date()
    };
    
    applications.set(application.id, application);
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  }
  
  getApplication(req, res) {
    const { id } = req.params;
    const application = applications.get(id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(application);
  }
  
  updateApplicationStatus(req, res) {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const application = applications.get(id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    application.status = status;
    application.notes = notes;
    application.updatedAt = new Date();
    
    applications.set(id, application);
    
    res.json({
      message: 'Application status updated',
      application
    });
  }
}

module.exports = new CreditController();
