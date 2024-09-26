const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const projectReviewRoutes = require('./routes/projectReviewRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const projectSubmissionRoutes = require('./routes/projectSubmissionRoutes');
const linkedInPostRoutes = require('./routes/linkedInPostRoutes');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Handles JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/project-review', projectReviewRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/project-submission', projectSubmissionRoutes);
app.use('/api/linkedin-post', linkedInPostRoutes);
app.use('/api/student', studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

module.exports = app;
