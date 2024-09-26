const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Import multer middleware
const { uploadAttendance, getAttendance } = require('../controllers/attendanceController');

// Route for uploading attendance data
router.post('/upload', upload.single('file'), uploadAttendance);
router.get('/', getAttendance);

module.exports = router;
