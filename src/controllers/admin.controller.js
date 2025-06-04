const { User, UserPost } = require('../models');
const { Op } = require('sequelize');
const { Admin } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAllAdmins = async (req, res) => {
  const admins = await Admin.findAll();
  res.json(admins);
};



exports.updateAdmin = async (req, res) => {
  const { username, email } = req.body;
  const {admin_id} = req.params;
  await Admin.update({ username, email }, { where: { id: admin_id } });
  res.json({ message: 'Admin updated' });
};

exports.deleteAdmin = async (req, res) => {
  const {admin_id} = req.params;
  await Admin.destroy({ where: { id: admin_id } });
  res.json({ message: 'Admin deleted' });
};


// GET /api/users/count?role=worker
exports.getUserCount = async (req, res, next) => {
  try {
    const role = req.query.role;
    const allowedRoles = ["guest", "worker"];

    if (role && !allowedRoles.includes(role)) {
      const err = new Error('Invalid role value');
      err.statusCode = 400;
      return next(err);
    }

    const whereClause = role ? { role } : {};
    const count = await User.count({ where: whereClause });

    return res.status(200).json({ role : role ? role:"ALL", count : count });
  } catch (err) {
    err.statusCode = 500;
    err.message = 'Failed to get worker count';
    return next(err);
  }
};

// GET /api/jobs?status=pending&is_show=true&date=2025-05-06&category_id=1&pincode=600001&title=plumber&limit=10&page=2
exports.getJobs = async (req, res, next) => {
  try {
    const {
      status,
      is_show,
      date,
      category_id,
      pincode,
      title,
      limit = 10,
      page = 1,
    } = req.query;

    const whereClause = {};

    if (status) {
      const allowedStatus = ['pending', 'in_progress', 'completed', 'cancelled'];
      if (!allowedStatus.includes(status)) {
        const err = new Error('Invalid status');
        err.statusCode = 400;
        return next(err);
      }
      whereClause.status = status;
    }

    if (is_show !== undefined) {
      whereClause.is_show = is_show === 'true';
    }

    if (category_id) {
      whereClause.category_id = category_id;
    }

    if (pincode) {
      whereClause.pincode = pincode;
    }

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` };
    }

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        const err = new Error('Invalid date format. Use YYYY-MM-DD');
        err.statusCode = 400;
        return next(err);
      }

      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
      whereClause.createdAt = { [Op.between]: [startOfDay, endOfDay] };
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit), 100); // max limit cap to prevent abuse
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: jobs } = await UserPost.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total: count,
      total_pages: Math.ceil(count / limitNum),
      jobs,
    });
  } catch (err) {
    err.statusCode = 500;
    err.message = 'Failed to fetch jobs';
    return next(err);
  }
};


exports.getJobCount = async (req, res, next) => {
  try {
    const { status, date } = req.query;

    const allowedStatus = ['pending', 'in_progress', 'completed', 'cancelled'];
    const whereClause = {};

    if (status) {
      if (!allowedStatus.includes(status)) {
        const err = new Error('Invalid status value');
        err.statusCode = 400;
        return next(err);
      }
      whereClause.status = status;
    }

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        const err = new Error('Invalid date format. Use YYYY-MM-DD');
        err.statusCode = 400;
        return next(err);
      }

      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
      whereClause.createdAt = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    const count = await UserPost.count({ where: whereClause });

    res.status(200).json({
      status: status || 'all',
      date: date || 'all',
      job_count: count
    });

  } catch (err) {
    err.statusCode = 500;
    err.message = 'Failed to get job count';
    next(err);
  }
};


exports.getPostsCount = async (req, res, next) => {
  try {
    const { status, date } = req.query;

    const whereClause = {};

    if (status) {
      const allowedStatus = ['pending', 'in_progress', 'completed', 'cancelled'];
      if (!allowedStatus.includes(status)) {
        const err = new Error('Invalid status. Allowed: pending, in_progress, completed, cancelled');
        err.statusCode = 400;
        return next(err);
      }
      whereClause.status = status;
    }

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        const err = new Error('Invalid date format. Use YYYY-MM-DD');
        err.statusCode = 400;
        return next(err);
      }

      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

      whereClause.createdAt = { [Op.between]: [startOfDay, endOfDay] };
    }

    const count = await UserPost.count({ where: whereClause });

    return res.status(200).json({
      count,
      filters: { status: status || null, date: date || null },
    });
  } catch (err) {
    err.statusCode = 500;
    err.message = 'Failed to count posts';
    return next(err);
  }
};



exports.getEarningsSummary = async (req, res, next) => {
  try {
    const { date } = req.query;

    let targetDate = new Date();
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        const err = new Error('Invalid date format. Use YYYY-MM-DD');
        err.statusCode = 400;
        return next(err);
      }
      targetDate = parsedDate;
    }

    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const successfulPayments = await Payment.findAll({
      where: {
        status: 'SUCCESS',
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    const workerPayments = successfulPayments.reduce((total, p) => total + p.amount, 0);

    res.status(200).json({
      date: date || new Date().toISOString().split('T')[0],
      worker_payments: parseFloat(workerPayments.toFixed(2))
    });

  } catch (err) {
    err.statusCode = 500;
    err.message = 'Earnings summary failed';
    next(err);
  }
};



  