class AnalyticsController {
  getOverview(req, res) {
    const overview = {
      platform: {
        totalFarmers: 1247,
        activeFarmers: 1089,
        totalFSPs: 8,
        totalLoansIssued: 2340,
        totalValue: 6750000000 // UGX
      },
      growth: {
        farmersThisMonth: 87,
        loansThisMonth: 143,
        valueThisMonth: 456000000
      },
      avgCreditScore: 165,
      financialInclusion: {
        before: 0.11,
        after: 0.33,
        improvement: 0.22
      }
    };
    
    res.json(overview);
  }
  
  getImpactMetrics(req, res) {
    const impact = {
      financialInclusion: {
        farmersWithAccess: 1089,
        previouslyUnbanked: 967,
        percentageIncrease: 200
      },
      climateResilience: {
        climateSmartAdoption: 0.52,
        carbonCreditsGenerated: 2340, // tons CO2e
        waterConservationPractices: 0.48
      },
      economicImpact: {
        averageIncomeIncrease: 0.31,
        totalCreditDisbursed: 6750000000,
        jobsCreated: 234
      },
      loanPerformance: {
        repaymentRate: 0.94,
        defaultRate: 0.04,
        averageLoanSize: 2884615
      },
      insurance: {
        farmersEnrolled: 543,
        totalCoverageValue: 1250000000,
        claimsPaid: 87000000
      }
    };
    
    res.json(impact);
  }
  
  getTrends(req, res) {
    const trends = {
      creditScores: {
        monthly: this.generateMonthlyData(150, 170, 12),
        trend: 'increasing'
      },
      loanDisbursement: {
        monthly: this.generateMonthlyData(300000000, 600000000, 12),
        trend: 'increasing'
      },
      repaymentRates: {
        monthly: this.generateMonthlyData(0.90, 0.96, 12),
        trend: 'stable'
      },
      farmerRegistration: {
        monthly: this.generateMonthlyData(50, 100, 12, true),
        trend: 'increasing'
      },
      climateSmartAdoption: {
        monthly: this.generateMonthlyData(0.30, 0.52, 12),
        trend: 'increasing'
      }
    };
    
    res.json(trends);
  }
  
  generateMonthlyData(min, max, months, isInteger = false) {
    return Array.from({ length: months }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - 1 - i));
      const value = min + (max - min) * (i / months) + (Math.random() - 0.5) * (max - min) * 0.1;
      
      return {
        month: date.toISOString().slice(0, 7),
        value: isInteger ? Math.round(value) : Math.round(value * 100) / 100
      };
    });
  }
}

module.exports = new AnalyticsController();
