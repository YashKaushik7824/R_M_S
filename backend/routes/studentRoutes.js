const express = require('express');
const router = express.Router();
const { getStudentResults } = require('../controllers/studentController');

// Route to get student results
router.get('/results/:studentId', getStudentResults);

module.exports = router;
