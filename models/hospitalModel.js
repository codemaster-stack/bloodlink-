const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  location: { type: String, required: true },
  role: {
    type: String,
    enum: ['hospital', 'donor'], // Role can only be 'hospital' for this schema
    default: 'hospital', // Default value is 'hospital'
  },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  profilePicture: { type: String },
  kycVerified: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('hospital', hospitalSchema);
