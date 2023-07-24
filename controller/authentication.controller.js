const appRoot = require("app-root-path"); //installed via npm
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

const mongo = require(appRoot + "/util/mongodb.js");
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
    status: false,
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
      value: "",
      idenity: [],
    },
    cardDetails: [],
    receiver: [],
    transaction: [],
  };
  await User.register(userDetails, req.body.password, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
};

module.exports = {
  renderLoginPage: login,
  userRegistration: register,
};
