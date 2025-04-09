const express = require("express");
const router = express.Router();
const { adminRegister, adminLogin, viewUsers, deleteUser, verifyKYC, forgotPassword, resetPassword } = require("../controller/adminController");
const  authenticateAdmin  = require("../middleware/authMiddleware");  // Authentication middleware


/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - role
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Validation error or email exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", adminRegister);


// Admin Login (Public route)
router.post("/login", adminLogin);
router.post('/forgotPassword',  forgotPassword);
router.post('/resetPassword', authenticateAdmin, resetPassword);


// Admin actions - protected by authentication middleware
router.get("/users", authenticateAdmin, viewUsers); // View all users (Admin only)
router.delete("/delete/:userId", authenticateAdmin, deleteUser); // Delete user (Admin only)
router.put("/verify-kyc/:hospitalId", authenticateAdmin, verifyKYC); // Verify Hospital KYC (Admin only)

module.exports = router;
