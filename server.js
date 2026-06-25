const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ["https://tea-shop-pos-frontend.vercel.app/", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Connect Database
connectDB();

// API Routes 
app.use('/api', require('./routes/api'));

// Test Route
app.get('/', (req, res) => res.send('POS API Running...'));


app.get('/setup-admin', async (req, res) => {
  try {
   
    const mongoose = require('mongoose');
    
    
    const db = mongoose.connection;
    await db.collection('staffs').deleteOne({ username: 'admin' }); 
    
    await db.collection('staffs').insertOne({
      staffName: "Thant Zin Oo",
      username: "admin",
      password: "admin123", 
      role: "admin"
    });
    
    res.send("🎉 Admin Account Created Successfully! Username: admin , Password: admin123");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));