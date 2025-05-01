// fileService.js
const path = require('path');
const {bucket,isConnected} = require('./firebaseConfig');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,limits: { fileSize: 5 * 1024 * 1024 } });

async function uploadFileFromBuffer(buffer, destinationFileName, contentType) {

  if(await isConnected()){
    console.log("connected")
  }
  const file = bucket.file(destinationFileName);

  await file.save(buffer, {
    metadata: { contentType },
    public: true,
  });

  // Make file public (optional, or set in save options)
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationFileName}`;
  console.log(`Uploaded: ${publicUrl}`);

  return publicUrl;
}


async function deleteFileByName(destinationFileName) {
  const file = bucket.file(destinationFileName);
  await file.delete();
  console.log(`Deleted file: ${destinationFileName}`);
}

module.exports = { uploadFileFromBuffer };
