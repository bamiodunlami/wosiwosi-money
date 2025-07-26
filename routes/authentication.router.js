const express = require('express');
const router = express.Router();

const appRoot = require('app-root-path');
const path = require('path');
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath);

const passport = require(`${appRoot}/util/passportAuth.js`);
const auth = require(`${appRoot}/controller/authentication.controller.js`);

// Login routes
router
  .route('/login')
  .get(auth.renderLoginPage)
  .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), auth.userLogin);

// Registration routes
router
  .route('/register')
  .get((req, res) => res.render('register'))
  .post(auth.userRegistration);

// Password routes
router.get('/forgetpass', (req, res) => res.render('forgetpassword'));
router.post('/reset', auth.reset);
router.get('/pcreset', auth.changePassword);
router.post('/newpass', auth.newpass);

// Verification routes
router.get('/resendVerification', auth.resendVerification);
router.get('/veri', auth.mailVerified);

module.exports = router;
