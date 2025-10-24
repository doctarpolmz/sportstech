const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');

router.post('/score', creditController.calculateScore);
router.get('/applications', creditController.getApplications);
router.post('/applications', creditController.submitApplication);
router.get('/applications/:id', creditController.getApplication);
router.put('/applications/:id/status', creditController.updateApplicationStatus);

module.exports = router;
