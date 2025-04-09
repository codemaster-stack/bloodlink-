const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const donorModel = require("../models/donorModel"); 
const hospitalModel = require("../models/hospitalModel");  // Make sure this is correctly imported
const sendMail = require("../utils/sendEmail"); 
require("dotenv").config();

// Register user (either donor or hospital)
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user exists (donor or hospital)
    let userExists;
    if (role === 'donor') {
      userExists = await donorModel.findOne({ email });
    } else if (role === 'hospital') {
      userExists = await hospitalModel.findOne({ email });
    }

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user based on role
    let newUser;
    if (role === 'donor') {
      newUser = new donorModel({
        fullName: req.body.fullName,
        email,
        bloodType: req.body.bloodType,
        role,
        location: req.body.location,
        password: hashedPassword,
      });
    } else if (role === 'hospital') {
      newUser = new hospitalModel({
        fullName: req.body.fullName,
        email,
        role,
        location: req.body.location,
        password: hashedPassword,
      });
    }

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error signing up user' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const model = role === 'hospital' ? hospital : donorModel;

    const user = await model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists (either donor or hospital)
    let user;
    if (req.body.role === 'donor') {
      user = await donorModel.findOne({ email });
    } else if (req.body.role === 'hospital') {
      user = await hospitalModel.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create a reset password link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    const emailSubject = "Password Reset Request";
    const emailMessage = `
      <p>We received a request to reset your password.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `;
    await sendMail(user.email, emailSubject, emailMessage);

    res.status(200).json({ message: 'Password reset link sent to your email' });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: 'Error sending password reset link' });
  }
};

// Password Reset (example)
exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Implement password reset logic here (e.g., send email with reset link)
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};
