// util/flutterWave.js
const axios = require('axios');

const flw = axios.create({
  baseURL: 'https://api.flutterwave.com/v3',
  headers: {
    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// const Flutterwave = require("flutterwave-node-v3"); //flutterwave
// const flw = new Flutterwave(
//   process.env.FLW_PUBLIC_KEY,
//   process.env.FLW_SECRET_KEY
// );

// Verify a transaction
//  const verifyTransaction = async (txId) => {
//   const { data } = await flw.get(`/transactions/${txId}/verify`);
//   return data;
// };

// Initiate a transfer
const createTransfer = async (payload) => {
  const { data } = await flw.post('/transfers', payload);
  return data;
};

// Get a single transfer
const getTransfer = async (transferId) => {
  const { data } = await flw.get(`/transfers/${transferId}`);
  return data;
};

const getBanks = async (country = 'NG') => {
  try {
    const { data } = await flw.get(`/banks/${country}`);
    return data;
  } catch (err) {
    console.error('Error fetching banks:', err.response?.data || err.message);
    throw err;
  }
};

const verifyBankAccount = async (payload) => {
  try {
    const options = {
      method: 'POST',
      url: 'https://api.flutterwave.com/v3/accounts/resolve',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      data: payload,
    };

   const data = await axios.request(options);

    return data; // contains account name and verification status
  } catch (err) {
    console.error('Error verifying bank account:', err.response?.data || err.message);
    throw err;
  }
};

module.exports = {
  getBanks,
  createTransfer,
  getTransfer,
  verifyBankAccount,
};

// module.exports = flw;
