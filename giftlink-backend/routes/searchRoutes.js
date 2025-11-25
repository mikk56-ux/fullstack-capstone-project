/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // ✅ Task 1: Connect to MongoDB using connectToDatabase database
        const db = await connectToDatabase();

        // ✅ Get the collection
        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // ✅ Task 2: Add the name filter (case-insensitive search)
        if (req.query.name && req.query.name !== "") {
            query.name = { $regex: req.query.name, $options: "i" };
        }

        // ✅ Task 3: Add other filters to the query
        if (req.query.category && req.query.category !== "") {
            query.category = req.query.category;
        }

        if (req.query.condition && req.query.condition !== "") {
            query.condition = req.query.condition;
        }

        if (req.query.age_years && req.query.age_years !== "") {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        // ✅ Task 4: Fetch filtered gifts using the find(query) method
        const gifts = await collection.find(query).toArray();

        // ✅ Return filtered results
        res.json(gifts);

    } catch (e) {
        console.error("Error fetching filtered gifts:", e);
        next(e);
    }
});

module.exports = router;