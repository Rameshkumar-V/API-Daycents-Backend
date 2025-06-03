
const { Payment,sequelize } = require('../models');
const paymentService = require('../services/Payment.service');
const crypto = require('crypto');

const instance = require('../config/razorpay');
const {userNotificationStore} = require("./notifications.controller");
const { title } = require('process');

exports.createOrder = async (req, res) => {
  const { user_id: userId, post_id: postId } = req.body;

  try {
    const result = await paymentService.createOrFetchOrder(userId, postId);

    switch (result.status) {
      case 'SUCCESS':
        return res.status(409).json({ message: "User has already paid for this post." });

      case 'SUCCESS_ALREADY':
        return res.status(200).json({ message: "Order already exists.", data: result.data });

      case 'CREATED':
        return res.status(201).json({ message: "Order successfully created.", data: result.data });

      default:
        return res.status(500).json({ message: "Unexpected state occurred." });
    }
  } catch (err) {
    console.error("Payment creation error:", err);
    return res.status(500).json({ message: "Failed to create order" });
  }
};


exports.verifyPayment = async (req, res) => {
    try {
        const { user_id, post_id } = req.body;
        if (!user_id || !post_id) {
            return res.status(400).json({ message: "Both user_id and post_id are required." });
        }
        const payment = await Payment.findOne({
            where: {
                user_id: user_id,
                post_id: post_id
            }
        });

        if (!payment) {
            return res.status(404).json({ message: "No payment found for the given user_id and post_id." });
        }

        const { order_id } = payment;
        
        const paymentDetails = await instance.orders.fetch(order_id);
        
        if (!paymentDetails) {
            return res.status(404).json({ message: "Order not found in Razorpay." });
        }


        if (paymentDetails.status === 'paid') {
            payment.payment_id = paymentDetails.id; 
            payment.status = 'SUCCESS';
            await payment.save();

            setImmediate(()=>userNotificationStore(
                user_id=user_id,
                status='SUCCESS',
                title="PayMent Verification",
                message="Payment successfully verified and updated."))

            return res.status(200).json({
                message: "Payment successfully verified and updated.",
                payment: payment,
                paymentdetails: paymentDetails
            });
        } else {
            setImmediate(()=>userNotificationStore(
                user_id=user_id,
                status='FAILED',
                title="PayMent Verification",
                message="Payment not completed or failed."))
            return res.status(400).json({
                message: "Payment not completed or failed.",
                payment: payment,
                paymentdetails: paymentDetails
            });
        }

    } catch (err) {
        console.error("Verification error:", err.message);
        return res.status(500).json({ message: err.message || "Internal server error" });
    }
};





exports.reportToVerify = async (req, res) => {
    const { user_id, post_id } = req.body;

    if (!user_id || !post_id) {
        return res.status(400).json({ message: "Both user_id and post_id are required." });
    }

    try {
        const payment = await Payment.findOne({
            where: {
                user_id: user_id,
                post_id: post_id
            }
        });

        if (!payment) {
            return res.status(404).json({ message: "No payment found for the given user_id and post_id." });
        }

        const { order_id } = payment;

        const paymentDetails = await instance.orders.fetch(order_id);
        
        if (!paymentDetails) {
            return res.status(404).json({ message: "Order not found in Razorpay." });
        }

        if (paymentDetails.status === 'paid') {
            payment.payment_id = paymentDetails.id; 
            payment.status = 'SUCCESS';
            await payment.save();

            setImmediate(()=>userNotificationStore(
                user_id=user_id,
                status='SUCCESS',
                title="PayMent Verification",
                message="Payment successfully verified and updated."))


            return res.status(200).json({
                message: "Payment successfully verified and updated.",
                payment: payment,
                paymentdetails: paymentDetails
            });
        } else {
            setImmediate(()=>
                userNotificationStore(
                user_id=user_id,
                status='FAILED',
                title="PayMent Verification",
                message="Payment not completed or failed."))

            return res.status(400).json({
                message: "Payment not completed or failed.",
                payment: payment,
                paymentdetails: paymentDetails
            });
        }
    } catch (err) {
        console.error("Error verifying payment:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

