const Stripe = require("stripe");
const stripe = Stripe(process.env.WOSIWOSI_STRIPE_KEY);
module.exports = stripe;
