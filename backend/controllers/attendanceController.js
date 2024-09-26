const Attendance = require('../models/attendanceModel');
const ExcelJS = require('exceljs');

exports.uploadAttendance = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    const data = [];
    const uniqueKeys = new Set();

    // Parse the Excel file
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const [studentId, date, status] = row.values.slice(1, 4); // Adjust indices as necessary

      // Ensure data matches schema
      if (studentId && date && status) {
        const entryKey = `${studentId}-${new Date(date).toISOString()}`;
        if (!uniqueKeys.has(entryKey)) {
          uniqueKeys.add(entryKey);
          data.push({ studentId, date: new Date(date), status });
        }
      }
    });

    // Check for existing records in the database
    const existingRecords = await Attendance.find({
      $or: data.map(item => ({
        studentId: item.studentId,
        date: item.date,
      }))
    }).lean();

    const existingKeys = new Set(existingRecords.map(item => `${item.studentId}-${item.date.toISOString()}`));
    const newEntries = data.filter(item => !existingKeys.has(`${item.studentId}-${item.date.toISOString()}`));

    // Insert new unique data into database
    if (newEntries.length > 0) {
      await Attendance.insertMany(newEntries, { ordered: false }); // Insert without stopping at errors
    }

    res.status(200).json({
      message: 'Attendance data uploaded successfully',
      insertedCount: newEntries.length,
      duplicateCount: data.length - newEntries.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading attendance data' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
