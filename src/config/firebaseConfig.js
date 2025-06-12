const dotenv = require('dotenv');
dotenv.config();
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_FILE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET_URL, 
});

const bucket = admin.storage().bucket();
console.log('FIREBASE INITIALIZED 🟢')

module.exports={
  bucket
}