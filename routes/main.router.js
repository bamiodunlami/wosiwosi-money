const express  = require ("express");
const router = new express.Router()

const appRoot =  require ('app-root-path');
const path = require ('path')
const rootPath = path.resolve(process.cwd())
appRoot.setPath(rootPath); //set path

const main = require(appRoot + "/controller/main.controller.js");

// Home route
router.get('/', (req, res)=>{
    res.render('index', {
        title: "Home",
        user:req.user
    });
});

// send today rate
router.post('/callback', main);

//success
router.get('/success', (req, res)=>{
    res.render('success')
})

//success
router.get('/fail', (req, res)=>{
    res.render('fail')
})

//handle logout
router.get("/logout", function (req, res) {
    req.logout((err) => {
      if (err) {
      }
      res.redirect("/");
    });
});

module.exports=router