const Hospital = require('../models/hospitalModel');
const KYC = require('../models/kycModel');
const cloudinary = require('../config/cloudinaryConfig'); 

exports.submitKYC = async (req, res) => {
  try {
    const hospitalId = req.user.id; // Ensure this comes from auth middleware
    const { licenseNumber } = req.body;
    const files = req.files;

    // Upload files to Cloudinary
    const facilityImageUpload = await cloudinary.uploader.upload(files.facilityImage[0].path);
    const certificateUpload = await cloudinary.uploader.upload(files.accreditedCertificate[0].path);
    const utilityBillUpload = await cloudinary.uploader.upload(files.utilityBill[0].path);

    // Save to KYC model
    const kycData = await KYC.create({
      hospital: hospitalId,
      facilityImage: facilityImageUpload.secure_url,
      accreditedCertificate: certificateUpload.secure_url,
      licenseNumber,
      utilityBill: utilityBillUpload.secure_url,
    });

    // Mark hospital as KYC complete
    await Hospital.findByIdAndUpdate(hospitalId, { kycCompleted: true });

    res.status(201).json({ message: 'KYC submitted successfully', kycData });
  } catch (error) {
    console.error('KYC Error:', error);
    res.status(500).json({ message: 'KYC submission failed', error: error.message });
  }
};
