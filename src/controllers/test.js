// const haversine = require('haversine'); // Import Haversine for distance calculation


// // try {
// //   // Fetch all posts with their user profile and category information
// //   const posts = await UserPost.findAll({
// //     include: [
// //       {
// //         model: Profile,
// //         as: 'Profile', // Make sure this matches the alias defined in your associations
// //         attributes: ['location_lat', 'location_long', 'name'],
// //       },
// //       {
// //         model: Category,
// //         as: 'Category', // Include category for additional post information
// //         attributes: ['name'],
// //       }
// //     ],
// //   });

// //   // Filter the posts based on proximity (within the radius provided)
// //   const nearbyPosts = posts.filter(post => {
// //     // Get the post's location from the Profile model
// //     const postLocation = {
// //       latitude: post.Profile.location_lat,
// //       longitude: post.Profile.location_long,
// //     };

// //     // Get the user's location
// //     const userLocation = {
// //       latitude: parseFloat(latitude),
// //       longitude: parseFloat(longitude),
// //     };

// //     // Calculate the distance using the Haversine formula
// //     const distance = haversine(userLocation, postLocation, { unit: 'kilometer' });

// //     // Only include posts within the specified radius
// //     return distance <= parseFloat(radius); // Radius is a dynamic parameter (default 10 km)
// //   });

// //   // Return the filtered posts
// //   res.json(nearbyPosts);

// // } catch (err) {
// //   res.status(500).json({ error: err.message });
// // }
// // Controller for creating a User Post


// async function GetNearByPosts(latitude= 9.9702, longitude= 78.0698, radius=10){
    
  
  
//       const postLocation = {
//         latitude: 9.9252,
//         longitude:  78.1198,
//       };
      
//       const userLocation = {
//         latitude: parseFloat(latitude), // Get the user's location
//         longitude: parseFloat(longitude),
//       };

      
//       const distance = parseInt(haversine(userLocation, postLocation, { unit: 'kilometer' }));  // Calculate the distance using the Haversine formula
//       console.log(distance);
//       // Only include posts within the specified radius
//       const a=distance <= parseFloat(radius); // Radius is a dynamic parameter (default 10 km)
//       console.log("a="+a);
  
// }

// // GetNearByPosts();

// // Ten calls to test GetNearByPosts

// // Ten calls to test GetNearByPosts

// // 1. Default values (approx. 5-6 km)
// const result1 =  GetNearByPosts();
// console.log('Expected: distance approx. 5-6 km, withinRadius: true/false, Function Provided:', result1);

// // 2. Slightly further North (approx. 5+ km)
// const result2 =  GetNearByPosts(9.975, 78.12);
// console.log('Expected: distance approx. 5+ km, withinRadius: true, Function Provided:', result2);

// // 3. Slightly further East (approx. 5- km)
// const result3 =  GetNearByPosts(9.92, 78.17);
// console.log('Expected: distance approx. 5- km, withinRadius: true, Function Provided:', result3);

// // 4. Just outside the radius (approx. 10- km)
// const result4 =  GetNearByPosts(10.015, 78.12);
// console.log('Expected: distance approx. 10- km, withinRadius: false, Function Provided:', result4);

// // 5. Just outside the radius (approx. 10- km)
// const result5 =  GetNearByPosts(9.92, 78.22);
// console.log('Expected: distance approx. 10- km, withinRadius: false, Function Provided:', result5);

// // 6. Approximately 5km away (North)
// const result6 =  GetNearByPosts(9.9702, 78.1198);
// console.log('Expected: distance approx. 5.0 km, withinRadius: true, Function Provided:', result6);

// // 7. Approximately 5km away (East)
// const result7 =  GetNearByPosts(9.9252, 78.1698);
// console.log('Expected: distance approx. 5.0 km, withinRadius: true, Function Provided:', result7);

// // 8. Further away (Southwest, approx. 6+ km)
// const result8 =  GetNearByPosts(9.88, 78.08);
// console.log('Expected: distance approx. 6+ km, withinRadius: true, Function Provided:', result8);

// // 9. Much further away (Northwest, approx. 11+ km)
// const result9 =  GetNearByPosts(10.05, 78.05);
// console.log('Expected: distance approx. 11+ km, withinRadius: false, Function Provided:', result9);

// // 10. Same location as postLocation (approx. 0.0 km)
// const result10 =  GetNearByPosts(9.9252, 78.1198);
// console.log('Expected: distance approx. 0.0 km, withinRadius: true, Function Provided:', result10);


const url ="https://storage.googleapis.com/flask-test-3d74a.appspot.com/uploads/file_user_undefined"
console.log(url.split('/').slice(-1,-3))


// console.log(process.env); // This will show all loaded environment variables

// console.log(process.env.DATABASE_URL)

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   dialectModule: pg,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false // Accept self-signed certificates (important for Supabase/Railway)
//     }
//   }
// });
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './database.sqlite' // or any path you want
// });
// Test connection





const Razorpay = require('razorpay');
const path = require('path');
const fs = require('fs');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

// Replace with your Razorpay credentials
const razorpay = new Razorpay({
  key_id: 'rzp_live_MCymOBbc81gCVN',
  key_secret: 'VfUnkonpPzQvuDTRLtZaQufE',
});



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
    // writeData(orders);

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
      // const orders = readData();
      const order = orders.find(o => o.order_id === razorpay_order_id);
      if (order) {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
        // writeData(orders);
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
