/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');
const connectToDatabase = require('./models/db');
const { loadData } = require("./util/import-mongo/index");
const pinoHttp = require('pino-http');
const logger = require('./logger');

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://abhinavnbinu-3000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true
}));

app.use(express.json());
app.use(pinoHttp({ logger }));

const port = process.env.PORT || 3060;

// Connect to MongoDB once
connectToDatabase()
    .then(() => pinoLogger.info('Connected to DB'))
    .catch((e) => console.error('Failed to connect to DB', e));

// Route files
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.send("Inside the server");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});