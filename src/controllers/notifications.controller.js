const { Notification,sequelize } = require('../models');

exports.getNotifications= async(req,res)=>{ 
    try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      where: {user_id: req.user.user_id}
      
    });

    return res.status(200).json({
      message: 'All notifications fetched successfully',
      data: notifications
    });
  } catch (err) {
    next(err);
  }

}



exports.userNotificationStore=(user_id,status,title,message)=>{
    try{
        if(status && title && message){
            Notification.create({
                user_id:user_id,
                title:title,
                description:message,
                status:status
            })

        }
    
    }catch(err){
        console.error("UserNotificationStore Error : "+err);
    }
  
}