const express = require("express");
const router = new express.Router();

const multer = require("multer");

const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const dash = require(appRoot + "/controller/dashboard.controller.js"); //mongo db and strategy module
const renderDashboard = dash.renderDashboard;
const renderUserProfile = dash.renderUserProfile;
const updateUserProfile = dash.updateUserProfile;
const renderUserSettings = dash.renderUserSettings;
const uploadUserProof = dash.uploadUserProof;
const renderReceiverPage = dash.renderReceiverPage;
const loadBank = dash.loadBank;
const confirmBankDetails = dash.confirmBankDetails;
const addReceiver = dash.addReceiver;
const removeReceiver = dash.removeReceiver;
const addPaymentCard = dash.addPaymentCard;
const removePaymentCard = dash.removePaymentCard;
const createExchange = dash.createExchange;

// // handle file storate
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, appRoot + "/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${req.user.username}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage }).fields([
//   { name: "id", maxCount: 1 },
//   { name: "poa", maxCount: 1 },
// ]);

//render dashboard
router.get("/dashboard", renderDashboard);

//handle profile request
router.get("/profile", renderUserProfile);

//userProfile Update
router.post("/profileUpdate", updateUserProfile);

//render user settings
router.get("/settings", renderUserSettings);

//upload  user proof
router.post("/proof", uploadUserProof);

//render receiver page
router.get("/receiver", renderReceiverPage);

// load bank name
router.post("/loadbank", loadBank);

//confirm bank details
router.post("/confirm", confirmBankDetails);

//add reveiver
router.post("/addReceiver", addReceiver);

//remove receivers
router.post("/removeReceiver", removeReceiver);

// Add Card
router.post("/addCard", addPaymentCard);

//remove card
router.post("/removeCard", removePaymentCard);

// handle exchange request
router.post("/exchange", createExchange);

module.exports = router;
