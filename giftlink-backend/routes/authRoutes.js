// Step 2 - Task 2: Import necessary packages
const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger

// Step 3 - Create a Pino logger instance
const logger = pino();

// Step 4 - Load environment variables and create JWT secret
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Step 1 - Task 4: Create register endpoint
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const usersCollection = db.collection('users');

        // Task 3: Check for existing email
        const existingUser = await usersCollection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        // Task 4: Save user details in database
        const result = await usersCollection.insertOne({
            email,
            password: hash,
            username: req.body.username
        });

        const userId = result.insertedId;

        // Task 5: Create JWT authentication with user._id as payload
        const authtoken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

        logger.info('User registered successfully');

        res.json({ authtoken, email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});


router.post('/login', async (req, res) => {
    try {
      // 🧩 Task 1: Connect to giftsdb in MongoDB
      const db = await connectToDatabase();
  
      // 🧩 Task 2: Access MongoDB users collection
      const collection = db.collection('users');
  
      // 🧩 Task 3: Check user credentials by email
      const theUser = await collection.findOne({ email: req.body.email });
  
      // 🧩 Task 7: Send message if user not found
      if (!theUser) {
        if (logger) logger.error('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
  
      // 🧩 Task 4: Compare entered password with encrypted password
      const isMatch = await bcryptjs.compare(req.body.password, theUser.password);
      if (!isMatch) {
        if (logger) logger.error('Passwords do not match');
        return res.status(401).json({ error: 'Wrong password' });
      }
  
      // 🧩 Task 5: Fetch user details
      const userName = theUser.firstName;
      const userEmail = theUser.email;
  
      // 🧩 Task 6: Create JWT authentication with user._id as payload
      const payload = {
        user: {
          id: theUser._id.toString(),
        },
      };
  
      const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  
      // ✅ Send response on success
      res.json({ authtoken, userName, userEmail });
    } catch (e) {
      console.error('Error during login:', e.message);
      return res.status(500).send('Internal server error');
    }
  });


  router.put(
    '/update',
    // You can add validation rules here using express-validator
    [
      body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
      body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
      // 🧩 Task 2: Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        // 🧩 Task 3: Check if email is present in request headers
        const email = req.headers.email;
        if (!email) {
          logger.error('Email not found in the request headers');
          return res.status(400).json({ error: 'Email not found in the request headers' });
        }
  
        // 🧩 Task 4: Connect to giftsdb in MongoDB
        const db = await connectToDatabase();
        const collection = db.collection('users');
  
        // 🧩 Task 5: Find user credentials in the database
        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Update timestamp
        existingUser.updatedAt = new Date();
  
        // Merge updates (optional: name, password, etc.)
        if (req.body.name) existingUser.name = req.body.name;
        if (req.body.password) existingUser.password = req.body.password; // In production, you’d hash this
  
        // 🧩 Task 6: Update user credentials in database
        const updatedUser = await collection.findOneAndUpdate(
          { email },
          { $set: existingUser },
          { returnDocument: 'after' }
        );
  
        // 🧩 Task 7: Create JWT authentication with user._id as payload
        const payload = {
          user: {
            id: updatedUser.value._id.toString(),
          },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
  
        // Respond with token
        res.json({ authtoken });
      } catch (e) {
        logger.error('Error while updating user', e);
        return res.status(500).send('Internal server error');
      }
    }
  );
  

module.exports = router;