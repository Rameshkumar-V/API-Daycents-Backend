const path = require('path');
const {bucket} =require('../config/firebaseConfig');

async function uploadFileFromBuffer(buffer, destinationFileName, contentType) {

  if(!bucket){
    console.log("FIREBASE 🔴 : bucket not available !")
  }
  // console.log("bucket : "+bucket)
  const file = bucket.file(destinationFileName);

  await file.save(buffer, {
    metadata: { contentType },
    public: true,
  });

  // Make file public
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationFileName}`;
  // console.log(`Uploaded: ${publicUrl}`);

  return publicUrl;
}


async function deleteFileByName(destinationFileName) {

  try{
    const file = bucket.file(destinationFileName);
    await file.delete();
    // console.log(`Deleted file: ${destinationFileName}`);
    return true;
  }catch(e){
    console.log("ERROR : deleteFileByName :  "+e)
    return false;
  }
  
}

module.exports = { uploadFileFromBuffer, deleteFileByName };
