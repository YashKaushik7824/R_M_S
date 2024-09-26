const express = require('express');
const { uploadProjectReview, getProjectReview } = require('../controllers/projectReviewController');
const upload = require('../middlewares/upload'); 

const router = express.Router();

router.post('/upload', upload.single('file'), uploadProjectReview);
router.get('/', getProjectReview);

module.exports = router;
