// models/db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

let dbInstance = null;
const dbName = "giftdb"; // must match your DB name
const url = process.env.MONGO_URL; // from .env file

async function connectToDatabase() {
    if (dbInstance) return dbInstance;

    const client = new MongoClient(url);
    await client.connect();
    dbInstance = client.db(dbName);

    return dbInstance;
}

module.exports = connectToDatabase;
