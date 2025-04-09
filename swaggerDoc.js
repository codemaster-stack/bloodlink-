/**
 * Swagger Definitions for Admin and Hospital Endpoints
 */

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin management endpoints
 *   - name: Hospital
 *     description: Hospital actions and authentication
 */

/** --------------------- ADMIN ROUTES --------------------- */

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
 *             required: [fullName, email, role, password]
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
 *         description: Admin created successfully
 *       400:
 *         description: Bad request - missing or invalid fields
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
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Missing or invalid credentials
 *       401:
 *         description: Unauthorized - incorrect email or password
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

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all donors and hospitals
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/delete/{userId}:
 *   delete:
 *     summary: Delete a user (donor or hospital)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/verify-kyc/{hospitalId}:
 *   put:
 *     summary: Verify a hospital's KYC
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: KYC approved
 *       400:
 *         description: Invalid hospital ID
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Internal server error
 */

/** --------------------- HOSPITAL ROUTES --------------------- */

/**
 * @swagger
 * /api/hospital/register:
 *   post:
 *     summary: Hospital registration
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, location, password]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital registered successfully
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/login:
 *   post:
 *     summary: Hospital login
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/search-donors:
 *   get:
 *     summary: Search for donors (authenticated + KYC)
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Donors retrieved
 *       401:
 *         description: Unauthorized or KYC not completed
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/appointment:
 *   post:
 *     summary: Book a donor appointment
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donorId:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment booked
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/forgotPassword:
 *   post:
 *     summary: Hospital forgot password
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
 *         description: Reset link sent
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/hospital/resetPassword:
 *   post:
 *     summary: Reset hospital password
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
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid token or password
 *       401:
 *         description: Unauthorized
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
 *       content:
 *         application/json:
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
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
