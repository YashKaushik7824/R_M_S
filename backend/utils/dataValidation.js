// Validate that a string is not empty
const isNotEmpty = (value) => {
    return value && value.trim().length > 0;
  };
  
  // Validate that a value is a valid number
  const isValidNumber = (value) => {
    return !isNaN(value) && value !== null && value !== '';
  };
  
  // Validate the student ID format
  const isValidStudentId = (studentId) => {
    // Assuming student IDs are alphanumeric and 6-10 characters long
    const studentIdPattern = /^[A-Za-z0-9]{6,10}$/;
    return studentIdPattern.test(studentId);
  };
  
  // Validate attendance marks (e.g., should be between 0 and 100)
  const isValidAttendanceMarks = (marks) => {
    return isValidNumber(marks) && marks >= 0 && marks <= 100;
  };
  
  // Validate project review marks (e.g., should be between 0 and 50)
  const isValidReviewMarks = (marks) => {
    return isValidNumber(marks) && marks >= 0 && marks <= 50;
  };
  
  // Validate assessment marks (e.g., should be between 0 and 100)
  const isValidAssessmentMarks = (marks) => {
    return isValidNumber(marks) && marks >= 0 && marks <= 100;
  };
  
  // Validate project submission marks (e.g., should be between 0 and 50)
  const isValidSubmissionMarks = (marks) => {
    return isValidNumber(marks) && marks >= 0 && marks <= 50;
  };
  
  // Validate LinkedIn post marks (e.g., should be between 0 and 10)
  const isValidPostMarks = (marks) => {
    return isValidNumber(marks) && marks >= 0 && marks <= 10;
  };
  
  // Main validation function to check if the data is valid
  const validateData = (data, type) => {
    switch (type) {
      case 'attendance':
        return isValidStudentId(data.studentId) && isValidAttendanceMarks(data.attendanceMarks);
      case 'projectReview':
        return isValidStudentId(data.studentId) && isValidReviewMarks(data.reviewMarks);
      case 'assessment':
        return isValidStudentId(data.studentId) && isValidAssessmentMarks(data.assessmentMarks);
      case 'projectSubmission':
        return isValidStudentId(data.studentId) && isValidSubmissionMarks(data.submissionMarks);
      case 'linkedInPost':
        return isValidStudentId(data.studentId) && isValidPostMarks(data.postMarks);
      default:
        return false;
    }
  };
  
  module.exports = {
    validateData,
    isNotEmpty,
    isValidNumber,
    isValidStudentId,
    isValidAttendanceMarks,
    isValidReviewMarks,
    isValidAssessmentMarks,
    isValidSubmissionMarks,
    isValidPostMarks,
  };
  