const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', analyticsController.getOverview);
router.get('/impact', analyticsController.getImpactMetrics);
router.get('/trends', analyticsController.getTrends);

module.exports = router;
