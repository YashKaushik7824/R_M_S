const ExcelJS = require('exceljs');
const ProjectSubmission = require('../models/projectSubmissionModel');

exports.uploadProjectSubmission = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    const data = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const [studentId, projectId, submissionScore] = row.values.slice(1, 4); // Adjust indices as necessary

      // Ensure data matches schema
      if (studentId && projectId && submissionScore) {
        data.push({ studentId, projectId, submissionScore });
      }
    });

    // Extract unique entries
    const uniqueData = [];
    const existingEntries = new Set();

    for (const entry of data) {
      const key = `${entry.studentId}-${entry.projectId}`;
      if (!existingEntries.has(key)) {
        existingEntries.add(key);
        uniqueData.push(entry);
      }
    }

    // Check for existing records in the database
    const existingRecords = await ProjectSubmission.find({
      $or: uniqueData.map(item => ({
        studentId: item.studentId,
        projectId: item.projectId,
      }))
    }).lean();

    const existingKeys = new Set(existingRecords.map(item => `${item.studentId}-${item.projectId}`));
    const newEntries = uniqueData.filter(item => !existingKeys.has(`${item.studentId}-${item.projectId}`));

    // Insert new unique data into database
    if (newEntries.length > 0) {
      await ProjectSubmission.insertMany(newEntries);
    }

    res.status(200).json({
      message: 'Project submission data uploaded successfully',
      insertedCount: newEntries.length,
      duplicateCount: uniqueData.length - newEntries.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading Project submission data' });
  }
};

exports.getProjectSubmission = async (req, res) => {
  try {
    const projectSubmission = await ProjectSubmission.find();
    res.status(200).json(projectSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
