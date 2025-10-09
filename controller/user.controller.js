const appRoot = require('app-root-path'); // For resolving app root directory
const path = require('path');
const rootPath = path.resolve(process.cwd());
appRoot.setPath(rootPath); // Set app root path

// Utility and service modules
const stripe = require(appRoot + '/util/stripe.js'); // Stripe integration
const passport = require(appRoot + '/util/passportAuth'); // Passport authentication
const mailer = require(appRoot + '/util/mailer.js'); // Email notifications

const mongo = require(appRoot + '/model/mongodb.js'); // MongoDB models
const User = mongo.User;

const Transaction = mongo.Transaction;

const flw = require(appRoot + '/util/flutterWave.js');

const date = new Date();

/**
 * Render user dashboard and check last transaction status.
 */
const dashboard = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  // Find user and check last transaction status
  const user = await User.findOne({ username: req.user.username });
  if (user && user.transaction.length > 0) {
    const lastTransaction = user.transaction[user.transaction.length - 1];
    const lastTransactionId = lastTransaction.flwId;

    const payload = lastTransactionId.toString();

    // console.log(payload);

    //  const transfer = await flw.getTransfer('105718071');
    try {
      const transfer = await flw.getTransfer(payload);
      const status = transfer.data.status || 'PROCESSING';
      // console.log(status)
      const updateUser = await User.updateOne({ username: req.user.username, 'transaction.flwId': lastTransactionId }, { $set: { 'transaction.$.sendStatus': status } });
      //  console.log(updateUser)
    } catch (e) {
      console.log(e);
    }

    // Check transfer status from Flutterwave
    // flw.Transfer.get_a_transfer(payload).then((response) => {
    //   let status = 'FAILED';
    //   if (response.status === 'success') {
    //     status = response.data.status === 'SUCCESSFUL' ? 'SUCCESSFUL' : 'PROCESSING';
    //   }
    //   User.updateOne({ username: req.user.username, 'transaction.flwId': lastTransactionId }, { $set: { 'transaction.$.sendStatus': status } }).catch(console.log);
    // });
  }
  res.render('dashboard', { user: req.user });
};

/**
 * Render user profile page.
 */
const userProfile = async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.redirect('/login');
    await User.find({ username: req.user.username });
    res.render('profile', { user: req.user });
  } catch (e) {
    console.log(e);
  }
};

/**
 * Update user profile information.
 */
const updateUser = async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const user = await User.findOne({ username: req.user.username });
    user.profile = {
      fname: req.body.fname || user.profile.fname,
      lname: req.body.lname || user.profile.lname,
      phone: req.body.phone || user.profile.phone,
      dob: req.body.dob || user.profile.dob,
      street: req.body.address || user.profile.address,
      postcode: req.body.postCode || user.profile.postCode,
      city: req.body.city || user.profile.city,
      country: req.body.residence || user.profile.residence,
      Nationality: req.body.nationality || user.profile.Nationality,
    };
    await user.save();
    res.redirect(req.headers.referer);
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
};

/**
 * Render user settings page.
 */
const userSettings = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  await User.find({ username: req.user.username });
  res.render('settings', { user: req.user });
};

/**
 * Redirect to verification page for user proof upload.
 */
const userProof = async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.redirect('/login');
    res.redirect('/verify');
  } catch (e) {
    console.log(e);
  }
};

/**
 * Render receiver management page.
 */
const receiverPage = (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.render('receiver', {
    receiver: req.user.receiver,
    card: req.user.cardDetails,
    user: req.user,
  });
};

/**
 * Fetch and return sorted list of Nigerian banks from Flutterwave API.
 */
const loadBanks = async (req, res) => {
  console.log('here');
  // const request = require('request');
  // const options = {
  //   method: 'GET',
  //   url: 'https://api.flutterwave.com/v3/banks/NG',
  //   headers: {
  //     Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
  //   },
  // };

  // // Make request to Flutterwave API for bank list
  // request(options, (error, response) => {
  //   if (error) {
  //     console.error('Bank list fetch error:', error);
  //     return res.redirect('/');
  //   }
  //   try {
  //     const bankJson = JSON.parse(response.body);
  //     const banksList = bankJson.data || [];
  //     // Sort banks alphabetically by name
  //     banksList.sort((a, b) => a.name.localeCompare(b.name));
  //     res.json(banksList);
  //   } catch (e) {
  //     console.error('Error parsing bank list JSON:', e);
  //     res.redirect('/');
  //   }
  // });

  try {
    const result = await flw.getBanks('NG'); // load Nigerian banks
    res.send(result.data.sort((a, b) => a.name.localeCompare(b.name))); // Sort banks alphabetically by name
    // res.json(result);
    // console.log(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load banks' });
    console.log('cannot get banks');
  }
  // try {
  //   const payload = {
  //     country: 'NG', //Pass either NG, GH, KE, UG, ZA or TZ to get list of banks in Nigeria, Ghana, Kenya, Uganda, South Africa or Tanzania respectively
  //   };
  //   const loadBank = await await flw.Bank.country(payload);
  //   // console.log(loadBank.data);
  //   res.send(loadBank.data.sort((a, b) => a.name.localeCompare(b.name))); // Sort banks alphabetically by name
  // } catch (e) {
  //   console.log(e);
  // }
};

/**
 * Confirm bank details using Flutterwave.
 */
const bankDetails = async (req, res) => {
  try {
    const payload = {
      account_number: req.body.accountNumber,
      account_bank: req.body.bankCode,
    };
    const response = await flw.verifyBankAccount(payload);
    res.json(response.data);
    // console.log(response.data);
  } catch (e) {
    res.redirect(req.headers.referer);
  }
};

/**
 * Save receiver details to user profile.
 */
const receiverDetails = async (req, res) => {
  try {
    console.log(req.body);
    const { acctNumber, acctName, bankName, bankRealName } = req.body;
    if (!req.isAuthenticated()) return res.redirect('/login');
    const response = await User.updateOne({ username: req.user.username }, { $push: { receiver: { acctNumber, acctName, bankName, bankRealName } } });
    req.body.referer !== "/receiver" ? res.send(true) : res.send(false)
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
};

/**
 * Remove receiver details from user profile.
 */
const removeReceiverDetails = async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.redirect('/');
    const response = await User.updateOne({ username: req.user.username }, { $pull: { receiver: { acctNumber: req.body.accontDetails } } });
    if (response.acknowledged === true) res.send(true);
    else res.redirect('/');
  } catch (e) {
    console.log(e);
  }
};

/**
 * Add a payment card to user profile using Stripe.
 */
const addCard = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  const customerToken = req.body;
  try {
    const customer = await stripe.customers.create({
      name: req.body.cardName,
      email: req.user.username,
      source: customerToken.id,
    });
    const infoToSave = {
      cardNumberEnding: customerToken.card.last4,
      cardOwner: `${req.user.profile.fname} ${req.user.profile.lname}`,
      customerOwner: customer.id,
    };
    await User.updateOne({ username: req.user.username }, { $push: { cardDetails: infoToSave } });
    res.send(true);
  } catch (error) {
    res.send(false);
  }
};

/**
 * Remove a payment card from user profile.
 */
const removeCard = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  try {
    await User.updateOne({ username: req.user.username }, { $pull: { cardDetails: { cardNumberEnding: req.body.cardLastDigit } } });
    res.send(true);
  } catch (e) {
    console.log(e);
  }
};

/**
 * Create an exchange transaction (charge card, send via Flutterwave, update DB).
 */
const exchange = async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.redirect('/login');

    const SelectedCard = req.body.cardEnding.slice(12, 16);
    const savedCard = req.user.cardDetails;
    let paymentCard, cardToken;

    // Find selected card and its Stripe token
    for (let i = 0; i < savedCard.length; i++) {
      paymentCard = savedCard[i].cardNumberEnding;
      cardToken = savedCard[i].customerOwner;
      if (paymentCard == SelectedCard) {
        // Charge customer via Stripe

        return stripe.charges.create(
          {
            amount: req.body.sendAmount,
            currency: req.body.sendCurrency,
            description: 'Wosiwosi',
            customer: cardToken,
          },
          async (err, charge) => {
            if (err) {
              // Transaction failed, update user and transaction DB
              await Promise.all([
                User.updateOne(
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
                        promo: req.body.promo,
                        paymentStatus: 'failed',
                        sendStatus: 'Failed',
                        sender: `${req.user.profile.fname} ${req.user.profile.lname}`,
                        senderUser: req.user.username,
                        reciever: req.body.receiverName,
                        receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                        senderAcct: req.body.cardEnding,
                        ref: req.body.ref,
                        flwId: '00112233',
                      },
                    },
                  }
                ),
                new Transaction({
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
                      promo: req.body.promo,
                      paymentStatus: 'failed',
                      sendStatus: 'Failed',
                      sender: `${req.user.profile.fname} ${req.user.profile.lname}`,
                      senderUser: req.user.username,
                      reciever: req.body.receiverName,
                      receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                      senderAcct: req.body.cardEnding,
                      ref: req.body.ref,
                      flwId: '00112233',
                    },
                  ],
                }).save(),
              ]);
              return res.send(false);
            }

            // Stripe charge successful, initiate Flutterwave transfer
            const details = {
              account_bank: req.body.bankCode,
              account_number: req.body.accountNumber,
              amount: req.body.takeAmount,
              narration: 'Wosiwosi',
              currency: req.body.takeCurrency,
              reference: req.body.ref,
              debit_currency: req.body.takeCurrency,
            };

            flw
              .createTransfer(details)
              .then(async (result) => {
                console.log(result.data);
                const txData = {
                  date: date.toJSON().slice(0, 10),
                  time: date.toJSON().slice(11, 15),
                  currencyPair: req.body.currencyPair,
                  sendCurrency: req.body.sendCurrency,
                  sendAmount: req.body.sendAmount,
                  takeCurrency: req.body.takeCurrency,
                  takeAmount: result.data.amount,
                  rate: req.body.Base,
                  promo: req.body.promo,
                  paymentStatus: '£ received',
                  sendStatus: result.message.slice(0, 15),
                  sender: `${req.user.profile.fname} ${req.user.profile.lname}`,
                  senderUser: req.user.username,
                  reciever: req.body.receiverName,
                  receiverAcct: `${req.body.accountNumber} ${req.body.bankName}`,
                  senderAcct: req.body.cardEnding,
                  ref: req.body.ref,
                  flwId: result.data.id,
                };

                // Update user and transaction DB
                await Promise.all([User.updateOne({ username: req.user.username }, { $push: { transaction: txData } }), new Transaction({ details: [txData] }).save()]);

                // Send notifications
                mailer.sendFxNotification(req.user.username, result.status === 'success' ? 'Initiated' : 'Failed', req.user.profile.fname, result.data.id, date.toJSON().slice(0, 10), req.body.sendAmount, req.body.Base, req.body.takeCurrency + result.data.amount, req.body.receiverName);
                mailer.adminfxnotification('bamidele@wosiwosi.co.uk', result.status === 'success' ? 'initiated' : 'Failed', req.user.profile.fname, result.data.id, date.toJSON().slice(0, 10), req.body.sendAmount, req.body.Base, req.body.takeCurrency + result.data.amount, req.body.receiverName);
                res.send(result.status === 'success');
              })
              .catch((err) => {
                console.log(err);
                res.send(false);
              });
          }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const exchange2 = async (req, res) => {
  console.log('ere');
  const payload = {
    account_bank: '033', //ubs
    account_number: '2061827574',
    amount: 1000,
    narration: 'Payment for data',
    currency: 'NGN',
    reference: `TRX-${Date.now()}`,
  };

  try {
    const result = await flw.createTransfer(payload);
    // console.log(payload);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

/**
 * Manually initiate a Flutterwave transfer (for admin/testing).
 */
const manualTx = async (req, res) => {
  const details = {
    account_bank: '050',
    account_number: '5450064100',
    amount: '30000',
    narration: 'Wosiwosi',
    currency: 'NGN',
    reference: 'exchange',
    debit_currency: 'NGN',
  };
  flw.Transfer.initiate(details).then((result) => {
    console.log(result);
  });
};

// Export controller functions
module.exports = {
  renderDashboard: dashboard,
  renderUserProfile: userProfile,
  updateUserProfile: updateUser,
  renderUserSettings: userSettings,
  uploadUserProof: userProof,
  renderReceiverPage: receiverPage,
  loadBanks: loadBanks,
  confirmBankDetails: bankDetails,
  addReceiver: receiverDetails,
  removeReceiver: removeReceiverDetails,
  addPaymentCard: addCard,
  removePaymentCard: removeCard,
  createExchange: exchange,
  manualTx,
};
