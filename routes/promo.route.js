const express = require ('express')
const router = new express.Router()
const appRoot = require ('app-root-path');
const path = require ('path')
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath)

const promo = require (appRoot+ '/controller/promo.controller.js')

router.post('/checkCode', promo.checkReferalCode)

module.exports=router