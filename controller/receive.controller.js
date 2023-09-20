const got = require ('got')

const appRoot = require("app-root-path");
const { response } = require("express");
const path = require("path");
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath);

const passport = require(appRoot + "/util/passportAuth.js");
const model = require(appRoot + "/model/mongodb.js");
const User = model.User;

// const newQReceive = model.QuickReceive
const mailer = require(appRoot + "/util/mailer.js");

date = new Date();

const renderReceive = (req, res) => {
  res.render("receive", {
    title: "Receive",
    user: req.user,
  });
};

// register user
const registerUser = async (req, res) => {
  const userDetails = {
    username: req.body.username,
    status: true,
    regDate: date.toJSON(),
    regTerm: true,
    regAs: "",
    profile: {
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      dob: "",
      street: "",
      postcode: "",
      city: "",
      country: "",
      Nationality: "",
    },
    proof: {
      sessionId: "",
      faceMatchResult: "",
    },
    cardDetails: [],
    receiver: [],
    transaction: [],
    resetLink: "",
    verifyMail: false,
  };
  const userMail = userDetails.username;
  const rootLin =
    req.protocol + "://" + req.get("host") + "/veri" + "?ref=" + userMail;
  await User.register(userDetails, req.body.password, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/receive");
    } else {
      mailer.sendWelcome(userMail);
      mailer.emailVerification(userMail, rootLin);
      res.redirect("/receive");
    }
  });
};

const receiveRequest = async (req, res) => {
  try {
    if (req.isAuthenticated()) {

      // console.log(req.body)
      const details={
        id:Math.floor(Math.random()*10921212),
        details:req.body
      }

      User.updateOne(
        { username: req.user.username },{
          $push: {
            receiveRequest: details,
          },
        }).then(respones => console.log())

        try {
          const response = await got.post("https://api.flutterwave.com/v3/payments", {
              headers: {
                  Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
              },
              json: {
                  tx_ref: details.id.toString(),
                  amount:req.body.receiveAmount,
                  currency: "NGN",
                  redirect_url: `http://localhost:3000/response`,
                  // meta: {
                  //     consumer_id: 23,
                  //     consumer_mac: "92a3-912ba-1192a"
                  // },
                  customer: {
                      email: req.user.username,
                      phonenumber:req.user.profile.phone,
                      name:`${req.user.profile.fname} ${req.user.profile.lname}`
                  },
                  customizations: {
                      title: "Wosiwosi",
                      // logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
                  }
              }
          }).json();
          res.redirect(response.data.link)
      } catch (err) {
          console.log(err.code);
          console.log(err.response.body);
      }
      // const userID = await User.findOne({ username: req.user.username });
      // const userIdVerify = userID.identity.bvnVerify;
      // if (userIdVerify === true) {
      //   res.render("/");
      // } else {
      //   res.render("verifybvn");
      // }
      // res.render('paymentPage', {
      //   checkuser:process.env.FLW_PUBLIC_KEY,
      //   userName:req.user.username,
      //   userf:`${req.user.profile.fname}`,
      //   tref:'wosi_you',
      //   amount:req.body.receiveAmount,
      //   currency:'NGN',
      //   redirect:'localhost:3000/receive'
      // })
    } else {
      res.redirect("/receive");
    }
  } catch (e) {}
};

const receivePaymanetResponse = async (req, res) =>{
  try{
// console.log(req.query)
    const status = req.query.status
    if(status !="success"){
      res.redirect('/receive')
      mailer.receiveFail(req.user.username, req.user.profile.fname, req.query.tx_ref)
    } else{
      res.redirect('/success')
      mailer.receiveSuccess(req.user.username, req.user.profile.fname, req.query.tx_ref)
      mailer.receiveSuccessAdmin("seyiawo@wosiwosi.co.uk", req.user.profile.fname, req.user.profile.lname, req.user.identity.bvnVerify, req.query.tx_ref)
      if(req.user.identity.bvnVerify === false){
        mailer.sendIdentity(req.user.username, req.user.profile.fname)
      }else{}
    }

  }catch(e){
    console.log(e)
  }
}


// const verifyBVN = (req, res) => {
//   console.log(req.body);
// };

// const qreceive = (req, res)=>{
//         res.render('ngntogbpform', {
//             title: "Quick Receive",
//             user: req.user
//         })
// }

// const qreceiveRequest = (req, res)=>{
//     const newQucikReceive = new newQReceive({
//         fname: req.body.fname,
//         lname: req.body.lname,
//         address: req.body.address,
//         postcode: req.body.postcode,
//         phone: req.body.phone,
//         email: req.body.email,
//         ukBank: req.body.ukBank,
//         ukaccount: req.body.ukaccount,
//         sortCode: req.body.sortCode,
//         nameOnAccount: req.body.nameOnAccount,
//         description: req.body.description,
//         bvn: req.body.bvn,
//         docLink_1:'link1',
//         dockLink_2:'link2'
//     })
//     newQucikReceive.save()
//     .then((response) =>{
//         mailer.quickReceive(req.body.email, req.body.fname)
//         mailer.adminQuickReceive("seyiawo@wosiwosi.co.uk", req.body.fname, req.body.fname, req.body.lname, req.body.address, req.body.postcode, req.body.phone, req.body.email, req.body.ukBank, req.body.ukaccount, req.body.sortCode, req.body.nameOnAccount, req.body.description, req.body.bvn, "wosiwosi.co.uk")
//         res.render('success')
//     })
// };

module.exports = {
  receivePage: renderReceive,
  registerUser: registerUser,
  receiveRequest: receiveRequest,
  receivePaymanetResponse:receivePaymanetResponse
  // verifyEmail: verifyEmail,
  // verifyBVN: verifyBVN,
  //   quickReceive:qreceive,
  //   quickReceiveRequest:qreceiveRequest
};
