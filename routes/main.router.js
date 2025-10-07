// Import required modules
const express = require('express');
const router = express.Router();

const appRoot = require('app-root-path');
const path = require('path');

// Set the application root path
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath);

// Import main controller
const main = require(appRoot + '/controller/main.controller.js');

// Home route
// router.get('/', main.home);

// Send today's rate
router.get('/callback', main.rate);

// Success page
router.get('/success', (req, res) => {
  res.render('success');
});

// Failure page
router.get('/fail', (req, res) => {
  res.render('fail');
});

// Privacy policy page
router.get('/privacy', main.privacy);

// Terms and conditions page
router.get('/terms', main.term);

// Contact page
router.get('/contact', main.contact);

// Handle logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    // Optionally handle error
    res.redirect('/');
  });
});

// Export the router
module.exports = router;
