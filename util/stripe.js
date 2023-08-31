const stripe = require ('stripe')(process.env.STRIPE_TEST);
module.exports=stripe