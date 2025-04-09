// models/donorModel.js
const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  bloodType: { type: String, required: true },
  haveYouDonatedBefore: { type: Boolean, required: true },
  role: { type: String, default: 'donor' },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema); // Ensure this is correct
