const { User } = require('../models');


/* Getting All Users. */
exports.getAllUsers = async (req, res) => {
  try {
    // Extract query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: {
         exclude: ['password']
       }
     
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      status: true,
      message: "Successfully fetched users",
      data: users,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page
      }
    });
  } catch (err) {
    console.error("Fetch Users Error:", err.message);
    res.status(500).json({
      status: false,
      message: "Failed to fetch users",
      error: err.message
    });
  }
};


/* Getting User. */
exports.getUser = async (req, res) => {

  try{
    const userId = req.params.user_id;
    const user = await User.findByPk(userId.toString() ,
  {
   attributes: {
    exclude: ['password']
  }
}
);
  if(!user){ res.status(404).json({message : "Opps, User Not Found!"}) }

  res.status(200).json({status: true, message:"User Found Successfully",data: [user]});

  }catch(err){
    console.log(err);
    next();
  // res.status(500).json({status: false, message:"Invalid"});
  }
  
};

/*

DELETING : User with user_id
*/
exports.deleteUser = async (req, res) => {
  const userId = req.params.user_id || req.user.user_id;  // Fallback to authenticated user's ID if none is provided

  // Ensure that the current user is allowed to delete this user
  if (userId !== req.user.user_id || req.user.role=="admin") {
    return res.status(405).json({ "message": "You are not authorized to delete this user!" });
  }

  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    
    await user.destroy();  // Deleting the user
    
    res.status(200).json({ status: true, message: "User Deleted Successfully", data: [user] });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.user.user_id;
  const updatedUserData = req.body;

  try {
    const user = await User.findByPk(userId,{
      attributes : {exclude:["password"]}
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Perform the update
    await user.update(updatedUserData);
    res.status(200).json({
      status: true,
      data: [user],
      message: 'User Updated Successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user' });
  }
};

