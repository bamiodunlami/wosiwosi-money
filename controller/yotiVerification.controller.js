// Point the IDV Client at the sandbox by setting environment variable YOTI_IDV_API_URL to https://api.yoti.com/sandbox/idverify/v1
const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

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
      sessionReturn = sessionId
      const clientSessionToken = session.getClientSessionToken();
      const clientSessionTokenTtl = session.getClientSessionTokenTtl();
      res.render("verify", {
        title:"Verification",
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

// // Returns a session result
// idvClient.getSession(sessionReturn).then(session => {
//     // Returns the session state
//     const state = session.getState();
    
//     // Returns session resources
//     const resources = session.getResources();

//     // Returns all checks on the session
//     const checks = session.getChecks();

//     // Return specific check types
//     const authenticityChecks = session.getAuthenticityChecks();
//     const faceMatchChecks = session.getFaceMatchChecks();
//     const textDataChecks = session.getTextDataChecks();
//     const livenessChecks = session.getLivenessChecks();
//     const watchlistScreeningChecks = session.getWatchlistScreeningChecks();
//     const watchlistAdvancedCaChecks = session.getWatchlistAdvancedCaChecks();
  
//     // Returns biometric consent timestamp
//     const biometricConsent = session.getBiometricConsentTimestamp();
//     res.render("/")
    
// }).catch(error => {
//     console.log(error)
// })

try {
    const sessionResult = await idvClient.getSession(sessionReturn);
    res.render('verifySuccess', { sessionResult});
  } catch (error) {
    res.render('verifyFail', { error });
  }

};

module.exports = {
  session: StartSession,
  result: sessionResult,
};
