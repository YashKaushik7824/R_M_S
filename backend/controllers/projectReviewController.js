const ExcelJS = require('exceljs');
const ProjectReview = require('../models/projectReviewModel');

exports.uploadProjectReview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    const data = [];
    const existingEntries = new Set();

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const [studentId, projectId, reviewScore] = row.values.slice(1, 4); // Adjust indices as necessary

      // Ensure data matches schema
      if (studentId && projectId && reviewScore) {
        const entryKey = `${studentId}-${projectId}`;
        if (!existingEntries.has(entryKey)) {
          existingEntries.add(entryKey);
          data.push({ studentId, projectId, reviewScore });
        }
      }
    });

    // Check for existing records in the database
    const existingRecords = await ProjectReview.find({
      $or: data.map(item => ({
        studentId: item.studentId,
        projectId: item.projectId,
      }))
    }).lean();

    const existingKeys = new Set(existingRecords.map(item => `${item.studentId}-${item.projectId}`));
    const newEntries = data.filter(item => !existingKeys.has(`${item.studentId}-${item.projectId}`));

    // Insert new unique data into database
    if (newEntries.length > 0) {
      await ProjectReview.insertMany(newEntries);
    }

    res.status(200).json({
      message: 'Project review data uploaded successfully',
      insertedCount: newEntries.length,
      duplicateCount: data.length - newEntries.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading Project review data' });
  }
};

exports.getProjectReview = async (req, res) => {
  try {
    const projectReviews = await ProjectReview.find();
    res.status(200).json(projectReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
