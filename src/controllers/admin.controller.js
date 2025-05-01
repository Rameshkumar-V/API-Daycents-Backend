const { User, UserPost } = require('../models');
const { Op } = require('sequelize');
// GET TOTAL WORKERS
exports.getTotalWorkers = async (req, res) => {
  try {
    const count = await User.count();
    res.status(200).json({ total_workers: count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get worker count', details: err.message });
  }
};


// GET ACTIVE JOBS BY SPECIFIC DATE
exports.getActiveJobsByDate = async (req, res) => {
    const { date } = req.query;
  
    try {
      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required. Example: /jobs/active?date=2025-04-11' });
      }
  
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }
  
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
  
      const count = await UserPost.count({
        where: {
          status: 'pending',
          is_show: true,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
  
      res.status(200).json({ date, active_jobs: count });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get active jobs', details: err.message });
    }
  };
  

// GET COMPLETED JOBS TOTALLY ON OUR APP
exports.getCompletedJobs = async (req, res) => {
    try {
      const count = await UserPost.count({
        where: {
          status: 'completed'
        }
      });
  
      res.status(200).json({ completed_jobs: count });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get completed jobs', details: err.message });
    }
  };
  


//      APPS TOTAL EARNINGS
  exports.getEarningsSummary = async (req, res) => {
    try {
      const summary = {
        daily_earnings: 5200,
        worker_payments: 4000,
        app_commission: 800
      };
  
      res.status(200).json(summary);
    } catch (err) {
      res.status(500).json({ error: 'Earnings summary failed', details: err.message });
    }
  };


//   live job feed
  exports.getLiveJobFeed = async (req, res) => {
    try {
      const jobs = await UserPost.findAll({
        where: { status: { [Op.in]: ['in_progress', 'scheduled', 'pending'] } },
        include: [{ model: Category, as: 'Category', attributes: ['name'] }]
      });
  
      res.status(200).json({ live_jobs: jobs });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get live feed', details: err.message });
    }
  };
  
  