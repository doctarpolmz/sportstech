class ClimateController {
  getWeather(req, res) {
    const { location } = req.params;
    
    // Mock weather data
    const weather = {
      location,
      current: {
        temperature: 22 + Math.random() * 8,
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() * 10,
        windSpeed: 5 + Math.random() * 10,
        conditions: ['Partly Cloudy', 'Sunny', 'Light Rain'][Math.floor(Math.random() * 3)]
      },
      timestamp: new Date()
    };
    
    res.json(weather);
  }
  
  getSatelliteData(req, res) {
    const { farmerId } = req.params;
    
    // Mock satellite data (NDVI, EVI)
    const data = {
      farmerId,
      ndvi: {
        value: 0.5 + Math.random() * 0.4,
        interpretation: 'Healthy vegetation',
        trend: 'improving'
      },
      evi: {
        value: 0.3 + Math.random() * 0.3,
        interpretation: 'Good canopy cover'
      },
      soilMoisture: {
        value: 0.3 + Math.random() * 0.4,
        interpretation: 'Adequate moisture'
      },
      lastUpdated: new Date(),
      historicalData: this.generateHistoricalData()
    };
    
    res.json(data);
  }
  
  getForecast(req, res) {
    const { location } = req.params;
    
    const forecast = {
      location,
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        temperature: {
          min: 18 + Math.random() * 5,
          max: 26 + Math.random() * 8
        },
        rainfall: Math.random() * 15,
        humidity: 60 + Math.random() * 25,
        conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)]
      })),
      seasonal: {
        outlook: 'Normal to above-normal rainfall expected',
        confidence: 'moderate',
        recommendations: [
          'Plan for timely planting when rains begin',
          'Prepare land and inputs in advance',
          'Consider early-maturing varieties'
        ]
      }
    };
    
    res.json(forecast);
  }
  
  getAlerts(req, res) {
    const { district } = req.params;
    
    const alerts = [
      {
        id: '1',
        type: 'drought',
        severity: 'low',
        district,
        message: 'Rainfall below average for the season. Monitor crop water needs.',
        issuedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ];
    
    res.json({
      district,
      alerts,
      total: alerts.length
    });
  }
  
  generateHistoricalData() {
    return Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      ndvi: 0.4 + Math.random() * 0.4,
      rainfall: 50 + Math.random() * 100
    }));
  }
}

module.exports = new ClimateController();
