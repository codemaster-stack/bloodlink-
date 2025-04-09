const express = require('express');
const router = express.Router();
const { submitKYC } = require('../controller/kycController');
const upload = require('../config/multaConfig'); // Multer middleware
const { verifyToken } = require('../middleware/authMiddleware'); // Your auth

// Upload fields (match the form field names)
const kycUpload = upload.fields([
  { name: 'facilityImage', maxCount: 1 },
  { name: 'accreditedCertificate', maxCount: 1 },
  { name: 'utilityBill', maxCount: 1 }
]);

// POST /api/kyc/submit
router.post('/submit',  submitKYC);

module.exports = router;
