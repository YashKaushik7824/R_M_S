const express = require('express');
const { uploadProjectSubmission, getProjectSubmission } = require('../controllers/projectSubmissionController');
const upload = require('../middlewares/upload'); 
const router = express.Router();

router.post('/upload', upload.single('file'), uploadProjectSubmission);
router.get('/', getProjectSubmission);

module.exports = router;
