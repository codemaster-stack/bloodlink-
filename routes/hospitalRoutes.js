const express = require('express');
const router = express.Router();
const { searchForDonors, register, login, forgotPassword, submitBloodRequest, getHospitalProfile, getBloodRequestHistory, resetPassword, updateProfile } = require('../controller/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const kycMiddleware = require('../middleware/kycMiddleware');

router.get('/search-donors', authMiddleware, kycMiddleware, searchForDonors);
router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword',  forgotPassword);
router.post('/resetPassword', authMiddleware, resetPassword);
router.patch('/updateProfile', authMiddleware,  updateProfile);
router.post("/request-blood", authMiddleware, submitBloodRequest);
router.get('/history', authMiddleware, getBloodRequestHistory);

router.get('/profile', authMiddleware, getHospitalProfile);







module.exports = router;
