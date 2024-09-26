const express = require('express');
const { uploadAssessment, getAssessment } = require('../controllers/assessmentController');
const upload = require('../middlewares/upload'); 

const router = express.Router();

router.post('/upload', upload.single('file'), uploadAssessment);
router.get('/', getAssessment);

module.exports = router;
