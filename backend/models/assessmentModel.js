const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  assessmentId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

// Create a compound index to ensure uniqueness
assessmentSchema.index({ studentId: 1, assessmentId: 1 }, { unique: true });

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
