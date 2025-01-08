
// TROUBLE SHOOTING
//require('dotenv').config();
//console.log('MONGO_URI:', process.env.MONGO_URI);

const result = require('dotenv').config();

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Environment variables loaded:', result.parsed);
}



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



// Import Routes
const gearRoutes = require('./routes/gearRoutes.js');
const departmentRoutes = require('./routes/departmentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Initialize App
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Use Routes
app.use('/api/gear', gearRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/booking', bookingRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
