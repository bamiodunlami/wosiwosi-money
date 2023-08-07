// Point the IDV Client at the sandbox by setting environment variable YOTI_IDV_API_URL to https://api.yoti.com/sandbox/idverify/v1

const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const mongo = require(appRoot + "/util/mongodb.js"); //mongo db and strategy module
const User = mongo.User;

const fs = require("fs");

let sessionReturn;

const {
  IDVClient,
  SessionSpecificationBuilder,
  RequestedDocumentAuthenticityCheckBuilder,
  RequestedLivenessCheckBuilder,
  RequestedTextExtractionTaskBuilder,
  RequestedFaceMatchCheckBuilder,
  SdkConfigBuilder,
  NotificationConfigBuilder,
} = require("yoti");

const YOTI_CLIENT_SDK_ID = process.env.CLIENT_SDK_ID;
const YOTI_PEM = fs.readFileSync(
  appRoot + "/keys/verification-access-security.pem"
);
const idvClient = new IDVClient(YOTI_CLIENT_SDK_ID, YOTI_PEM);

//Document Authenticity Check
const documentAuthenticityCheck =
  new RequestedDocumentAuthenticityCheckBuilder().build();

//Liveness check with 3 retries
const livenessCheck = new RequestedLivenessCheckBuilder()
  .forZoomLiveness()
  .withMaxRetries(3)
  .build();

//Face Match Check with manual check set to fallback
const faceMatchCheck = new RequestedFaceMatchCheckBuilder()
  .withManualCheckFallback()
  .build();

//ID Document Text Extraction Task with manual check set to fallback
const textExtractionTask = new RequestedTextExtractionTaskBuilder()
  .withManualCheckFallback()
  .build();

//Configuration for the client SDK (Frontend)
const sdkConfig = new SdkConfigBuilder()
  .withAllowsCameraAndUpload()
  .withPresetIssuingCountry("GBR")
  .withSuccessUrl("/vsuccess")
  .withErrorUrl("/verror")
  .build();

// Notification configuration
const notificationConfig = new NotificationConfigBuilder()
  .withEndpoint("https://yourdomain.example/idverify/updates")
  .withAuthToken("username:password")
  .forResourceUpdate()
  .forTaskCompletion()
  .forCheckCompletion()
  .forSessionCompletion()
  .withTopic("client_session_token_deleted")
  .build();

//Buiding the Session with defined specification from above
const sessionSpec = new SessionSpecificationBuilder()
  .withClientSessionTokenTtl(600)
  .withResourcesTtl(604800)
  .withUserTrackingId("some-user-tracking-id")
  .withRequestedCheck(documentAuthenticityCheck)
  .withRequestedCheck(livenessCheck)
  .withRequestedCheck(faceMatchCheck)
  .withRequestedTask(textExtractionTask)
  .withSdkConfig(sdkConfig)
  // .withNotifications(notificationConfig)
  .build();

//Create Session
const StartSession = (req, res) => {
  idvClient
    .createSession(sessionSpec)
    .then((session) => {
      const sessionId = session.getSessionId();
      sessionReturn = sessionId;
      // save user ID
      User.updateOne({ username: req.user.username}, {
        $set:{
          "proof.sessionId":sessionReturn
        }
      }).then(resp => console.log(resp));

      const clientSessionToken = session.getClientSessionToken();
      // const clientSessionTokenTtl = session.getClientSessionTokenTtl();
      res.render("verify", {
        title: "Verification",
        sessionID: sessionId,
        sessionToken: clientSessionToken,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Session result
// Returns a session result
const sessionResult = async (req, res) => {
  const id = await User.findOne({username:req.user.username})
  let userSessionId =  id.proof.sessionId
  // instant liveness check
  //   idvClient.getSession(userSessionId).then(session => {
  //   	// Returns a collection of liveness checks
  //   	const livenessChecks = session.getLivenessChecks();

  //     livenessChecks.map(check => {
  //         // Returns the id of the check
  //         const id = check.getId();

  //         // Returns the state of the check
  //         const state = check.getState();

  //         // Returns an array of resources used in the check
  //         const resourcesUsed = check.getResourcesUsed();

  //         // Returns the report for the check
  //         const report = check.getReport();

  //         // Returns the recommendation value, either APPROVE, NOT_AVAILABLE or REJECT
  //         const recommendation = report.getRecommendation().getValue();

  //         // Returns the report breakdown including sub-checks
  //         const breakdown = report.getBreakdown();

  //       	breakdown.forEach(function(breakdown) {
  //           // Returns the sub-check
  //           const subCheck = breakdown.getSubCheck();

  //           // Returns the sub-check result
  //           const subCheckResult = breakdown.getResult();
  //           console.log(subCheck)
  //         });
  //     })
  // }).catch(error => {
  //     // handle error
  // })

  // Returns a session result
  idvClient
    .getSession(userSessionId)
    .then((session) => {
      // Return specific check types
      const authenticityChecks = session.getAuthenticityChecks();
      const faceMatchChecks = session.getFaceMatchChecks();
      const textDataChecks = session.getTextDataChecks();
      const livenessChecks = session.getLivenessChecks();
      const watchlistScreeningChecks = session.getWatchlistScreeningChecks();
      const watchlistAdvancedCaChecks = session.getWatchlistAdvancedCaChecks();
      
      faceMatchChecks.map(check => {
        const report = check.getReport();
        const recommendation = report.getRecommendation().getValue();
        console.log(recommendation)
      });
      // console.log(faceMatchChecks[0].FaceMatchCheckResponse);
      // // console.log(livenessChecks.getBreakdown());
      res.redirect("/profile");
    })
    .catch((error) => {
      console.log(error);
    });

};

module.exports = {
  session: StartSession,
  result: sessionResult,
};
