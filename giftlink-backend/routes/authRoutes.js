// routes/authRoutes.js
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');

// Step 1: Create Pino logger instance
const logger = pino();

// Load environment variables
dotenv.config();

// Step 2: Create JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET;

// Step 3: Implement the /register endpoint
router.post('/register', [
    // Input validation
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty()
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Step 3.1: Connect to MongoDB
        const db = await connectToDatabase();
        
        // Step 3.2: Access users collection
        const collection = db.collection("users");
        
        // Step 3.3: Check for existing email
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // Step 3.4: Save user details in database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Step 3.5: Create JWT authentication
        const payload = {
            user: {
                id: newUser.insertedId.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        
        logger.info('User registered successfully');
        res.json({ authtoken, email: req.body.email });
        
    } catch (e) {
        logger.error('Registration error:', e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;