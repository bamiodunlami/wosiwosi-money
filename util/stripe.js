// util/stripe.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.WOSIWOSI_STRIPE_KEY, {
  apiVersion: '2024-06-20', // or whichever you want
});
module.exports = stripe;
