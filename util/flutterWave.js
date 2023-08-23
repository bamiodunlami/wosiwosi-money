const Flutterwave = require("flutterwave-node-v3"); //flutterwave
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
module.exports = flw;
