const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controller/authController');

router.post('/register', register); // For donor/hospital registration
router.post('/login', login); // For login
router.post('/forgotPassword', forgotPassword); // For forgotpassword
router.post('/resetPassword', resetPassword); // For password reset

module.exports = router;
