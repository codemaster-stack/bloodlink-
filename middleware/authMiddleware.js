const jwt = require('jsonwebtoken');
const hospitalModel = require('../models/hospitalModel');
const adminModel = require('../models/adminModel');  // Assuming you have an admin model to check for admin users

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is a hospital or admin, based on the token (decoded)
    const hospital = await hospitalModel.findById(decoded.id || decoded._id);
    const admin = await adminModel.findById(decoded.id || decoded._id);  // Check for admin

    // If not found in hospital or admin model
    if (!hospital && !admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If it's a hospital role
    if (hospital) {
      req.user = {
        id: hospital._id,
        hospitalId: hospital._id,
        email: hospital.email,
        name: hospital.name || null,
        role: 'hospital',
        isKycVerified: hospital.kycVerified || false,
      };
    }

    // If it's an admin role
    if (admin) {
      req.user = {
        id: admin._id,
        email: admin.email,
        role: 'admin',
      };
    }

    // Check if the user is an admin for routes requiring admin access
    if (req.originalUrl.startsWith('/admin') && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    console.log('req.user:', req.user);  // For debugging purposes

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

module.exports = authMiddleware;
