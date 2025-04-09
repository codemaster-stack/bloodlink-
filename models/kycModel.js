const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    unique: true
  },
  facilityImage: String,
  accreditedCertificate: String,
  licenseNumber: String,
  utilityBill: String,
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('KYC', kycSchema);
