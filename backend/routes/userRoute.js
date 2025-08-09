import express  from 'express'
import { createUser, signInUser,getAllUsers } from '../controllers/userControler.js'
import { upload } from '../middlewares/upload.js' 
import { validate } from '../middlewares/validateZod.js'
import { createUserSchema } from '../schema/userValidateSchema.js'
import { createTransectionSchema } from '../schema/transectionValidateSchema.js'
import { protect } from '../middlewares/authenticate.js'
import { authorize } from '../middlewares/authorize.js'
import { createTransaction, deleteTransection, getMonthlySummary, getTransactions, updateTransection } from '../controllers/transectionControler.js'
const  router = express.Router()

// All Routes Here

// router.get('/auth/users',getAllUsers)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */

router.post('/auth/register', upload.single('profilePicture'), validate(createUserSchema),createUser)


 /**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
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
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

router.post('/auth/login',signInUser);


/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile info
 *       401:
 *         description: Unauthorized
 */

router.get('/auth/profile', (req,res)=>{
     console.log('show me user info :', req.user);
  res.json(req.user) 
})


/**
 * @swagger
 * /auth/admin:
 *   get:
 *     summary: Admin-only route to verify role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       403:
 *         description: Forbidden - not an admin
 *       401:
 *         description: Unauthorized
 */


router.get('/auth/admin', protect,authorize('admin'))


/**
 * @swagger
 * /transection/create:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, amount, categoryType, category, date]
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               categoryType:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Validation error
 */


router.post('/transection/create', protect, validate(createTransectionSchema), createTransaction)

/**
 * @swagger
 * /transections/get:
 *   get:
 *     summary: Get all transactions of the current user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of transactions
 *       401:
 *         description: Unauthorized
 */


router.get('/transections/get', protect, getTransactions)

/**
 * @swagger
 * /transections/monthly-summary:
 *   get:
 *     summary: Get monthly transaction summary
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly income and expense summary
 *       401:
 *         description: Unauthorized
 */


router.get('/transections/monthly-summary', protect, getMonthlySummary)  

/**
 * @swagger
 * /transections/update/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               categoryType:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         description: Transaction not found
 */

router.put('/transections/update/:id', protect, updateTransection)

/**
 * @swagger
 * /transections/delete/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID to delete
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 */


router.delete('/transections/delete/:id', protect, deleteTransection)

/**
 * @swagger
 * /auth/admin-overview:
 *   get:
 *     summary: Get admin dashboard overview (only for admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user count, top categories, etc.
 *       403:
 *         description: Forbidden - not an admin
 */


router.get('/admin-overview',  getAllUsers)

export default router