const donorModel  = require("../models/donorModel"); 
const  hospitalModel  = require("../models/hospitalModel"); 
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const { resetMail } = require("../utils/resetMail"); 
const { sendEmail } = require("../utils/sendEmail");
const email  = require("../utils/email");
require("dotenv").config(); 
const BloodRequest = require('../models/bloodRequestModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); 
const cloudinary = require('../config/cloudinaryConfig');


exports.register =async (req, res) => {

  try {
    const { fullName, email, location, role, password } = req.body;

    console.log('Request body:', req.body);
    // Validate input
    if (!fullName || !email || !location || !role || !password) {
      return res.status(400).json({
        message: "All fields (fullName, email, location, role, password) are required",
      });
    }

    const emailNormalized = email.toLowerCase();
    const hospitalExists = await hospitalModel.findOne({ email: emailNormalized });

    if (hospitalExists) {
      return res.status(400).json({
        message: `Email ${email} is already registered`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const hospital = new hospitalModel({
      fullName: fullName.trim(),
      email: emailNormalized,
      location: location.trim(),
      role: role.trim().toLowerCase(),
      password: hashedPassword,
    });

    await hospital.save();

    res.status(201).json({
      message: "Hospital created successfully",
      data: hospital,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error " + error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const hospital = await hospitalModel.findOne({ email: email.toLowerCase() });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital Not Found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, hospital.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect Password' });
    }

    //  Ensure role is saved correctly
    if (hospital.role.toLowerCase() !== 'hospital') {
      await hospitalModel.updateOne(
        { email: hospital.email },
        { $set: { role: 'hospital' } }
      );
      hospital.role = 'hospital'; // Also update the local object
    }

    console.log('Hospital Role:', hospital.role);

    const token = jwt.sign(
      { id: hospital._id, role: hospital.role }, // Now guaranteed to be lowercase
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Logged In Successfully',
      data: hospital,
      token
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error ' + error.message
    });
  }
};


  exports.searchForDonors = async (req, res) => {
    try {
      console.log(req.user);  // Debugging line to see the user data
  
      if (req.user.role !== 'hospital') {
        return res.status(403).json({ message: 'Access denied. Only hospitals can search for donors.' });
      }
  
      if (!req.user.isKycVerified) {
        return res.status(400).json({ message: 'You are yet to complete your KYC, check your email and complete it.' });
      }
  
      const donors = await donorModel.find();
      res.status(200).json(donors);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  exports.submitBloodRequest = async (req, res) => { 
    try {
      const { bloodGroup, numberOfPints, preferredDate, urgencyLevel, amount } = req.body;
  
      if (req.user.role !== 'hospital') {
        return res.status(403).json({ message: 'Only hospitals can make a blood request' });
      }
      console.log('Amount from body:', amount);
      const request = new BloodRequest({
        hospital: req.user.id,  // Referring to the hospital
        bloodGroup,
        numberOfPints,
        preferredDate,
        urgencyLevel,
        amount,  // Correct field to match schema
      });
  
      await request.save();
  
      res.status(201).json({ message: 'Blood request submitted successfully', request });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  exports.getBloodRequestHistory = async (req, res) => {
    try {
      // Ensure the user is a hospital
      if (req.user.role !== 'hospital') {
        return res.status(403).json({ message: 'Only hospitals can view their blood request history' });
      }
  
      // Fetch the hospital's blood request history
      const requests = await BloodRequest.find({ hospital: req.user.id })
        .sort({ createdAt: -1 })
          // Sort by date, most recent first
        .select('bloodGroup numberOfPints preferredDate urgencyLevel amount status createdAt updatedAt'); // Explicitly select fields
  
      console.log('Fetched requests:', requests);
      if (requests.length === 0) {
        return res.status(404).json({ message: 'No blood requests found for this hospital.' });
      }
  
      res.status(200).json({ requests });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };

exports.getHospitalProfile = async (req, res) => {
  try {
    console.log("hospital Role:", req.user.role);
    console.log("req.user:", req.user);

    const hospital = await hospitalModel.findById(req.user.id).select('-password'); // omit password if present

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json({ hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};


// In hospitalController.js
exports.updateProfile = async (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Error uploading file", error: err.message });
    }

    const { phone, address, city, state } = req.body;
    const hospitalId = req.user.id;

    // Initialize an update object for the hospital
    const updatedHospitalData = {};

    // If there's a file, upload it to Cloudinary
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'hospital-profiles',  // You can change this to any folder name you like
          resource_type: 'auto',         // Automatically handles image, video, etc.
        });

        updatedHospitalData.profilePicture = result.secure_url;  // Get the URL of the uploaded image
      } catch (uploadError) {
        return res.status(500).json({ message: 'Error uploading file to Cloudinary', error: uploadError.message });
      }
    }

    // Add other fields to the update object if present
    if (phone) updatedHospitalData.phone = phone;
    if (address) updatedHospitalData.address = address;
    if (city) updatedHospitalData.city = city;
    if (state) updatedHospitalData.state = state;

    try {
      const updatedHospital = await hospitalModel.findByIdAndUpdate(
        hospitalId,
        { $set: updatedHospitalData },
        { new: true, runValidators: true }
      );

      if (!updatedHospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        data: updatedHospital,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  });
};


exports.deleteAccount = async (req, res) => {
  const hospitalId = req.user.id; // Assuming the user ID is stored in req.user.id

  try {
    const deletedHospital = await hospitalModel.findByIdAndDelete(hospitalId);

    if (!deletedHospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const hospital = await hospitalModel.findOne({ email: email.toLowerCase() });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Generate the password reset token
    const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
    const hospitalId = decoded.id;

    // Find the hospital by ID
    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the hospital's password
    hospital.password = hashedPassword;
    await hospital.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

