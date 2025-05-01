// utils/sendPushNotification.js
const axios = require('axios');

/**
 * Send a push notification to one user
 * @param {string} expoPushToken 
 * @param {string} title 
 * @param {string} body 
 * @param {object} data 
 */
async function sendToUser(expoPushToken, title, body, data = {}) {
  if (!/^ExpoPushToken\[\w+\]$/.test(expoPushToken)) {
    throw new Error('Invalid Expo push token');
  }

  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  await axios.post('https://exp.host/--/api/v2/push/send', message, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

module.exports = { sendToUser };
