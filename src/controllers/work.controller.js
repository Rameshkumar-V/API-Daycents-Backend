const {  UserPost, UserTakenWorks, sequelize } = require('../models');
const {userNotificationStore} = require("./notifications.controller");
/*
 Getting Works For Worker
 */
exports.getWorks = async (req, res, next) => {
  const userId = req.user.user_id;
  const status = req.query.status || 'assigned';

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const allowedStatuses = ['pending', 'assigned', 'finished', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    const err = new Error('Invalid status value');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const { count, rows: works } = await UserTakenWorks.findAndCountAll({
      where: {
        worker_id: userId.toString(),
        status: status
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      message: "Works retrieved successfully",
      data: works,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    return next(error);  // Let middleware handle the error
  }
};

/*
Assign Work to  a Worker by User who Posted the Job Post.
*/

exports.assignToWork = async (req, res, next) => {
  const { post_id, worker_id } = req.body;
  const userId = req.user.user_id; // Authenticated user

  if (!post_id || !worker_id) {
    return res.status(400).json({ error: 'post_id and worker_id are required.' });
  }

  try {
    const userPostedWork = await UserPost.findByPk(post_id);

    if (!userPostedWork) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (userPostedWork.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to assign workers for this post.' });
    }

    if (userPostedWork.status !== 'pending') {
      return res.status(409).json({ error: 'Work already assigned or in progress.' });
    }

    const result = await sequelize.transaction(async (t) => {
      const workerRequest = await UserTakenWorks.findOne({
        where: {
          post_id,
          worker_id,
          status: 'pending'
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!workerRequest) {
        throw new Error('No valid worker request found or already assigned.');
      }

      await workerRequest.update({ status: 'assigned' }, { transaction: t });

      await userPostedWork.update({ status: 'in_progress' }, { transaction: t });

      return workerRequest;
    });
    setImmediate(()=>userNotificationStore(
      expoPushToken=req.user.expoPushToken || '',
      user_id=workerRequest.worker_id,
      status='SUCCESS',
      title="Requested Work Assigned ",
      message='Work Assigned successfully'))

    return res.status(200).json({
      message: 'Work successfully assigned.',
      data: {
        work_id: result.id,
        post_id: result.post_id,
        worker_id: result.worker_id,
        status: result.status
      }
    });

  } catch (error) {
    console.error('Assignment error:', error);
    return res.status(500).json({ error: 'Work assignment failed.', details: error.message });
  }
};



/*
 Requst For Work from Job Posted User by Worker.
 */
exports.requestForWork = async (req, res, next) => {
  const { post_id } = req.body;
  const userId = req.user.user_id;

  if (!post_id || !userId) {
    return res.status(400).json({ error: 'post_id and user_id are required.' });
  }

  try {
    const userRequestedWork = await UserPost.findByPk(post_id);

    if (!userRequestedWork) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (userRequestedWork.user_id === userId) {
      return res.status(403).json({ error: 'You cannot request your own post.' });
    }

    if (userRequestedWork.status !== 'pending') {
      return res.status(409).json({ error: 'Work already taken or in progress.' });
    }

    // Check if user has already requested this post
    const alreadyRequested = await UserTakenWorks.findOne({
      where: {
        post_id: userRequestedWork.id,
        worker_id: userId
      }
    });

    if (alreadyRequested) {
      return res.status(409).json({ error: 'You have already requested to work on this post.' });
    }

    // Create new work request in a transaction
    const result = await sequelize.transaction(async (t) => {
      return await UserTakenWorks.create({
        post_id: userRequestedWork.id,
        worker_id: userId,
        status: 'pending'
      }, { transaction: t });
    });
    setImmediate(()=>userNotificationStore(
      expoPushToken=req.user.expoPushToken || '',
      user_id=userId,
      status='SUCCESS',
      title="Request For Work",
      message='Work requested successfully.'))
    setImmediate(()=>userNotificationStore(
        expoPushToken=req.user.expoPushToken || '',
        user_id=userRequestedWork.user_id,
        status='MESSAGE',
        title="Work Request",
        message="New Worker Requested For Your Post"))

    return res.status(201).json({
      message: 'Work requested successfully.',
      data: {
        work_id: result.id,
        post_id: result.post_id,
        worker_id: result.worker_id,
        status: result.status
      }
    });

  } catch (error) {
    console.error('Request to work error:', error);
    return res.status(500).json({ error: 'Failed to request work.', details: error.message });
  }
};


/*
Decline Work from a User
*/
exports.declineToWork = async (req, res, next) => {
  const { work_id } = req.body;
  const userId = req.user.user_id;

  if (!work_id || !userId) {
    return res.status(400).json({ error: 'Required parameters missing' });
  }

  try {
    const userWork = await UserTakenWorks.findByPk(work_id);
    if (!userWork) {
      return res.status(404).json({ error: 'Work not found' });
    }

    if (userWork.worker_id !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to decline this work' });
    }

    if (userWork.status !== 'pending') {
      setImmediate(()=>userNotificationStore(
        expoPushToken=req.user.expoPushToken || '',
        user_id=userId,
        status='FAILED',
        title="Request For Work Cancel. ",
        message='Only pending work requests can be decline'))
      return res.status(409).json({ error: 'Only pending work requests can be declined' });
    }

    const post = await UserPost.findByPk(userWork.post_id);
    if (!post) {
      return res.status(404).json({ error: 'Associated post not found' });
    }

    // ✅ Use transaction to ensure consistency
    await sequelize.transaction(async (t) => {
      await userWork.update({ status: 'cancelled' }, { transaction: t });
      await post.update({ status: 'pending' }, { transaction: t }); // Post becomes available again
    });

    setImmediate(()=>userNotificationStore(
      expoPushToken=req.user.expoPushToken || '',
      user_id=userId,
      status='SUCCESS',
      title="Request For Work Cancel. ",
      message='Work declined successfully'))

    

    return res.status(200).json({
      message: 'Work declined successfully',
      data: {
        work_id: userWork.id,
        status: 'cancelled',
        post_id: post.id,
        post_status: 'pending'
      }
    });

  } catch (error) {
    console.error('Decline Work Error:', error);
    return res.status(500).json({ error: 'Failed to decline work', details: error.message });
  }
};



