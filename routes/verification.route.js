const express = require("express");
const router = new express.Router();

const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const verify = require(appRoot + "/controller/yotiVerification.controller.js"); //mongo db and strategy module
const createSession = verify.session
const sessionResult = verify.result

router.get('/verify', createSession );

router.get('/vsuccess', (req, res) =>{
    sessionResult
    res.render('verifySuccess')
});

router.get('/verror', (req, res) =>{
    sessionResult
    res.render('verifyFail')
});

router.get('/idv', sessionResult);

module.exports=router