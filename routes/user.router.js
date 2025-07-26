const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');
const router = express.Router();

// // Ensure consistent app root path resolution
appRoot.setPath(path.resolve(process.cwd()));

// // Import user controller
const userController = require(appRoot + '/controller/user.controller.js');

// // User dashboard
router.get('/dashboard', userController.renderDashboard);

// User profile
router
    .route('/profile')
    .get(userController.renderUserProfile);

router.post('/profile-update', userController.updateUserProfile);

// User settings
router.get('/settings', userController.renderUserSettings);

// User proof upload
router.post('/proof', userController.uploadUserProof);

// Receiver management
router.get('/receiver', userController.renderReceiverPage);
router.get('/load-bank', userController.loadBanks);
router.post('/confirm', userController.confirmBankDetails);
router.post('/addReceiver', userController.addReceiver);
router.post('/removeReceiver', userController.removeReceiver);

// Payment card management
router.post('/addCard', userController.addPaymentCard);
router.post('/removeCard', userController.removePaymentCard);

// Currency exchange
router.post('/exchange', userController.createExchange);

// Manual transaction
router.get('/manual', userController.manualTx);

module.exports = router;
