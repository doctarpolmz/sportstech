const express = require('express');
const router = express.Router();
const fspController = require('../controllers/fspController');

router.get('/dashboard', fspController.getDashboard);
router.get('/portfolio', fspController.getPortfolio);
router.get('/risk-analysis', fspController.getRiskAnalysis);
router.post('/loan-decision', fspController.makeLoanDecision);

module.exports = router;
