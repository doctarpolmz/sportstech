const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');

router.get('/', farmerController.getAllFarmers);
router.get('/:id', farmerController.getFarmer);
router.post('/', farmerController.createFarmer);
router.put('/:id', farmerController.updateFarmer);
router.get('/:id/stats', farmerController.getFarmerStats);

module.exports = router;
