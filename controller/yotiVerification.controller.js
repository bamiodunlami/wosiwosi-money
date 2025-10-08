// Point the IDV Client at the sandbox by setting environment variable YOTI_IDV_API_URL to https://api.yoti.com/sandbox/idverify/v1

const appRoot = require('app-root-path'); //installed via npm
const path = require('path'); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const mailer = require(appRoot + '/util/mailer.js');
const mongo = require(appRoot + '/model/mongodb.js'); //mongo db and strategy module
const User = mongo.User;

const fs = require('fs');

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
} = require('yoti');

const YOTI_CLIENT_SDK_ID = process.env.CLIENT_SDK_ID;
const YOTI_PEM = fs.readFileSync(appRoot + '/keys/yoti-sec-key.pem');
const idvClient = new IDVClient(YOTI_CLIENT_SDK_ID, YOTI_PEM);

//Document Authenticity Check
const documentAuthenticityCheck = new RequestedDocumentAuthenticityCheckBuilder().build();

//Liveness check with 3 retries
const livenessCheck = new RequestedLivenessCheckBuilder().forZoomLiveness().withMaxRetries(3).build();

//Face Match Check with manual check set to fallback
const faceMatchCheck = new RequestedFaceMatchCheckBuilder().withManualCheckFallback().build();

//ID Document Text Extraction Task with manual check set to fallback
const textExtractionTask = new RequestedTextExtractionTaskBuilder().withManualCheckFallback().build();

//Configuration for the client SDK (Frontend)
const sdkConfig = new SdkConfigBuilder()
    .withPresetIssuingCountry('GBR')
    .withSuccessUrl('https://app.wosiwosimoney.com/vsuccess')
    .withErrorUrl('https://app.wosiwosimoney.com/verror')
    .build();

// Notification configuration
const notificationConfig = new NotificationConfigBuilder()
  .withEndpoint("https://app.wosiwosimoney.com")
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
  .withUserTrackingId('some-user-tracking-id')
  .withRequestedCheck(documentAuthenticityCheck)
  .withRequestedCheck(livenessCheck)
  .withRequestedCheck(faceMatchCheck)
  .withRequestedTask(textExtractionTask)
  .withSdkConfig(sdkConfig)
  .withNotifications(notificationConfig)
  .build();

//Create Session
const StartSession = (req, res) => {
  if (req.isAuthenticated()) {
    // console.log(sdkConfig)
    idvClient
      .createSession(sessionSpec)
      .then((session) => {
        const sessionId = session.getSessionId();
        sessionReturn = sessionId;

        console.log(sessionId)

        // save user ID
        User.updateOne(
          { username: req.user.username },
          {
            $set: {
              'proof.sessionId': sessionReturn,
            },
          }
        ).then((result) => console.log(result.acknowledged));

        const clientSessionToken = session.getClientSessionToken();
        
        // const clientSessionTokenTtl = session.getClientSessionTokenTtl();
        res.render('verify', {
          title: 'Verification',
          sessionID: sessionId,
          sessionToken: clientSessionToken,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/login');
  }
};

// Session result
const sessionResult = async (req, res) => {
  if (req.isAuthenticated()) {
    console.log("first gate")
    const id = await User.findOne({ username: req.user.username });
    let userSessionId = id.proof.sessionId;
    console.log(userSessionId)
    // Returns a session result
    idvClient
      .getSession(userSessionId)
      .then((session) => {
        // console.log(session);
        // Return specific check types
        const authenticityChecks = session.getAuthenticityChecks();
        const faceMatchChecks = session.getFaceMatchChecks();
        // const textDataChecks = session.getTextDataChecks();
        const livenessChecks = session.getLivenessChecks();
        const watchlistScreeningChecks = session.getWatchlistScreeningChecks();
        const watchlistAdvancedCaChecks = session.getWatchlistAdvancedCaChecks();
        faceMatchChecks.map((check) => {
          const report = check.getReport();
          console.log(report)
          const recommendation = report.getRecommendation().getValue();
          if (recommendation == 'APPROVE') {
            mailer.sendApprove(req.user.username);
          }else{
            res.redirect('verror')
          }
          // save Result
          User.updateOne(
            { username: req.user.username },
            {
              $set: {
                'proof.faceMatchResult': recommendation,
              },
            }
          ).then(res.redirect('/dashboard'));
        });
      })
      .catch((error) => {
        console.log(error);
        res.redirect('/dashboard');
      });
  } else {
    res.redirect('/login');
  }
};

module.exports = {
  session: StartSession,
  sessionResult
};
