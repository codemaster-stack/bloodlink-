/**
 * Swagger Definitions for Admin and Hospital Endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/** --------------------- ADMIN ROUTES --------------------- */


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API for Admin actions
 */

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
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - fullName
 *               - email
 *               - role
 *               - password
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (donors and hospitals)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/{userId}:
 *   delete:
 *     summary: Delete a user (either donor or hospital)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/verify-kyc/{kycId}:
 *   patch:
 *     summary: Approve KYC for a hospital
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kycId
 *         required: true
 *         description: The KYC ID to approve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC approved successfully
 *       400:
 *         description: KYC has already been processed
 *       404:
 *         description: KYC not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/decline-kyc/{kycId}:
 *   patch:
 *     summary: Decline KYC for a hospital
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kycId
 *         required: true
 *         description: The KYC ID to decline
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC declined successfully
 *       400:
 *         description: Cannot decline KYC in its current state
 *       404:
 *         description: KYC not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/forgotPassword:
 *   post:
 *     summary: Send password reset email to admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent
 *       400:
 *         description: Invalid email format or missing email
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/resetPassword:
 *   post:
 *     summary: Reset admin password
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired token
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

 

/** --------------------- HOSPITAL ROUTES --------------------- */

/**
 * @swagger
 * /api/hospital/register:
 *   post:
 *     summary: Register a new hospital
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *       400:
 *         description: Bad Request – Missing or invalid fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/login:
 *   post:
 *     summary: Login a hospital
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hospital logged in successfully
 *       400:
 *         description: Bad Request – Missing email or password
 *       401:
 *         description: Unauthorized – Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/search-donors:
 *   get:
 *     summary: Search for available blood donors
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available blood donors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Bad Request – KYC not completed
 *       403:
 *         description: Forbidden – Only hospitals can search for donors
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/request-blood:
 *   post:
 *     summary: Submit a blood request
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloodGroup:
 *                 type: string
 *               numberOfPints:
 *                 type: integer
 *               preferredDate:
 *                 type: string
 *                 format: date
 *               urgencyLevel:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Blood request submitted successfully
 *       403:
 *         description: Forbidden – Only hospitals can make a blood request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/history:
 *   get:
 *     summary: Get blood request history for a hospital
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past blood requests for the hospital
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BloodRequest'
 *       403:
 *         description: Forbidden – Only hospitals can view their blood request history
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/profile:
 *   get:
 *     summary: Get hospital profile
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hospital profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       401:
 *         description: Unauthorized – Invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/updateProfile:
 *   patch:
 *     summary: Update hospital profile
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad Request – Error with file upload or missing data
 *       401:
 *         description: Unauthorized – Invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/forgotPassword:
 *   post:
 *     summary: Send password reset link to hospital email
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       400:
 *         description: Bad Request – Email is required
 *       404:
 *         description: Not Found – Hospital not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/resetPassword:
 *   post:
 *     summary: Reset hospital password using token
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad Request – Token and new password are required
 *       404:
 *         description: Not Found – Hospital not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/kyc/submit:
 *   post:
 *     summary: Submit KYC
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               licenseNumber:
 *                 type: string
 *               facilityImage:
 *                 type: string
 *                 format: binary
 *               accreditedCertificate:
 *                 type: string
 *                 format: binary
 *               utilityBill:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: KYC submitted successfully
 *       400:
 *         description: A KYC is already pending or invalid submission
 *       401:
 *         description: Unauthorized – Invalid token
 *       500:
 *         description: Internal server error
 */
