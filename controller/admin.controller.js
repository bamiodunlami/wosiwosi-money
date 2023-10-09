const appRoot = require("app-root-path"); //installed via npm
const { response } = require("express");
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set pat

const date = new Date();

const mongo = require(appRoot + "/model/mongodb");
const User = mongo.User;
const Transaction = mongo.Transaction;
const Rate = mongo.ExRate;

const flw = require(appRoot + "/util/flutterWave.js"); //flutter module
const mailer = require(appRoot + "/util/mailer.js"); //flutter module

// Render admin Page
const renderPage = async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.regAs != "admin") {
      req.session.destroy();
      res.redirect("/adminlog");
    } else {
      // render transaction, customer and exchange rate
      const regUser = await User.find();
      const rate = await Rate.findOne();
      const transaction = await Transaction.find();
      res.render("admin/adminDash", {
        user: req.user,
        transaction: transaction,
        rate: rate,
        regUser: regUser,
      });
    }
  } else {
    res.redirect("/adminlog");
  }
};

// render login
const adminLogin = (req, res) => {
  res.render("admin/adminLog", {
    message: "",
  });
};

// admin Registration
const register = (req, res) => {
  console.log(req.body);
  const date = new Date();
  const adminDetails = {
    username: req.body.username,
    status: false,
    regDate: date.toJSON(),
    regAs: "admin",
    profile: {
      fname: req.body.fname,
      lname: req.body.laname,
    },
  };
  User.register(adminDetails, req.body.password, (err, success) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/adminLog", {
        message: "Kindly wait while you are activated",
      });
    }
  });
};

// exchange rete
const rate = (req, res) => {
  if (req.isAuthenticated()) {
    // update rate in db
    Rate.updateOne({
      GBPTONGN: req.body.NGN,
      GBPTOGHS: req.body.GHS,
      GBPTOKEN: req.body.KEN,
      NGNTOGBP: req.body.NGNTOGBP,
    }).then((result) => res.redirect(req.headers.referer));
  } else {
    res.redirect("/");
  }
};

// verify transaction
const tVerify = (req, res) => {
  if (req.isAuthenticated()) {
    const payload = { id:req.body.id};
    if (req.body.id == "") {
    } else {
      flw.Transfer.get_a_transfer(payload).then((response) => {
        console.log(response)
        res.send(response);
      });
    }
  } else {
    res.redirect("/adminLog");
  }
};

// Manaual Tranaction
const manualTransaction = (req, res) => {
  try {
    // Upadate user transaction
    const userTransactionUpdate = User.updateOne(
      { username: req.body.customerMail },
      {
        $push: {
          transaction: {
            date: date.toJSON().slice(0, 10),
            time: date.toJSON().slice(11, 15),
            currencyPair: "GBPTONGN",
            sendCurrency: "GBP",
            sendAmount: req.body.gbpAmount,
            takeCurrency: "NGN",
            takeAmount: req.body.nairaAmount,
            rate: req.body.rate,
            promo: "0",
            paymentStatus: "Success",
            sendStatus: "Sucess",
            sender: "manual transaction",
            reciever: "manual transaction",
            receiverAcct: req.body.accountName,
            senderAcct: "manual",
            ref: "manual transaction",
            flwId: "manual transaction",
          },
        },
      }
    )

    //update general transaction db
    const SaveTransaction = new Transaction({
      details: [
        {
          date: date.toJSON().slice(0, 10),
          time: date.toJSON().slice(11, 15),
          currencyPair: "GBPTONGN",
          sendCurrency: "GBP",
          sendAmount: req.body.gbpAmount,
          takeCurrency: "NGN",
          takeAmount: req.body.nairaAmount,
          rate: req.body.rate,
          promo: "0",
          paymentStatus: "Success",
          sendStatus: "Sucess",
          sender: "manual transaction",
          reciever: "manual transaction",
          receiverAcct: req.body.accountName,
          senderAcct: "manual",
          ref: "manual transaction",
          flwId: "manual transaction",
        },
      ],
    })

    Promise.all([userTransactionUpdate, SaveTransaction.save()])
    .then((result)=>{
      res.redirect('/')
    });

  } catch (e) {}
};

// singlePage
const singlePage = async (req, res) =>{
  if(req.isAuthenticated()){
  await User.findOne({username:req.query.username})
  .then((response)=>{
    // console.log(response.receiveRequest)
    res.render('admin/singlepage', {
      data:response,
      user:req.user
    })
  })
}else{
  res.redirect('/login')
}
}

const sendMail = async (req, res) =>{
  console.log(req.body)
  mailer.sendeMail(req.body.receiver, req.body.subject, req.body.name, req.body.body)
  res.redirect(req.headers.referer)
}

//  block user
const blockUser = async (req, res) =>{
    if(req.isAuthenticated()){
    User.updateOne({username:req.body.receiver},{
      $set:{
        status:false
      }
    }).then(response => res.redirect(req.headers.referer))
  }else{
    res.redirect('/login')
  }
}

// unblockUser
const unblockUser = async (req, res) =>{
  if(req.isAuthenticated()){
  User.updateOne({username:req.body.receiver},{
    $set:{
      status:true
    }
  }).then(response => res.redirect(req.headers.referer))
}else{
  res.redirect('/login')
}
}


module.exports = {
  renderAdminPage: renderPage,
  renderAdminLogin: adminLogin,
  adminRegistration: register,
  updateRate: rate,
  verify: tVerify,
  manualTransaction: manualTransaction,
  singlePage:singlePage,
  sendMail:sendMail,
  blockUser:blockUser,
  unblockUser:unblockUser
};
