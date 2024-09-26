const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import route files
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const projectReviewRoutes = require('./routes/projectReviewRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const projectSubmissionRoutes = require('./routes/projectSubmissionRoutes');
const linkedInPostRoutes = require('./routes/linkedInPostRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/projectReview', projectReviewRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/projectSubmission', projectSubmissionRoutes);
app.use('/api/linkedInPost', linkedInPostRoutes);
app.use('/api/student', studentRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
