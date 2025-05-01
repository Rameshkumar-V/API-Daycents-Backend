const Razorpay = require('razorpay');
const path = require('path');
const fs = require('fs');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

// Replace with your Razorpay credentials
const razorpay = new Razorpay({
  key_id: 'rzp_live_MCymOBbc81gCVN',
  key_secret: 'VfUnkonpPzQvuDTRLtZaQufE',
});

// Function to read data from JSON file
const readData = () => {
  if (fs.existsSync('orders.json')) {
    const data = fs.readFileSync('orders.json');
    return JSON.parse(data);
  }
  return [];
};

// Function to write data to JSON file
const writeData = (data) => {
  fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
};

// Initialize orders.json if it doesn't exist
if (!fs.existsSync('orders.json')) {
  writeData([]);
}



async function createOrder(data){
  try {
    const { amount, currency, receipt, notes } =data;

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };
    // Replace with your Razorpay credentials
const razorpay = new Razorpay({
  key_id: 'rzp_live_KdgCnlP1DrVQAC',
  key_secret: 'VfUnkonpPzQvuDTRLtZaQufE',
});
if(!razorpay){
  return {status:'failed',message:"razorpay instance Failed!"}


}


    const order = await razorpay.orders.create(options);
    
    // Read current orders, add new order, and write back to the file
    const orders = readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });
    writeData(orders);

    return {status:'success',message:"Order Created Successfully",data : [order]}

    res.json(order); // Send order details to frontend, including order ID
  } catch (error) {
    console.error(error);
    return {status:'failed',message:"Order Creation Failed!"}

    // res.status(500).send('Error creating order');
  }
};



 async function verifyPayment(data) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  const secret = razorpay.key_secret;
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    if (isValidSignature) {
      // Update the order with payment details
      const orders = readData();
      const order = orders.find(o => o.order_id === razorpay_order_id);
      if (order) {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
        writeData(orders);
      }
      return {"status":"success",message: "Verification Successfull"};
      res.status(200).json({ status: 'ok' });
      console.log("Payment verification successful");
    } else {
      return {"status":"failed",message: "Verification Failed!"};

      res.status(400).json({ status: 'verification_failed' });
      console.log("Payment verification failed");
    }
  } catch (error) {
    return {"status":"failed",message: "Error verifying payment"};

    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error verifying payment' });
  }
};


module.exports={
  createOrder,
  verifyPayment
}
