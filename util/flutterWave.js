const Flutterwave = require("flutterwave-node-v3"); //flutterwave
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_TEST,
  process.env.FLW_SECRET_TEST
);
module.exports = flw;
