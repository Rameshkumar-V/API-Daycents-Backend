const axios = require('axios');

async function sendToUser(expoPushToken, title, body, data = {}) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };
  const res = await axios.post('https://exp.host/--/api/v2/push/send', message, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  // console.log("sended...");

  return res;
}
// ExponentPushToken[DItVjjP5aPIMA-B9L2MAni]
// console.log("NOTIFICATION SENDING ....");
// console.log(sendToUser( "ExponentPushToken[8OH_P2NCvoRcFtuuKbUUxc]","FROM BACKEND","PATHUKILO KARI KUDUNKA BHAI",{"screen":"KARI VENUM BHAI"}))
// console.log(sendToUser( "ExponentPushToken[DItVjjP5aPIMA-B9L2MAni]","Payment Success","10Rs Received",{"screen":"KARI VENUM BHAI"}))
module.exports = { sendToUser };
