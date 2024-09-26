const Attendance = require('../models/attendanceModel');
const Assessment = require('../models/assessmentModel');
const ProjectReview = require('../models/projectReviewModel');
const LinkedInPost = require('../models/linkedInPostModel');

exports.getStudentResults = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Fetch data from all models
    const [attendance, assessments, projectReviews, linkedInPosts] = await Promise.all([
      Attendance.find({ studentId }).lean(),
      Assessment.find({ studentId }).lean(),
      ProjectReview.find({ studentId }).lean(),
      LinkedInPost.find({ studentId }).lean()
    ]);

    // Aggregate results
    const results = {
      attendance,
      assessments,
      projectReviews,
      linkedInPosts
    };

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving student results' });
  }
};
