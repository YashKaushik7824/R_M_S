const express = require('express');
const { uploadLinkedInPost, getLinkedInPost } = require('../controllers/linkedInPostController');
const upload = require('../middlewares/upload'); 

const router = express.Router();

router.post('/upload', upload.single('file'), uploadLinkedInPost);
router.get('/', getLinkedInPost);

module.exports = router;
