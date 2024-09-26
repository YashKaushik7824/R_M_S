const ExcelJS = require('exceljs');
const Assessment = require('../models/assessmentModel');

exports.uploadAssessment = async (req, res) => {
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
      const [studentId, assessmentId, score] = row.values.slice(1, 4); // Adjust indices as necessary
      // Ensure data matches schema
      if (studentId && assessmentId && score) {
        data.push({ studentId, assessmentId, score });
      }
    });

    // Extract unique entries
    const uniqueData = [];
    const existingEntries = new Set();

    for (const entry of data) {
      const key = `${entry.studentId}-${entry.assessmentId}`;
      if (!existingEntries.has(key)) {
        existingEntries.add(key);
        uniqueData.push(entry);
      }
    }

    // Check for existing records in the database
    const existingRecords = await Assessment.find({
      $or: uniqueData.map(item => ({
        studentId: item.studentId,
        assessmentId: item.assessmentId,
      }))
    }).lean();

    const existingKeys = new Set(existingRecords.map(item => `${item.studentId}-${item.assessmentId}`));
    const newEntries = uniqueData.filter(item => !existingKeys.has(`${item.studentId}-${item.assessmentId}`));

    // Insert new unique data into database
    if (newEntries.length > 0) {
      await Assessment.insertMany(newEntries);
    }

    res.status(200).json({
      message: 'Assessment data uploaded successfully',
      insertedCount: newEntries.length,
      duplicateCount: uniqueData.length - newEntries.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading Assessment data' });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
