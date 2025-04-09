const express = require('express');
const router = express.Router();
const { searchForDonors, register, login, bookAppointment, forgotPassword, resetPassword, updateProfile } = require('../controller/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const kycMiddleware = require('../middleware/kycMiddleware');

router.get('/search-donors', authMiddleware, kycMiddleware, searchForDonors);
router.post('/register', register);
router.post('/login', login);
router.post('/appointment', bookAppointment);
router.post('/forgotPassword',  forgotPassword);
router.post('/resetPassword', authMiddleware, resetPassword);
router.patch('/updateProfile', authMiddleware,  updateProfile);







module.exports = router;
