const express = require('express');
const router = express.Router();
const ussdController = require('../controllers/ussdController');

/**
 * USSD Gateway Endpoint
 * Handles incoming USSD requests from the telecom gateway
 */
router.post('/', ussdController.handleUSSDRequest);

/**
 * USSD Session Management
 */
router.get('/sessions/:sessionId', ussdController.getSession);
router.delete('/sessions/:sessionId', ussdController.endSession);

module.exports = router;
