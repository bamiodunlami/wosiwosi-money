const express = require ('express')
const router = new express.Router();

const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const rate =require (appRoot + `/controller/exRate.controller.js`);//mongo db and strategy module
const exchangeRate = rate.exchangeRate


router.get('/rate', exchangeRate)

module.exports=router

