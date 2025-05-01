// work.controller.js
const { Work, User, UserPost, UserTakenWorks,Category } = require('../models');
// const userPostsModel = require('../models/userPosts.model');


exports.getAssignedWorks = async (req, res) => {
  const userId = req.user.user_id;
  const works = await UserTakenWorks.findAll({
    where:{worker_id: userId.toString(), status : "assigned"}
  });
  res.status(200).json({message:"Work Getted Successfully",data: [works]});
};


/*
Assign Work to  a User.
*/
exports.assignToWork = async (req, res) => {
  try {
    const {  post_id } = req.body;
    const userId = req.user.user_id;
    console.log(post_id);
    console.log(userId);

    if(!( post_id && userId)){
      return res.status(404).json({ message: 'Required Parameters Missing !' });
    }

    const userRequestedWork = await UserPost.findByPk(post_id);
    if(!userRequestedWork){
      return res.status(404).json({ message: 'User Requested Works, Post Not Found' });
    }

    const userWorkTake = await UserTakenWorks.create({
      post_id: userRequestedWork.id,
      worker_id: userId.toString()
    });
  
    userWorkTake.status = "assigned";
    userRequestedWork.status = "in_progress";
    await userRequestedWork.reload();
    await userWorkTake.reload()
    
    return res.status(201).json({ message: 'User Requested Work Allocated Successfully' });


  }catch(e){
    console.log(e)
    return res.status(500).json({message: "Error Occured!"})
  }
}


/*
Decline Work from a User
*/
exports.declineWork= async (req, res) => {
  try {
    const {  work_id } = req.body;
    const userId = req.user.user_id;

    if(!(userId && userId)){
      res.status(404).json({ message: 'Required Parameters Missing !' });
    }

    const userWorkTaked = await UserTakenWorks.findByPk(work_id);
    const isValid = await userWorkTaked.worker_id == userId ? true:false;
    if(!isValid){
      return res.status(404).json({ message: 'Your not Valid User For This Work!' });
    }
  
    if(!userWorkTaked){
      return res.status(404).json({ message: 'User Requested Works Not Found' });
    }

    const post = await UserPost.findByPk(userWorkTaked.post_id);
    if(!post){
      return res.status(404).json({ message: 'User Requested Works, Post Not Found' });
    }
  
    post.status = "pending";
    userWorkTaked.status = "cancelled";
    await post.reload();
    await userWorkTaked.reload();
    
    return res.status(201).json({ message: 'User Resigned Work  Successfully' });

  }catch(e){
    console.log(e)
    return res.status(500).json({message: "Error Occured!"})
  }
}


exports.getWorkHistroy = async (req, res) => {
  try {
    const workerId = req.params.worker_id;
    const workHistory = await UserTakenWorks.findAll({
      where: { worker_id: workerId },
      include: [
        {
          model: UserPost, // Use models.UserPost
          as: 'UserPosts', // Use the alias defined in UserTakenWorks.hasMany
          attributes: ['category_id'],
          include: [{
            model: Category,
            attributes: ['name'], // Select 'name' from the Category model
            as: 'Category', // Use the alias for Category (if any)
          }],
        },
        
      ],
    });
    res.status(200).json(workHistory);
  } catch (error) {
    console.error('Error fetching work history:', error);
    res.status(500).json({ error: 'Failed to fetch work history' });
  }
};

