const mongoose = require('mongoose');

const projectReviewSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  projectId:{
    type: String,
    required: true,
  },
  reviewScore: {
    type: Number,
    required: true,
  },
});

projectReviewSchema.index({ studentId: 1, projectId: 1 }, { unique: true });

const ProjectReview = mongoose.model('ProjectReview', projectReviewSchema);
module.exports = ProjectReview;
