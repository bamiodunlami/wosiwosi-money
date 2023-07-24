const express = require ('express')
const router = new express.Router();

const appRoot = require('app-root-path'); //installed via npm
const path = require('path'); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const passport = require (appRoot + '/util/passportAuth');

const session = require ('express-session'); 

router.use (session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}));

const admin = require (appRoot + '/controller/admin.controller.js');
const renderAdminPage = admin.renderAdminPage
const renderAdminLogin =  admin.renderAdminLogin
const adminRegistration =  admin.adminRegistration
const updateRate =  admin.updateRate


//render Admin Page
router.get('/admin', renderAdminPage);

//admin login
router.route('/adminlog')
.get(renderAdminLogin)

//admin login post request
.post(passport.authenticate('local', {failureRedirect:'/adminlog', failureFlash:true}), (req, res)=>{
    res.redirect('/admin');
});

router.get('/adminlogout', (req, res)=>{
    req.logout((err)=>{
        if(err){}
        res.redirect('/adminlog')
     });
})

//admin registration
router.post('/adminreg', adminRegistration);


//update rate
router.post('/updaterate', updateRate )

module.exports=router;