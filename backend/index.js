const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const agricultureRoutes = require('./routers/agriculture.routes');
const cropRoutes = require('./routers/crop.routes');
const cors = require('cors'); // 🟢 thêm dòng này

const app = express();
const port = process.env.PORT || 3003;

// 🟢 Bật CORS
app.use(cors({
  origin: 'http://localhost:3000', // Cho phép frontend React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Kết nối MongoDB
mongoose.connect(process.env.DATABASE)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// Routes
app.use('/agriculture', agricultureRoutes);
app.use('/crop', cropRoutes);


// Test server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
