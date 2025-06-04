const { User, Roles } = require('../models');
const { buildFilters, buildPaginationAndSorting } = require('../utils/queryBuilder');
const { userNotificationStore } = require('./notifications.controller');


/* Getting All Users. */
exports.getAllUsers = async (req, res) => {
  try {
    const allowedFields = [
      'email_id', 'id', 'phone_no', 'role_id',
       'name', 'is_active'
    ];

    const allowedRelations = {
      role: ['name'],
    };

    const { baseFilters, includeFilters } = buildFilters(req.query, allowedFields, allowedRelations);
    const { pagination, sort, meta } = buildPaginationAndSorting(req.query);
    
    // RELATIONS
    const includes = [];

    if (includeFilters.user) {
      includes.push({
        model: Roles,
        as: 'roles',
        where: includeFilters.role,
        required: true
      });
    }

   
    const { count, rows: users } = await User.findAndCountAll({
      where: baseFilters,
      include: includes,
      limit: pagination.limit,
      offset: pagination.offset,
      order: sort,
      attributes: {
         exclude: ['password']
       }
     
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / pagination.limit),
      currentPage: meta.page,
      data: users
    });
  } catch (err) {
    console.error("Fetch Users Error:", err.message);
    res.status(500).json({
      message: "Failed to fetch users",
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
  const userRoleName = req.body.role || "USER";
  let allowedRoles = ['USER','WORKER']

  if (!allowedRoles.includes(userRoleName)) {
    return res.status(401).json({ message: 'Unauthorized role' });
  }

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

