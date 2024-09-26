const mongoose = require('mongoose');

const linkedInPostSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

// Create a compound index to ensure uniqueness
linkedInPostSchema.index({ studentId: 1, postId: 1 }, { unique: true });

const LinkedInPost = mongoose.model('LinkedInPost', linkedInPostSchema);
module.exports = LinkedInPost;
