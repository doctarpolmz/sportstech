const { v4: uuidv4 } = require('uuid');

// Mock farmer database
const farmers = new Map();

// Demo data
const demoFarmers = [
  {
    id: uuidv4(),
    name: 'Sarah Namukasa',
    phone: '+256700000002',
    location: { district: 'Wakiso', subcounty: 'Kira', village: 'Banda' },
    landSize: 3.2,
    crops: ['Coffee', 'Banana', 'Beans'],
    vslaStatus: 'active',
    creditScore: 175,
    registeredAt: new Date('2024-01-15')
  },
  {
    id: uuidv4(),
    name: 'David Mugisha',
    phone: '+256700000003',
    location: { district: 'Mubende', subcounty: 'Kasambya', village: 'Kyegobe' },
    landSize: 5.0,
    crops: ['Maize', 'Coffee'],
    vslaStatus: 'active',
    creditScore: 182,
    registeredAt: new Date('2024-02-20')
  },
  {
    id: uuidv4(),
    name: 'Grace Akello',
    phone: '+256700000004',
    location: { district: 'Gulu', subcounty: 'Bungatira', village: 'Pece' },
    landSize: 2.0,
    crops: ['Sorghum', 'Groundnuts', 'Sesame'],
    vslaStatus: 'pending',
    creditScore: 158,
    registeredAt: new Date('2024-03-10')
  }
];

demoFarmers.forEach(farmer => farmers.set(farmer.id, farmer));

class FarmerController {
  getAllFarmers(req, res) {
    const farmerList = Array.from(farmers.values());
    res.json({
      total: farmerList.length,
      farmers: farmerList
    });
  }
  
  getFarmer(req, res) {
    const { id } = req.params;
    const farmer = farmers.get(id);
    
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    
    res.json(farmer);
  }
  
  createFarmer(req, res) {
    const farmer = {
      id: uuidv4(),
      ...req.body,
      creditScore: 100, // Default score
      registeredAt: new Date()
    };
    
    farmers.set(farmer.id, farmer);
    res.status(201).json(farmer);
  }
  
  updateFarmer(req, res) {
    const { id } = req.params;
    const farmer = farmers.get(id);
    
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    
    const updatedFarmer = { ...farmer, ...req.body, id };
    farmers.set(id, updatedFarmer);
    
    res.json(updatedFarmer);
  }
  
  getFarmerStats(req, res) {
    const { id } = req.params;
    const farmer = farmers.get(id);
    
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    
    // Generate mock statistics
    const stats = {
      creditScore: farmer.creditScore,
      scoreBreakdown: {
        agroclimaticRisk: Math.floor(Math.random() * 40) + 60,
        financialRepayment: Math.floor(Math.random() * 40) + 60,
        climateBonus: Math.floor(Math.random() * 20)
      },
      loanHistory: {
        totalLoans: Math.floor(Math.random() * 5) + 1,
        activeLoans: Math.floor(Math.random() * 2),
        repaymentRate: 0.92 + Math.random() * 0.08
      },
      insurance: {
        enrolled: Math.random() > 0.5,
        coverage: farmer.landSize * 40000,
        claims: Math.floor(Math.random() * 3)
      },
      climateData: {
        lastRainfall: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        ndvi: 0.6 + Math.random() * 0.3,
        soilMoisture: 0.4 + Math.random() * 0.4
      }
    };
    
    res.json(stats);
  }
}

module.exports = new FarmerController();
