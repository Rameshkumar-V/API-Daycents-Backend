const { Report } = require('../models');

exports.createReport = async (req, res, next) => {
  try {
    const { type, subject, message } = req.body;
    const user_id = req.user.user_id; // from authenticated token

    if (!type || !subject || !message) {
      return res.status(400).json({ error: 'type, subject, and message are required' });
    }

    const report = await Report.create({ user_id, type, subject, message });

    return res.status(201).json({
      message: 'Report submitted successfully',
      data: report
    });
  } catch (err) {
    next(err);
  }
};


// report.controller.js
const { User } = require('../models');

exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'name', 'email_id']
      }]
    });

    return res.status(200).json({
      message: 'All reports fetched successfully',
      data: reports
    });
  } catch (err) {
    next(err);
  }
};
