# ARIP API Documentation

## Base URL
```
Production: https://arip.ug/api
Development: http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "securepassword",
  "name": "John Mukasa",
  "role": "farmer",
  "phone": "+256700000001",
  "profile": {
    "landSize": 2.5,
    "crops": ["Coffee", "Maize"],
    "location": "Wakiso District"
  }
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "farmer@example.com",
    "name": "John Mukasa",
    "role": "farmer"
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "farmer@example.com",
    "name": "John Mukasa",
    "role": "farmer"
  }
}
```

### Credit Scoring

#### Calculate ARIP Score
```http
POST /api/credit/score
```

**Request Body:**
```json
{
  "farmerId": "uuid",
  "location": "Wakiso District",
  "landSize": 2.5,
  "crops": ["Coffee", "Maize"],
  "mobileMoneyData": {
    "transactionFrequency": 8
  },
  "vslaData": {
    "repaymentRate": 0.95
  }
}
```

**Response:**
```json
{
  "totalScore": 175,
  "breakdown": {
    "agroclimaticRisk": 82,
    "financialRepayment": 88,
    "climateBonus": 5
  },
  "rating": "Excellent",
  "recommendations": [
    "Consider planting drought-resistant crops",
    "Join a VSLA group for better financial history"
  ],
  "calculatedAt": "2024-01-15T10:30:00Z"
}
```

#### Submit Loan Application
```http
POST /api/credit/applications
```

**Request Body:**
```json
{
  "farmerId": "uuid",
  "farmerName": "John Mukasa",
  "loanType": "input",
  "amount": 500000,
  "duration": "6",
  "purpose": "Purchase seeds and fertilizers for coffee plantation",
  "crops": "Coffee, Maize",
  "landSize": 2.5,
  "hasInsurance": true,
  "vslaStatus": true
}
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": "uuid",
    "status": "pending",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
}
```

### USSD Integration

#### USSD Gateway Endpoint
```http
POST /api/ussd
```

**Request Body (Africa's Talking Format):**
```json
{
  "sessionId": "ATUid_123456",
  "serviceCode": "*384*96#",
  "phoneNumber": "+256700000001",
  "text": "1*2"
}
```

**Response:**
```
CON Welcome to ARIP
1. Check Credit Score
2. Apply for Loan
3. View Insurance
4. Climate Tips
5. My Profile
0. Exit
```

### Climate Data

#### Get Weather Data
```http
GET /api/climate/weather/:location
```

**Response:**
```json
{
  "location": "Wakiso",
  "current": {
    "temperature": 24.5,
    "humidity": 75,
    "rainfall": 2.5,
    "windSpeed": 8.2,
    "conditions": "Partly Cloudy"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Get Satellite Data
```http
GET /api/climate/satellite/:farmerId
```

**Response:**
```json
{
  "farmerId": "uuid",
  "ndvi": {
    "value": 0.75,
    "interpretation": "Healthy vegetation",
    "trend": "improving"
  },
  "evi": {
    "value": 0.52,
    "interpretation": "Good canopy cover"
  },
  "soilMoisture": {
    "value": 0.68,
    "interpretation": "Adequate moisture"
  },
  "lastUpdated": "2024-01-15T10:30:00Z",
  "historicalData": [...]
}
```

#### Get Weather Forecast
```http
GET /api/climate/forecast/:location
```

**Response:**
```json
{
  "location": "Wakiso",
  "daily": [
    {
      "date": "2024-01-16",
      "temperature": {
        "min": 20,
        "max": 28
      },
      "rainfall": 5.2,
      "humidity": 70,
      "conditions": "Light Rain"
    }
  ],
  "seasonal": {
    "outlook": "Normal to above-normal rainfall expected",
    "confidence": "moderate",
    "recommendations": [...]
  }
}
```

### Farmer Management

#### Get All Farmers
```http
GET /api/farmers
```

**Response:**
```json
{
  "total": 1247,
  "farmers": [
    {
      "id": "uuid",
      "name": "Sarah Namukasa",
      "phone": "+256700000002",
      "location": {
        "district": "Wakiso",
        "subcounty": "Kira",
        "village": "Banda"
      },
      "landSize": 3.2,
      "crops": ["Coffee", "Banana", "Beans"],
      "creditScore": 175,
      "registeredAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Farmer Stats
```http
GET /api/farmers/:id/stats
```

**Response:**
```json
{
  "creditScore": 175,
  "scoreBreakdown": {
    "agroclimaticRisk": 82,
    "financialRepayment": 88,
    "climateBonus": 5
  },
  "loanHistory": {
    "totalLoans": 3,
    "activeLoans": 1,
    "repaymentRate": 0.96
  },
  "insurance": {
    "enrolled": true,
    "coverage": 100000,
    "claims": 0
  },
  "climateData": {
    "lastRainfall": "2024-01-14T10:30:00Z",
    "ndvi": 0.75,
    "soilMoisture": 0.68
  }
}
```

### FSP Portal

#### Get FSP Dashboard
```http
GET /api/fsp/dashboard
```

**Response:**
```json
{
  "summary": {
    "totalFarmers": 1247,
    "activeLoans": 856,
    "portfolioValue": 2840000000,
    "averageScore": 165,
    "repaymentRate": 0.94
  },
  "recentApplications": [...],
  "riskDistribution": {
    "excellent": 342,
    "good": 487,
    "fair": 298,
    "poor": 120
  }
}
```

#### Get Portfolio Overview
```http
GET /api/fsp/portfolio
```

**Response:**
```json
{
  "totalLoans": 856,
  "totalValue": 2840000000,
  "byProduct": {
    "inputLoans": {
      "count": 423,
      "value": 987000000
    }
  },
  "byRegion": {...},
  "performance": {
    "current": 765,
    "overdue1to30": 54,
    "overdue31to60": 23,
    "overdue60plus": 14
  }
}
```

### Analytics

#### Get Platform Overview
```http
GET /api/analytics/overview
```

**Response:**
```json
{
  "platform": {
    "totalFarmers": 1247,
    "activeFarmers": 1089,
    "totalFSPs": 8,
    "totalLoansIssued": 2340,
    "totalValue": 6750000000
  },
  "growth": {
    "farmersThisMonth": 87,
    "loansThisMonth": 143,
    "valueThisMonth": 456000000
  },
  "avgCreditScore": 165,
  "financialInclusion": {
    "before": 0.11,
    "after": 0.33,
    "improvement": 0.22
  }
}
```

#### Get Impact Metrics
```http
GET /api/analytics/impact
```

**Response:**
```json
{
  "financialInclusion": {
    "farmersWithAccess": 1089,
    "previouslyUnbanked": 967,
    "percentageIncrease": 200
  },
  "climateResilience": {
    "climateSmartAdoption": 0.52,
    "carbonCreditsGenerated": 2340,
    "waterConservationPractices": 0.48
  },
  "economicImpact": {
    "averageIncomeIncrease": 0.31,
    "totalCreditDisbursed": 6750000000,
    "jobsCreated": 234
  },
  "loanPerformance": {
    "repaymentRate": 0.94,
    "defaultRate": 0.04,
    "averageLoanSize": 2884615
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Detailed error message"
}
```

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **USSD Endpoint**: 300 requests per minute (higher for telecom traffic)

## Webhooks

### USSD Session Callback
When a USSD session ends, a callback can be sent to registered endpoints:

```json
{
  "sessionId": "ATUid_123456",
  "phoneNumber": "+256700000001",
  "endReason": "user_ended",
  "duration": 120,
  "actionsPerformed": ["credit_check", "loan_application"]
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

// Login
const login = async () => {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'farmer@demo.com',
    password: 'demo123'
  });
  return response.data.token;
};

// Calculate Credit Score
const getCreditScore = async (token) => {
  const response = await axios.post(
    'http://localhost:5000/api/credit/score',
    {
      farmerId: 'uuid',
      location: 'Wakiso',
      landSize: 2.5,
      crops: ['Coffee', 'Maize']
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};
```

### Python
```python
import requests

# Login
def login():
    response = requests.post(
        'http://localhost:5000/api/auth/login',
        json={
            'email': 'farmer@demo.com',
            'password': 'demo123'
        }
    )
    return response.json()['token']

# Get credit score
def get_credit_score(token):
    response = requests.post(
        'http://localhost:5000/api/credit/score',
        json={
            'farmerId': 'uuid',
            'location': 'Wakiso',
            'landSize': 2.5,
            'crops': ['Coffee', 'Maize']
        },
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()
```

## Support

For API support:
- **Email**: api@arip.ug
- **Documentation**: https://docs.arip.ug
- **Sandbox**: https://sandbox.arip.ug
