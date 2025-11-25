// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection URL from .env
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    // Create a new MongoDB client
    const client = new MongoClient(url);

    try {
        // ✅ Task 1: Connect to MongoDB
        await client.connect();

        // ✅ Task 2: Connect to database giftDB and store in variable dbInstance
        dbInstance = client.db(dbName);

        console.log("✅ Connected to MongoDB successfully");

        // ✅ Task 3: Return database instance
        return dbInstance;
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        throw error;
    }
}

module.exports = connectToDatabase;