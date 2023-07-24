const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set pat

const date = new Date();

const mongo = require(appRoot + "/util/mongodb");
const User = mongo.User;
const Transaction = mongo.Transaction;
const Rate = mongo.ExRate;

// Render admin Page
const renderPage = async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.regAs != "admin") {
      req.session.destroy();
      res.redirect("/adminlog");
    } else {
      // render transaction, customer and exchange rate
      await Transaction.find().then((result) => {
        // get exchange rate
        Rate.findOne({}).then((rate) => {
          res.render("adminDash", {
            user: req.user,
            transaction: result,
            rate: rate,
          });
        });
      });
    }
  } else {
    res.redirect("/adminlog");
  }
};

// render login
const adminLogin = (req, res) => {
  res.render("adminLog", {
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
      res.render("adminLog", {
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
    }).then((result) => res.redirect(req.headers.referer));
  } else {
    res.redirect("/");
  }
};

module.exports = {
  renderAdminPage: renderPage,
  renderAdminLogin: adminLogin,
  adminRegistration: register,
  updateRate: rate,
};
