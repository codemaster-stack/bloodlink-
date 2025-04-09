const  donorModel  = require("../models/donorModel"); 
const hospitalModel = require("../models/hospitalModel"); 
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const resetMail = require("../utils/resetMail"); 
const  sendEmail  = require("../utils/email");
require("dotenv").config(); 
const  Appointment  = require("../models/appointmentModel");


exports.register =async (req, res) => {

  try {
    const { fullName, email, age, location, bloodType, haveYouDonatedBefore, role, password } = req.body;

    console.log('Request body:', req.body);
    // Validate input
    if (!fullName || !email || !age || !location || !bloodType || !haveYouDonatedBefore || !role || !password) {
      return res.status(400).json({
        message: "All fields (fullName, email, age, location, bloodType, haveYouDonatedBefore, role, password) are required",
      });
    }

    const emailNormalized = email.toLowerCase();
    const donorExists = await donorModel.findOne({ email: emailNormalized });

    if (donorExists) {
      return res.status(400).json({
        message: `Email ${email} is already registered`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const donor = new donorModel({
      fullName: fullName.trim(),
      email: emailNormalized,
      age,
      location,
      bloodType,
      haveYouDonatedBefore,
      role,
      password: hashedPassword,
    });

    await donor.save();

    res.status(201).json({
      message: "Donor created successfully",
      data: donor,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error " + error.message,
    });
  }
};


  exports.login = async (req, res)=>{
    try{
      const {email, password} = req.body;
      if(email == undefined || password == undefined){
        return res.status(400).json({
          message: 'Email and password required'
        })
      }
  
    const donor = await donorModel.findOne({email: email.toLowerCase() });
    if(donor == null){
      return res.status(404).json({
        message: 'Donor Not Found'
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, donor.password)
    if(isPasswordCorrect == false){
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    }
    const token = await jwt.sign({ donorId: donor._id}, process.env.key, { expiresIn: "1d" });
    res.status(200).json({
      message: 'Logged In Successfully',
      data: donor,
      token
    })
    }catch(error){
      console.log(error.message)
      res.status(500).json({
        message: 'Internal Server Error '+ error.message
      })
    }
  }

  exports.getAllHospital = async (req, res) =>{
    try{
      const hospital = await hospitalModel.find();
    res.status(200).json({
      message: "All Donor's in the database",
      data: hospital
    })}
    catch(error){
      console.log(error.message);
      res.status(500).json({
        message: 'Internal Server Error' + error.message
      })
      
    }
  
  }

  exports.forgotPassword = async (req, res)=>{
    try{
        const { email } = req.body;
        const checkEmail = await donorModel.findOne({email})
        if(!checkEmail){
            return res.status(404).json({
                message: 'Email not found'
            })
        }
        const token = jwt.sign({id:checkEmail._id}, "secret_key", {expiresIn: '20min'})
        const link = `${req.protocol}://${req.get('host')}/resetPassword/${token}`
        const subject = "Reset Password" + " " + checkEmail.fullName;
        const text = `Reset Password ${checkEmail.fullName}, kindly use this link to reset your password ${link} `;
         sendMail({subject:subject, email:checkEmail.email, html:resetMail(link, checkEmail.fullName)})
         res.status(200).json({
            message: 'Reset password link sent successfully'
        })
                        

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.resetNewPassword = async (req, res) =>{
    try{
        const {newPassword} = req.body;
        const checkdonor = await donorModel.findById(req.params.id)
        if(!checkdonor){
            return res.status(404).json({
                message: 'Donor not found'
            })
        }
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(newPassword, salt);
       
        await donorModel.findByIdAndUpdate(req.params.id, {password:hash})
        
        res.status(200).json({
            message: 'Password change Successfully'
        })

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.changePassword = async (req, res) =>{
    try{
        const { id, newPassword } = req.body;
        const checkdonor = await donorModel.findById( id )
        if(!checkdonor){
            return res.status(404).json({
                message: 'Donor not found'
            })
        }
        

        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(newPassword, salt);
        const findDonor = await donorModel.findByIdAndUpdate(id, {password: hashedPassword})
        
        if(!findDonor){
            return res.status(400).json({
                message: 'Failed to change password'
            })

        }
        res.status(200).json({
            message: 'Password changed successfully'
        })
    }catch(error){
        res.status(500).json({
            message: "internal server error" + error.message
        })
    }
}


exports.viewHospitals = async (req, res) => {
  try {
    // Fetch hospitals list
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.bookAppointment = async (req, res) => {
  const { hospitalId, date, time } = req.body;
  
  try {
    const appointment = new Appointment({
      donor: req.user.id,
      hospital: hospitalId,
      date,
      time,
    });
    await appointment.save();
    
    // Send email notification to the hospital
    sendEmail(
      'hospital-email@example.com',
      'Appointment Request',
      `A donor wants to book an appointment with you. Please log into the Lifelink app to read, add, confirm, or reschedule.`
    );

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error booking appointment' });
  }
};

