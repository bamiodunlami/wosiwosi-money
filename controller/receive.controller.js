const appRoot = require("app-root-path");
const path = require("path");
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath);

const passport = require(appRoot + "/util/passportAuth.js");
const model = require(appRoot + "/model/mongodb.js");
const User = model.User;

// const newQReceive = model.QuickReceive
const mailer = require(appRoot + "/util/mailer.js");

date = new Date()

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
  const userMail=userDetails.username
  const rootLin= req.protocol + '://' + req.get('host') + "/veri" + "?ref=" + userMail
  await User.register(userDetails, req.body.password, (err)=>{
    if (err) {
      console.log(err);
       res.redirect('/receive')
      } else {        
        mailer.sendWelcome(userMail);       
        mailer.emailVerification(userMail, rootLin)
        res.redirect('/receive')
      }
  })
};

const receiveRequest = async (req, res) =>{
  try{
    if(req.isAuthenticated()){
      console.log(req.body)
      console.log(req.user.profile.fname)
      // res.render('paymentPage', {
      //   checkuser:process.env.FLW_PUBLIC_KEY,
      //   userName:req.user.username,
      //   userf:`${req.user.profile.fname}`,
      //   tref:'wosi_you',
      //   amount:req.body.receiveAmount,
      //   currency:'NGN',
      //   redirect:'localhost:3000/receive'
      // })
      
    }else{
      res.redirect('/receive')
    }
  }catch(e){}
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
  receiveRequest:receiveRequest
  // verifyEmail: verifyEmail,
  // verifyBVN: verifyBVN,
//   quickReceive:qreceive,
//   quickReceiveRequest:qreceiveRequest
};
