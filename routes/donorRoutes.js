const express = require('express');
const router = express.Router();
const { register, login, getAllHospital, resetNewPassword, changePassword, forgotPassword, viewHospitals  } = require('../controller/donorController');
const { registerValidate } = require('../middleware/validate');

router.post('/register', registerValidate, register);
router.post('/donor/login', login);
// router.post('/appointment', bookAppointment)
router.get('/donor/getAll', getAllHospital);
router.get('/donor/viewOne/:name', viewHospitals)
router.patch('/forgot', forgotPassword);
router.patch('/resetPassword/:token', resetNewPassword);
router.patch('/change', changePassword);


module.exports = router;

