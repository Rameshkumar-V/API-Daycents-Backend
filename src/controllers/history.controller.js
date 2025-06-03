
const { UserPost,  Category, UserTakenWorks, sequelize} = require('../models');





// Getting Post Histroy
exports.getPostHistroyByUserId= async (req, res) => {
  
  try {
    
    const userId = req.params.user_id;
    
    if(!userId){
      return res.status(401).json({"message":"User Id Missing!"});
    }
    if(userId !== req.user.user_id)
      { return res.status(405).json({"message": "You are not valid !"})}

    const posts = await UserPost.findAll({
      where : {"user_id":userId},
      // attributes: ['id','status','createdAt','title'],
      include: [{
        model: Category,
        attributes: ['name'],
        as: 'category', 
      }],
    });
    
   return res.status(200).json({message:"Getted Posts Histroy Successfully",data : await posts.map(e=>e.toJSON())});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching Post Histroy!', error });
  }
};




//  Getting Work Histroy
exports.getWorkHistory = async (req, res, next) => {
  const workerId = req.params.worker_id;

  if (!workerId) {
    const err = new Error('Worker ID is required');
    err.statusCode = 400;
    return next(err);
  }

  try {
    const workHistory = await UserTakenWorks.findAll({
      where: { worker_id: workerId.toString() },
      include: [
        {
          model: UserPost,
          as: 'post', // Ensure this alias matches your association
          include: [
            {
              model: Category,
              as: 'category', // Ensure alias is correctly defined in associations
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: 'Work history fetched successfully',
      data: workHistory,
    });
  } catch (error) {
    return next(error); // Pass to centralized error handler
  }
};
