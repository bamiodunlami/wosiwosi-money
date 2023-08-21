const express = require ('express')
const router = new express.Router();

const appRoot = require ('app-root-path');
const path = require ('path');
const rootPath = path.resolve(process.cwd())
appRoot.setPath(rootPath)

const passport = require(appRoot + '/util/passportAuth.js')
const receive =  require (appRoot + '/controller/receive.controller.js')

router.get('/receive', receive.receivePage )
router.post('/receive', receive.request)

// quick receive
router.get('/qreceive', receive.quickReceive )
router.post('/qreceive', receive.quickReceiveRequest)

module.exports = router