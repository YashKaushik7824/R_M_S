const ExcelJS = require('exceljs');
const LinkedInPost = require('../models/linkedInPostModel');

exports.uploadLinkedInPost = async (req, res) => {
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
      const [studentId, postId, score] = row.values.slice(1, 4); // Adjust indices as necessary
      // Ensure data matches schema
      if (studentId && postId && score) {
        data.push({ studentId, postId, score });
      }
    });

    // Extract unique entries
    const uniqueData = [];
    const existingEntries = new Set();

    for (const entry of data) {
      const key = `${entry.studentId}-${entry.postId}`;
      if (!existingEntries.has(key)) {
        existingEntries.add(key);
        uniqueData.push(entry);
      }
    }

    // Check for existing records in the database
    const existingRecords = await LinkedInPost.find({
      $or: uniqueData.map(item => ({
        studentId: item.studentId,
        postId: item.postId,
      }))
    }).lean();

    const existingKeys = new Set(existingRecords.map(item => `${item.studentId}-${item.postId}`));
    const newEntries = uniqueData.filter(item => !existingKeys.has(`${item.studentId}-${item.postId}`));

    // Insert new unique data into database
    if (newEntries.length > 0) {
      await LinkedInPost.insertMany(newEntries);
    }

    res.status(200).json({
      message: 'LinkedIn post data uploaded successfully',
      insertedCount: newEntries.length,
      duplicateCount: uniqueData.length - newEntries.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading LinkedIn post data' });
  }
};

exports.getLinkedInPost = async (req, res) => {
  try {
    const linkedInPosts = await LinkedInPost.find();
    res.status(200).json(linkedInPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
