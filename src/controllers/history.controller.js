// history.controller.js
const { History, User, UserPost } = require('../models');

async function SaveHistroy(post){
  try {
    await History.create({
      user_id: post.user_id,
      post_id: post.id,
      action: "created",
      description: "Post logged in background",
    });
  } catch (err) {
    console.error("History logging failed:", err);
  }

}
// Create a new history record
exports.createHistory = async (req, res) => {
  try {
    const { user_id, post_id, action, description } = req.body;

    const newHistory = await History.create({
      user_id,
      post_id,
      action,
      description,
    });

    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating history record', error });
  }
};

// Get history for a specific post
exports.getPostHistory = async (req, res) => {
  try {
    const { post_id } = req.params;
    const history = await History.findAll({
      where: { post_id },
      include: [{ model: User, as: 'User' }, { model: UserPost, as: 'UserPost' }],
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history for post', error });
  }
};

// Get history of a user
exports.getUserHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const history = await History.findAll({
      where: { user_id },
      limit: 10,
  order: [['createdAt', 'DESC']], 
      
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history for user', error });
  }
};



/*
GETTING : ALL - Work History
*/
exports.getUserWorkHistory = async (req,res) => {
  const users_work_histroy = await User.findAll({
    include : [{
      model : Work,
      attributes : [],
      where: {
        worker_id:user_id
      },
      include:{
        model:UserPost,
        attributes : ['title','status'],

      }
    }]
  }

  )
}
