const mongoose = require('mongoose');

const projectSubmissionSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  submissionScore: {
    type: Number,
    required: true,
  },
});

// Create a compound index to ensure uniqueness
projectSubmissionSchema.index({ studentId: 1, projectId: 1 }, { unique: true });

const ProjectSubmission = mongoose.model('ProjectSubmission', projectSubmissionSchema);
module.exports = ProjectSubmission;
