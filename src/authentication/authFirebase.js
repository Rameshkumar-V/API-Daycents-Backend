const admin = require("firebase-admin");
const db = require("../models");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const idToken = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decoded.uid;
    const phoneNo = decoded.phone_number;

    // Check if user exists in DB
    let user = await db.User.findByPk(firebaseUid);

    if (!user) {
      // New user, auto-create in DB
      user = await db.User.create({
        id: firebaseUid,
        phone_no: phoneNo,
        role: "guest", // default role
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authenticateUser;
