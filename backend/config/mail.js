const nodemailer = require('nodemailer');
const axios = require('axios');

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Yop Mail API function
const sendYopMailVerification = async (yopmailAddress, verificationLink) => {
  try {
    // Yop Mail is a temporary email service that automatically receives emails
    // The email will be available at https://yopmail.com/{name}
    console.log(`Verification link for ${yopmailAddress}: ${verificationLink}`);
    return true;
  } catch (error) {
    console.error('Error sending Yop Mail verification:', error);
    return false;
  }
};

// Send verification email (link-based)
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'MedVault - Email Verification',
      html: `
        <h2>Welcome to MedVault!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    };

    // If email credentials are not set, log the verification link for development
    if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
      console.log(`Verification link for ${email}: ${verificationLink}`);
      return true;
    }

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    // Fallback: log the verification link
    console.log(`Verification link for ${email}: ${verificationLink}`);
    return true;
  }
};

module.exports = { sendVerificationEmail, sendYopMailVerification };
