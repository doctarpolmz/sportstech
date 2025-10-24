class FSPController {
  getDashboard(req, res) {
    const dashboard = {
      summary: {
        totalFarmers: 1247,
        activeLoans: 856,
        portfolioValue: 2840000000, // UGX
        averageScore: 165,
        repaymentRate: 0.94
      },
      recentApplications: [
        {
          id: '1',
          farmerName: 'Sarah Namukasa',
          amount: 5000000,
          score: 175,
          status: 'pending',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          farmerName: 'David Mugisha',
          amount: 8000000,
          score: 182,
          status: 'approved',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ],
      riskDistribution: {
        excellent: 342,
        good: 487,
        fair: 298,
        poor: 120
      }
    };
    
    res.json(dashboard);
  }
  
  getPortfolio(req, res) {
    const portfolio = {
      totalLoans: 856,
      totalValue: 2840000000,
      byProduct: {
        inputLoans: { count: 423, value: 987000000 },
        equipmentLoans: { count: 234, value: 1245000000 },
        climateSmartLoans: { count: 156, value: 486000000 },
        emergencyLoans: { count: 43, value: 122000000 }
      },
      byRegion: {
        central: { count: 342, value: 1156000000 },
        western: { count: 287, value: 967000000 },
        eastern: { count: 156, value: 489000000 },
        northern: { count: 71, value: 228000000 }
      },
      performance: {
        current: 765,
        overdue1to30: 54,
        overdue31to60: 23,
        overdue60plus: 14
      }
    };
    
    res.json(portfolio);
  }
  
  getRiskAnalysis(req, res) {
    const analysis = {
      overallRisk: 'low',
      climateRisk: {
        drought: 'moderate',
        flood: 'low',
        pests: 'low'
      },
      creditRisk: {
        defaultProbability: 0.06,
        expectedLoss: 85000000
      },
      recommendations: [
        'Increase lending to climate-smart agriculture segment',
        'Monitor drought risk in northern region',
        'Consider parametric insurance bundling for high-value loans'
      ],
      trends: {
        scoreImprovement: 0.08,
        repaymentTrend: 'stable',
        portfolioGrowth: 0.15
      }
    };
    
    res.json(analysis);
  }
  
  makeLoanDecision(req, res) {
    const { applicationId, decision, amount, terms, notes } = req.body;
    
    const result = {
      applicationId,
      decision,
      approvedAmount: decision === 'approved' ? amount : 0,
      terms: decision === 'approved' ? terms : null,
      interestRate: decision === 'approved' ? this.calculateInterestRate(req.body.score) : null,
      notes,
      decidedAt: new Date(),
      decidedBy: req.user?.id || 'system'
    };
    
    res.json({
      message: `Loan ${decision}`,
      result
    });
  }
  
  calculateInterestRate(score) {
    if (score >= 180) return 12; // 12% annual for excellent scores
    if (score >= 160) return 15; // 15% for good scores
    if (score >= 140) return 18; // 18% for fair scores
    return 22; // 22% for lower scores
  }
}

module.exports = new FSPController();
