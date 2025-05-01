// firebaseConfig.js
const admin = require('firebase-admin');

let bucket;
let isConnected = false;
let initializationPromise;

async function initializeFirebase() {
  try {
    const serviceAccount = require('./fbs.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'flask-test-3d74a.appspot.com', // Replace with your actual bucket name
    });
    bucket = admin.storage().bucket();
    isConnected = true;
    console.log('Firebase Admin SDK initialized and connected to storage.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    bucket = null;
    isConnected = false;
  }
}

// Initialize Firebase and store the promise
initializationPromise = initializeFirebase();

// Export the bucket and a function to check the connection status
module.exports = {
  bucket,
  isConnected: async () => {
    await initializationPromise; // Ensure initialization is complete
    return isConnected;
  },
};