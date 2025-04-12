const express = require("express"); 
const router = express.Router();
const { adminRegister, adminLogin, viewUsers, deleteUser, approveKYC, declineKYC, forgotPassword, resetPassword } = require("../controller/adminController");
const authenticateAdmin = require("../middleware/authMiddleware");  // Authentication middleware

// Admin Register (Public route)
router.post("/register", adminRegister);

// Admin Login (Public route)
router.post("/login", adminLogin);

// Forgot Password (Public route)
router.post('/forgotPassword', forgotPassword);

// Reset Password (Protected by Admin authentication)
router.post('/resetPassword', authenticateAdmin, resetPassword);

// Admin actions - protected by authentication middleware
// View all users (Admin only)
router.get("/users", authenticateAdmin, viewUsers); 

// Delete user (Admin only)
router.delete("/delete/:userId", authenticateAdmin, deleteUser); 

// Approve Hospital KYC (Admin only)
router.patch("/verify-kyc/:kycId", authenticateAdmin, approveKYC); 

// Decline Hospital KYC (Admin only)
router.patch("/decline-kyc/:kycId", authenticateAdmin, declineKYC); 

module.exports = router;
