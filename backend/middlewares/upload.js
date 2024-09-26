const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.memoryStorage();

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx') {
      return cb(new Error('Only .xlsx files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
