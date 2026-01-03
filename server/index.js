const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
const connectDB = require('./config/database-mongo');
connectDB();

// Seed database with default subjects
const { seedSubjects } = require('./utils/seedDatabase');
seedSubjects();

// Create uploads directory if it doesn't exist
require('./utils/createUploadsDir');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/chapters', require('./routes/chapters'));
app.use('/api/study', require('./routes/study'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/planner', require('./routes/planner'));
app.use('/api/ai-analytics', require('./routes/ai-analytics'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SikshaBuddy API is running' });
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SikshaBuddy server running on port ${PORT}`);
});

