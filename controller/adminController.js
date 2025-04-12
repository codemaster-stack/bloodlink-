const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hospitalModel = require("../models/hospitalModel");
const donorModel = require("../models/donorModel");
const adminModel  = require("../models/adminModel"); 
const { resetMail } = require("../utils/resetMail"); 
const { sendEmail } = require("../utils/sendEmail");
const KYC = require('../models/kycModel');
require("dotenv").config();
require("../utils/resetMail");


exports.adminRegister = async (req, res) => {

  try {
    const { fullName, email, role, password } = req.body;

    console.log('Request body:', req.body);
    // Validate input
    if (!fullName || !email || !role || !password) {
      return res.status(400).json({
        message: "All fields (fullName, email, role, password) are required",
      });
    }

    const emailNormalized = email.toLowerCase();
    const userExists = await adminModel.findOne({ email: emailNormalized });

    if (userExists) {
      return res.status(400).json({
        message: `Email ${email} is already registered`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new adminModel({
      fullName: fullName.trim(),
      email: emailNormalized,
      role,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error " + error.message,
    });
  }
};

  exports.adminLogin = async (req, res)=>{
    try{
      const {email, password} = req.body;
      if(email == undefined || password == undefined){
        return res.status(400).json({
          message: 'Email and password required'
        })
      }
  
    const admin = await adminModel.findOne({email: email.toLowerCase() });
    if(admin == null){
      return res.status(404).json({
        message: 'Donor Not Found'
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password)
    if(isPasswordCorrect == false){
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    
    res.status(200).json({
      message: 'Logged In Successfully',
      data: admin,
      token
    })
    }catch(error){
      console.log(error.message)
      res.status(500).json({
        message: 'Internal Server Error '+ error.message
      })
    }
  }

// In adminController.js

exports.viewUsers = async (req, res) => {
  try {
    // Fetch all donors
    const donors = await donorModel.find();

    // Fetch all hospitals
    const hospitals = await hospitalModel.find();

    // Combine both donor and hospital data
    const users = {
      donors,
      hospitals
    };

    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error retrieving users" });
  }
};


exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Try deleting from donor
let user = await donorModel.findByIdAndDelete(userId);
if (!user) {
  // If not found in donor, try hospital
  user = await hospitalModel.findByIdAndDelete(userId);
}

if (!user) {
  return res.status(404).json({ message: 'User not found' });
}

res.status(200).json({ message: 'User deleted successfully' });
}
catch (err) {
  console.error("Error deleting user:", err);
  res.status(500).json({ message: 'Error deleting user' });
}
}


exports.approveKYC = async (req, res) => { 
  try {
    const { kycId } = req.params;
    console.log("Incoming KYC ID:", kycId);

    // Find the KYC document
    const kyc = await KYC.findById(kycId);
    if (!kyc) {
      console.log("KYC not found");
      return res.status(404).json({ message: "KYC not found" });
    }
    console.log("KYC hospital ID:", kyc.hospital);
    console.log(" KYC found:", kyc);

    // Check if KYC is already approved or declined
    if (kyc.status === 'approved' || kyc.status === 'declined') {
      return res.status(400).json({ message: 'KYC has already been processed.' });
    }

    // Find the associated hospital using kyc.hospital
    const hospital = await hospitalModel.findById(kyc.hospital);
    if (!hospital) {
      console.log("Hospital not found for KYC:", kyc.hospital);
      console.log(" Hospital not found");
      return res.status(404).json({ message: "Hospital not found" });
    }

    console.log(" Hospital found:", hospital);

    // Update the KYC document status to "approved"
    kyc.status = "approved";
    await kyc.save();

    // Update the hospital's kycVerified field to true
    hospital.kycVerified = true;
    await hospital.save();

    console.log(" KYC approved and hospital verified");

    return res.status(200).json({ message: "KYC approved successfully" });

  } catch (error) {
    console.error(" Error in approveKYC:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.declineKYC = async (req, res) => { 
  const { kycId } = req.params;  // Access the kycId from the route parameter
  console.log("Decline KYC hit with ID:", kycId);

  try {
    // Find the KYC document by the given kycId
    const kycDocument = await KYC.findById(kycId); // Use kycId here to find the document
    console.log('KYC Document:', kycDocument);

    if (!kycDocument) {
      return res.status(404).json({ message: 'KYC document not found' });
    }

    // Allow decline for both approved and pending KYC statuses
    if (kycDocument.status !== 'approved' && kycDocument.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot decline KYC in its current state' });
    }

    // Log the hospital ID in the KYC document
    console.log('Hospital ID in KYC:', kycDocument.hospital);

    // Update KYC status to declined
    kycDocument.status = 'declined';
    await kycDocument.save();
    console.log('kycDocument.hospital:', kycDocument.hospital);

    // Update the hospital's KYC verification flag
    const hospital = await hospitalModel.findById(kycDocument.hospital); // kycDocument.hospital should have the hospitalId
    console.log('Hospital:', hospital);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    hospital.kycVerified = false;
    await hospital.save();

    res.status(200).json({
      message: 'KYC declined successfully',
      kyc: kycDocument,
    });

  } catch (error) {
    console.error('Error declining KYC:', error);
    res.status(500).json({ message: 'Error declining KYC', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const admin = await adminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Generate the password reset token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the reset email
    await sendEmail(email, 'Password Reset', `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${token}`);

    // Respond with the token for testing purposes
    res.status(200).json({
      message: 'Password reset link sent to your email',
      token: token // Include the token in the response
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Error sending password reset email', error: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Decode the token to get hospital ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    // Find the hospital by ID
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the hospital's password
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

  
