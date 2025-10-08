// Import required modules
const appRoot = require('app-root-path');
const path = require('path');

// Set the application root path
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath);

// Import utility and database modules using the app root path
const mailer = require(appRoot + '/util/mailer.js');
const mongo = require(appRoot + '/model/mongodb.js');
const User = mongo.User;

// Render the home page
const home = (req, res) => {
  res.render('index', {
    title: 'Wosiwosi Money | Fast, secured and good rate',
    user: req.user,
  });
};

// Handle rate endpoint (currently just logs the request and sends an empty response)
const rate = (req, res) => {
  console.log(req);
  res.send();
};

// Render the privacy policy page
const privacy = (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy',
    user: req.user,
  });
};

// Render the terms of use page
const term = (req, res) => {
  res.render('terms', {
    title: 'Terms of use',
    user: req.user,
  });
};

// Render the contact page
const contact = (req, res) => {
  res.render('contact', {
    title: 'Contact',
    user: req.user,
  });
};

// Export controller functions
module.exports = {
  rate,
  home,
  privacy,
  term,
  contact,
};
