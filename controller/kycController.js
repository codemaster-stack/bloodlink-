const Hospital = require('../models/hospitalModel');
const KYC = require('../models/kycModel');
const cloudinary = require('../config/cloudinaryConfig'); 

exports.submitKYC = async (req, res) => {
  try {
    console.log('--- Incoming KYC Request ---');
    const { hospitalId } = req.user; // Hospital ID from the user object
    const { licenseNumber } = req.body;
    const files = req.files;

    // Check if there is an existing KYC document for the hospital
    const existingKYC = await KYC.findOne({ hospital: hospitalId });

    // If a previous KYC exists, check its status
    if (existingKYC) {
      if (existingKYC.status === 'pending') {
        return res.status(400).json({
          message: 'A KYC is already pending for this hospital. Resubmission is not allowed.',
        });
      }

      if (existingKYC.status === 'declined') {
        console.log('Previous KYC was declined. Deleting and allowing resubmission.');
        await KYC.findByIdAndDelete(existingKYC._id); // Delete the old declined KYC document
      }
    }

    // Upload files to Cloudinary
    const facilityImageUpload = await cloudinary.uploader.upload(files.facilityImage[0].path);
    const certificateUpload = await cloudinary.uploader.upload(files.accreditedCertificate[0].path);
    const utilityBillUpload = await cloudinary.uploader.upload(files.utilityBill[0].path);

    // Save the new KYC data
    const kycData = await KYC.create({
      hospital: hospitalId,
      facilityImage: facilityImageUpload.secure_url,
      accreditedCertificate: certificateUpload.secure_url,
      licenseNumber,
      utilityBill: utilityBillUpload.secure_url,
      status: 'pending', // Set status to 'pending' for new submissions
    });

    // Mark hospital as KYC complete (optional, depends on your logic)
    await Hospital.findByIdAndUpdate(hospitalId, { kycCompleted: true });

    res.status(201).json({ message: 'KYC submitted successfully', kycData });
  } catch (error) {
    console.error('KYC Error:', error);
    res.status(500).json({ message: 'KYC submission failed', error: error.message });
  }
};
