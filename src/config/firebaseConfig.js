// firebaseConfig.js
const { json } = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const admin = require('firebase-admin');

let bucket;
let isConnected = false;
let initializationPromise;

async function initializeFirebase() {
  try {
    // const serviceAccount = require('./firebase.json');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_FILE);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_BUCKET_URL, // Replace with your actual bucket name
    });
    bucket = admin.storage().bucket();
    isConnected = true;
    console.log('Firebase Admin SDK initialized and connected to storage.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    bucket = null;
    isConnected = false;
    throw new Error("SERVICE : Firebase Service Connection Error!")
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