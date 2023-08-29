const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const mailer = require(appRoot + "/util/mailer.js")
const mongo = require(appRoot + "/model/mongodb.js");
const User = mongo.User;

const date = new Date();

// Render Login
const login = (req, res) => {
  res.render("login");
};

// registration
const register = async (req, res) => {
  const userDetails = {
    username: req.body.username,
    status: true,
    regDate: date.toJSON(),
    regTerm: true,
    regAs: "",
    profile: {
      fname: "",
      lname: "",
      phone: "",
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
    resetLink:""
  };
  const userMail=userDetails.username
  await User.register(userDetails, req.body.password, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      mailer.sendWelcome(userMail);
      res.redirect("/login");
    }
  });
};

// reset password
const resetPassword = async (req, res)=>{
   User.findOne({username:req.body.email})
   .then((response)=>{
    if(response == null){
      res.send("none")
    }else{
      const rands=Math.floor(Math.random()*155200000008076564000);
      const rootLin= req.protocol + '://' + req.get('host') + "/pcreset" + "?ref=" + rands
      User.updateOne({username:req.body.email}, {
        $set:{
          resetLink:rands
        }
      }).then((resp)=>{
        if(resp.acknowledged == true){
          mailer.resetMail(req.body.email, rootLin);
          res.send("true");
        } 
      })
    }
   })
}

// change password
const changePassword = async (req, res) =>{
  User.updateOne({resetLink:req.query.ref},{
    $set:{
      resetLink:Math.floor(Math.random()*121)
    }
  }).then(response => (console.log(response)))
  res.render('change',{
    token:req.query.ref
  })
}

// new pass 
const newpass = (req, res)=>{
  User.findOne({resetLink:req.body.ref})
  .then((response)=>{
      response.setPassword(req.body.pass, (err, user)=>{
        if(err) console.log(err)
        user.save()
        res.redirect('/login');
      })

  })

}

module.exports = {
  renderLoginPage: login,
  userRegistration: register,
  reset:resetPassword,
  changePassword:changePassword,
  newpass:newpass
};
