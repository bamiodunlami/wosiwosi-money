const appRoot = require("app-root-path"); //installed via npm
const { response } = require("express");
const path = require("path"); //default module
const rootPath = path.resolve(process.cwd()); //production usable for path root
appRoot.setPath(rootPath); //set path

// const fs = require("fs");

const flw = require(appRoot + "/util/flutterWave"); //flutter module

const stripe = require(appRoot + "/util/stripe.js"); //stripe

const passport = require(appRoot + "/util/passportAuth");

const mailer = require(appRoot + "/util/mailer.js");

// const mailer = require (appRoot + '/api/mailer.js');
// const sendWelcome = mailer.sendWelcome

const mongo = require(appRoot + "/model/mongodb.js"); //mongo db and strategy module
const User = mongo.User;
const Transaction = mongo.Transaction;

const date = new Date();

// render dashboard
const dashboard = (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ username: req.user.username }).then((result) => {
      let transaction = result.transaction;
      if (transaction.length > 0) {
        let lastTransaction = transaction.length - 1;
        let lastTransactionId = transaction[lastTransaction].flwId.toString();
        console.log(typeof lastTransactionId);

        res.render("dashboard", {
          user: req.user,
        });
        // const payload = {"id": lastTransactionId}
        // flw.Transaction.event(payload).then(response => console.log(response))
      } else {
        res.render("dashboard", {
          user: req.user,
        });
      }
    });
  } else {
    res.redirect("/login");
  }
};

//   render user progile
const userProfile = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      await User.find({ username: req.user.username }).then((response) => {
        // console.log(response);
        // console.log(req.user)
        res.render("prof", { user: req.user });
      });
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
  }
};

//   Update user profile
const updateUser = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      //update user
      await User.updateOne(
        { username: req.user.username },
        {
          $set: {
            profile: {
              fname: req.body.fname,
              lname: req.body.lname,
              phone: req.body.phone,
              dob: req.body.dob,
              street: req.body.address,
              postcode: req.body.postCode,
              city: req.body.city,
              country: req.body.residence,
              Nationality: req.body.nationality,
            },
          },
        }
      ).then((response) => {
        if (response.acknowledged == true) {
          res.send(true);
        }
        // else
      });
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
};

// render user settings page
const userSettings = async (req, res) => {
  if (req.isAuthenticated()) {
    await User.find({ username: req.user.username }).then((response) => {
      res.render("settings", { user: req.user });
    });
  } else {
    res.redirect("/");
  }
};

// upload user prooof
const userProof = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.redirect("/verify");
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
  }
};

// render receiver page
const receiverPage = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("rec", {
      receiver: req.user.receiver,
      card: req.user.cardDetails,
    });
  } else {
    res.redirect("/login");
  }
};

//   load bank
const banks = (req, res) => {
  try {
    let request = require("request");
    let options = {
      method: "GET",
      url: "https://api.flutterwave.com/v3/banks/NG",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    };
    return request(options, function (error, response) {
      if (error) throw new Error(error);
      let banks = response.body;
      // sort bank
      try {
        const bankJson = JSON.parse(banks);
        const parseBank = bankJson.data;
        parseBank.sort((a, b) => a.name.localeCompare(b.name)); // Replace 'name' with the property you want to sort by
        res.send(JSON.stringify(parseBank, null, 2));
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
};

//   confirm bank details
const bankDetails = async (req, res) => {
  try {
    const payload = {
      account_number: req.body.accountNumber,
      account_bank: req.body.bankCode,
    };
    const response = await flw.Misc.verify_Account(payload);
    // console.log(response);
    res.json(response);
  } catch (e) {
    // console.log(e);
    res.redirect("/");
  }
};

// save reveiver details
const receiverDetails = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      await User.updateOne(
        { username: req.user.username },
        {
          $push: {
            receiver: req.body,
          },
        }
      ).then((response) => {
        res.send(response);
      });
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
};

// remove reveiver details
const removeReceiverDetails = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      // console.log(req.body)
      await User.updateOne(
        { username: req.user.username },
        {
          $pull: {
            receiver: { acctNumber: req.body.accontDetails },
          },
        }
      ).then((response) => {
        if (response.acknowledged == true) {
          res.send(true);
          // res.redirect('/receiver')
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
  }
};

// add payment card
const addCard = async (req, res) => {
  if (req.isAuthenticated()) {
    const cardInfo = {
      object: "card",
      number: req.body.cardNumber, // Card number
      exp_month: req.body.expDate.slice(0, 2), // Expiration month (2-digit)
      exp_year: req.body.expDate.slice(3, 5), // Expiration year (4-digit)
      cvc: req.body.cvv, // CVC code
    };

    await stripe.customers.create(
      {
        name: req.body.cardName,
        email: req.user.username,
        source: cardInfo,
      },
      (err, customer) => {
        if (err) {
          // if there's  error in adding card
          console.log(err.message);
          res.send(false);
        } else {
          // if ther's no error in adding card
          infoToSave = {
            cardNumberEnding: req.body.cardNumber.slice(13, 16),
            cardOwner: req.body.cardName,
            customerOwner: customer.id,
          };

          User.updateOne(
            { username: req.user.username },
            {
              $push: {
                cardDetails: infoToSave,
              },
            }
          ).then((response) => {
            res.redirect(req.headers.referer);
          });
        }
      }
    );
  } else {
    res.redirect("/");
  }
};

//   remove payment card
const removeCard = async (req, res) => {
  try {
    const cardValue = {};
    await User.updateOne(
      { username: req.user.username },
      {
        $pull: {
          cardDetails: {
            cardNumberEnding: req.body.cardLastDigit,
            cardOwner: req.body.nameOnCard,
          },
        },
      }
    ).then((response) => {
      res.send(true);
    });
  } catch (e) {
    console.log(e);
  }
};

//   create Exchange
const exchange = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      // console.log(req.body);
      let SelectedCard = req.body.cardEnding.slice(13, 16); //card selected
      // console.log(req.body.takeAmount)
      let paymentCard, cardToken;
      let savedCard = req.user.cardDetails; //retreive user saved card
      for (let i = 0; i < savedCard.length; i++) {
        paymentCard = savedCard[i].cardNumberEnding; //select the card user choose
        cardToken = savedCard[i].customerOwner; //select the user stripe token

        if (paymentCard == SelectedCard) {
          cardToken = cardToken; //save token to token

          //stipe charge customer
          stripe.charges.create(
            {
              amount: req.body.sendAmount, // Charge amount in cents
              currency: req.body.sendCurrency, //Currency
              description: "Wosiwosi Pay", //description
              customer: cardToken,
            },
            function (err, charge) {
              if (err) {
                // transaction fail
                console.error(err.message);
                console.log("Stripe fail");

                //upate user transaction
                const userTransactionUpdate = User.updateOne(
                  { username: req.user.username },
                  {
                    $push: {
                      transaction: {
                        date: date.toJSON().slice(0, 10),
                        time: date.toJSON().slice(11, 15),
                        currencyPair: req.body.currencyPair,
                        sendCurrency: req.body.sendCurrency,
                        sendAmount: req.body.sendAmount,
                        takeCurrency: req.body.takeCurrency,
                        takeAmount: req.body.takeAmount,
                        rate: req.body.Base,
                        paymentStatus: "failed",
                        sendStatus: "Failed",
                        sender: req.user.profile.fname,
                        reciever: req.body.receiverName,
                        receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                        senderAcct: req.body.cardEnding,
                        ref: req.body.ref,
                      },
                    },
                  }
                );

                //update general transaction db
                const SaveTransaction = new Transaction({
                  details: [
                    {
                      date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
                      time: date.getTime(),
                      currencyPair: req.body.currencyPair,
                      sendCurrency: req.body.sendCurrency,
                      sendAmount: req.body.sendAmount,
                      takeCurrency: req.body.takeCurrency,
                      takeAmount: req.body.takeAmount,
                      rate: req.body.Base,
                      paymentStatus: "failed",
                      sendStatus: "Failed",
                      sender: req.user.profile.fname,
                      reciever: req.body.receiverName,
                      receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                      senderAcct: req.body.cardEnding,
                      ref: req.body.ref,
                    },
                  ],
                });

                //update database
                Promise.all([
                  userTransactionUpdate,
                  SaveTransaction.save(),
                ]).then((results) => {
                  res.send("false");
                });
              } else {
                console.log("strip charge succesful");
                // console.log(req.protocol + '://' + req.get('host') + "/callback" + "?username=" + req.user.username + "&ref=" + req.body.ref)
                // Stipe Charge was successful
                //activate flutter to send
                const details = {
                  account_bank: req.body.bankCode,
                  account_number: req.body.accountNumber,
                  amount: req.body.takeAmount, //amount converted to
                  narration: "Wosiwosi Pay",
                  currency: req.body.takeCurrency,
                  reference: req.body.ref,
                  // callback_url:req.protocol + 's://' + req.get('host') + "/c" + "?u=" + req.body.ref,
                  debit_currency: req.body.takeCurrency,
                };

                // console.log(details)

                flw.Transfer.initiate(details) //start the Flutter transaction
                  .then((result) => {
                    console.log(result);
                    iden = result.data.id.toString();
                    const payload = { id: `${iden}` };
                    console.log(payload);
                    flw.Transaction.event(payload).then((response) =>
                      console.log(response)
                    );
                    if (result.status === "success") {
                      //upate user ransaction
                      const userTransactionUpdate = User.updateOne(
                        { username: req.user.username },
                        {
                          $push: {
                            transaction: {
                              date: date.toJSON().slice(0, 10),
                              time: date.toJSON().slice(11, 15),
                              currencyPair: req.body.currencyPair,
                              sendCurrency: req.body.sendCurrency,
                              sendAmount: req.body.sendAmount,
                              takeCurrency: req.body.takeCurrency,
                              takeAmount: result.data.amount,
                              rate: req.body.Base,
                              paymentStatus: "£ received",
                              sendStatus: result.message.slice(0, 15),
                              sender: req.user.profile.fname,
                              reciever: req.body.receiverName,
                              receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                              senderAcct: req.body.cardEnding,
                              ref: req.body.ref,
                              flwId: result.data.id,
                            },
                          },
                        }
                      );

                      //update general transaction db
                      const SaveTransaction = new Transaction({
                        details: [
                          {
                            date: date.toJSON().slice(0, 10),
                            time: date.toJSON().slice(11, 15),
                            currencyPair: req.body.currencyPair,
                            sendCurrency: req.body.sendCurrency,
                            sendAmount: req.body.sendAmount,
                            takeCurrency: req.body.takeCurrency,
                            takeAmount: result.data.amount,
                            rate: req.body.Base,
                            paymentStatus: "£ received",
                            sendStatus: result.message.slice(0, 15),
                            sender: req.user.profile.fname,
                            reciever: req.body.receiverName,
                            receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                            senderAcct: req.body.cardEnding,
                            ref: req.body.ref,
                            flwId: result.data.id,
                          },
                        ],
                      });

                      Promise.all([
                        userTransactionUpdate,
                        SaveTransaction.save(),
                      ]).then((results) => {
                        // console.log(results);
                        mailer.sendFxNotification(
                          req.user.username,
                          "Initiated",
                          req.user.profile.fname,
                          result.data.id,
                          date.toJSON().slice(0, 10),
                          req.body.sendAmount,
                          req.body.Base,
                          req.body.takeCurrency + result.data.amount,
                          req.body.receiverName
                        );
                        res.send("true");
                      });
                    } else {
                      // console.log(result.message);
                      const userTransactionUpdate = User.updateOne(
                        { username: req.user.username },
                        {
                          $push: {
                            transaction: {
                              date: date.toJSON().slice(0, 10),
                              time: date.toJSON().slice(11, 15),
                              currencyPair: req.body.currencyPair,
                              sendCurrency: req.body.sendCurrency,
                              sendAmount: req.body.sendAmount,
                              takeCurrency: req.body.takeCurrency,
                              takeAmount: result.data.amount,
                              rate: req.body.Base,
                              paymentStatus: "£ received",
                              sendStatus: result.message.slice(0, 15),
                              sender: req.user.profile.fname,
                              reciever: req.body.receiverName,
                              receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                              senderAcct: req.body.cardEnding,
                              ref: req.body.ref,
                              flwId: result.data.id,
                            },
                          },
                        }
                      );

                      //update general transaction db
                      const SaveTransaction = new Transaction({
                        details: [
                          {
                            date: date.toJSON().slice(0, 10),
                            time: date.toJSON().slice(11, 15),
                            currencyPair: req.body.currencyPair,
                            sendCurrency: req.body.sendCurrency,
                            sendAmount: req.body.sendAmount,
                            takeCurrency: req.body.takeCurrency,
                            takeAmount: result.data.amount,
                            rate: req.body.Base,
                            paymentStatus: "£ received",
                            sendStatus: result.message.slice(0, 15),
                            sender: req.user.profile.fname,
                            reciever: req.body.receiverName,
                            receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                            senderAcct: req.body.cardEnding,
                            ref: req.body.ref,
                            flwId: result.data.id,
                          },
                        ],
                      });

                      Promise.all([
                        userTransactionUpdate,
                        SaveTransaction.save(),
                      ]).then((results) => {
                        mailer.sendFxNotification(
                          req.user.username,
                          "Failed",
                          req.user.profile.fname,
                          result.data.id,
                          date.toJSON().slice(0, 10),
                          req.body.sendAmount,
                          req.body.Base,
                          result.data.amount,
                          req.body.receiverName
                        );
                        // console.log(results);
                        res.send("false");
                      });
                    }
                  })
                  .catch(console.log);
              }
            }
          );
        }
      }
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  renderDashboard: dashboard,
  renderUserProfile: userProfile,
  updateUserProfile: updateUser,
  renderUserSettings: userSettings,
  uploadUserProof: userProof,
  renderReceiverPage: receiverPage,
  loadBank: banks,
  confirmBankDetails: bankDetails,
  addReceiver: receiverDetails,
  removeReceiver: removeReceiverDetails,
  addPaymentCard: addCard,
  removePaymentCard: removeCard,
  createExchange: exchange,
};
