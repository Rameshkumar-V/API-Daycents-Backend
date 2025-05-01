const { User,Work,UserPost } = require('../models');

/*
Creating a User.
*/
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({status:true, message: "Successfully User Created"}, user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/*
Getting All Users.
*/
exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

/*

/*
Getting User.
*/
exports.getUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.find({
    where:{user_id: userId}
  });
  
  if(!user){
    res.status(404).json({message : "Opps, User Not Found!"})

  }
  res.status(200).json({message:"User Found Successfully",data: [user]});
};

/*

DELETING : User with user_id
*/
exports.deleteUser = async (req, res) => {

  const userId =  req.params.id;
  
  console.log("user id : "+userId);
  
  const user = await User.findOne(
    {
      where:{id : userId.toString()}
    }
  );
  console.log("user in db : "+(user));


  if(!user){
    res.status(404).json({message : "Opps, User Not Found!"})

  }
  // await user.destroy()
  res.status(200).json({message : "User Deleted Successfully", data : [user]});
  
};



exports.updateUser= async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  try {
    const user = await User.findByPk(userId);
    const isValid = user.id==userId ? true:false;

    if(!isValid){
      return res.status(404).json({ message: 'You are not able to access this Record' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(updatedUserData);

    const updatedUser = await User.findByPk(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

