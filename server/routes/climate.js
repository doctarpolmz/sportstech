const express = require('express');
const router = express.Router();
const climateController = require('../controllers/climateController');

router.get('/weather/:location', climateController.getWeather);
router.get('/satellite/:farmerId', climateController.getSatelliteData);
router.get('/forecast/:location', climateController.getForecast);
router.get('/alerts/:district', climateController.getAlerts);

module.exports = router;
