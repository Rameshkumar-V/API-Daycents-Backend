const { Payment, sequelize } = require('../models');
const { createRazorpayOrder } = require('../utils/razorpay.utils');

const createOrFetchOrder = async (userId, postId) => {
  const t = await sequelize.transaction();

  try {
    let payment = await Payment.findOne({
      where: { user_id: userId, post_id: postId },
      transaction: t
    });

    const options = {
      amount: 100, // ₹10 = 100 paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    if (payment) {
      if (payment.status === 'SUCCESS') {
        await t.commit();
        return { status: 'SUCCESS', data: payment };
      }

      if (!payment.order_id) {
        const order = await createRazorpayOrder(options);
        payment.order_id = order.id;
        await payment.update({ order_id: payment.order_id }, { transaction: t });
      }

      await t.commit();
      return { status: 'SUCCESS_ALREADY', data: payment };
    }

    // If payment doesn't exist
    payment = await Payment.create({
      user_id: userId,
      post_id: postId,
      order_id: null,
      amount: 10,
      status: 'CREATED'
    }, { transaction: t });

    const order = await createRazorpayOrder(options);
    payment.order_id = order.id;

    await payment.update({ order_id: payment.order_id }, { transaction: t });
    await t.commit();

    return { status: 'CREATED', data: payment };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const crypto = require('crypto');
// const { Payment } = require('../models');

exports.verifyRazorpaySignature = (orderId, paymentId, signature) => {
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return generatedSignature === signature;
};

exports.updatePaymentStatus = async (orderId, paymentId) => {
    const payment = await Payment.findOne({ where: { order_id: orderId } });

    if (!payment) {
        throw new Error('Payment record not found');
    }

    payment.status = 'SUCCESS';
    payment.payment_id = paymentId;
    await payment.save();

    return payment;
};


module.exports = {
  createOrFetchOrder,
};
