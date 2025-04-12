const kycMiddleware = (req, res, next) => {
  console.log('KYC Verified Status:', req.user.isKycVerified);
  if (!req.user.isKycVerified) {
    return res.status(400).json({ message: 'KYC not completed' });
  }
  next();
};

module.exports = kycMiddleware;
