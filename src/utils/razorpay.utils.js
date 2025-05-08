const Razorpay = require('razorpay');
const instance = require('../config/razorpay');

const createRazorpayOrder = async (options) => {
  return await instance.orders.create(options);
};

module.exports = {
  createRazorpayOrder,
};
