const express = require ('express');
const router = express.Router();

const appRoot = require('app-root-path'); //installed via npm
const path = require('path'); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const passport= require (appRoot + '/util/passportAuth.js');

const auth= require (appRoot + '/controller/authentication.controller.js');
const renderLoginPage=  auth.renderLoginPage
const userRegistration = auth.userRegistration


router.get('/login', renderLoginPage)

router.post('/login', passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}),(req, res)=>{
    res.redirect('/dashboard')
});

router.get('/register', (req, res)=>{
    res.render('register')
})

router.get('/forgetpass', (req, res)=>{
    res.render('forgetpassword')
})

router.post('/register', userRegistration);

module.exports=router