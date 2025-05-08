const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});


const sendVerificationEmail = async (email, token) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Email',
    html: `<p>Token : "${token}"</p>`,
  });
};


module.exports = { sendVerificationEmail };
