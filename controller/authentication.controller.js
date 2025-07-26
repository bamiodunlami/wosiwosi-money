// Import required modules
const appRoot = require('app-root-path'); // Handles app root path
const path = require('path'); // Node.js path module

// Set application root path
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath);

// Import custom modules using app root
const mailer = require(appRoot + '/util/mailer.js');
const mongo = require(appRoot + '/model/mongodb.js');
const User = mongo.User;
const passport = require(appRoot + '/util/passportAuth.js');

// Utility: Get current date for registration
const date = new Date();

/**
 * Render the login page
 */
const renderLoginPage = (req, res) => {
  res.render('login');
};

/**
 * Handle user login POST request
 */
const userLogin = async (req, res) => {
  // Authentication handled by passport middleware
  res.redirect('/dashboard');
};

/**
 * Handle user registration
 */
const userRegistration = async (req, res) => {
  // Prepare user details object
  const userDetails = {
    username: req.body.username,
    status: true,
    regDate: date.toJSON(),
    regTerm: true,
    regAs: '',
    profile: {
      fname: '',
      lname: '',
      phone: '',
      dob: '',
      street: '',
      postcode: '',
      city: '',
      country: '',
      Nationality: '',
    },
    proof: {
      sessionId: '',
      faceMatchResult: '',
    },
    cardDetails: [],
    receiver: [],
    transaction: [],
    resetLink: '',
    verifyMail: false,
  };

  const userMail = userDetails.username;
  // Generate verification link
  const verificationLink = `${req.protocol}://${req.get('host')}/veri?ref=${userMail}`;

  // Register user with password
  await User.register(userDetails, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    if (user) {
      // Log the user in after registration
      req.login(user, (err) => {
        if (err) {
          console.log('Login error after registration:', err);
          return res.redirect('/login');
        }
        // Optionally send welcome and verification emails here
        mailer.sendWelcome(userMail);
        mailer.emailVerification(userMail, verificationLink);
        res.redirect('/dashboard');
      });
    }
  });
};

/**
 * Handle password reset request
 */
const reset = async (req, res) => {
  // Find user by email
  User.findOne({ username: req.body.email }).then((user) => {
    if (!user) {
      return res.send('none');
    }
    // Generate random reset token
    const resetToken = Math.floor(Math.random() * 155200000008076564000);
    const resetLink = `${req.protocol}://${req.get('host')}/pcreset?ref=${resetToken}`;

    // Update user with reset token
    User.updateOne({ username: req.body.email }, { $set: { resetLink: resetToken } }).then((result) => {
      if (result.acknowledged) {
        // Send reset email
        mailer.resetMail(req.body.email, resetLink);
        res.send('true');
      }
    });
  });
};

/**
 * Render change password page
 */
const changePassword = async (req, res) => {
  res.render('change', {
    token: req.query.ref,
  });
};

/**
 * Handle new password submission
 */
const newpass = (req, res) => {
  // Find user by reset token
  User.findOne({ resetLink: req.body.ref }).then((user) => {
    if (!user) {
      return res.redirect('/login');
    }
    // Set new password
    user.setPassword(req.body.pass, (err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.redirect('/login');
      }
      updatedUser.save();
      // Invalidate reset token
      User.updateOne({ resetLink: req.body.ref }, { $set: { resetLink: 'none' } });
      res.redirect('/login');
    });
  });
};

/**
 * Resend verification email
 */
const resendVerification = (req, res) => {
  const verificationLink = `${req.protocol}://${req.get('host')}/veri?ref=${req.user.username}`;
  mailer.emailVerification(req.user.username, verificationLink);
  res.redirect('/dashboard');
};

/**
 * Handle email verification
 */
const mailVerified = (req, res) => {
  const email = req.query.ref;
  User.findOne({ username: email }).then((user) => {
    if (!user) return res.redirect('/dashboard');
    // Set verifyMail to true
    User.updateOne({ username: email }, { $set: { verifyMail: true } }).then(() => {
      res.render('success');
    });
  });
};

// Export controller functions
module.exports = {
  renderLoginPage,
  userLogin,
  userRegistration,
  reset,
  changePassword,
  newpass,
  resendVerification,
  mailVerified,
};
