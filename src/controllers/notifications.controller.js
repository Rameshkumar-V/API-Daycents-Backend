const { Notification,sequelize } = require('../models');
const { sendToUser } = require('../services/Notification.service');

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



exports.userNotificationStore=(user_id,status,title,message,expoPushToken='')=>{
    try{
        if(status && title && message){
            Notification.create({
                user_id:user_id,
                title:title,
                description:message,
                status:status
            })

        }
        setImmediate(()=>{
          if(expoPushToken){
            sendToUser(
              expoPushToken,
              title=title,
              body= message,
              data={"status":status}
            )
          }
        })
    
    }catch(err){
        console.error("UserNotificationStore Error : "+err);
    }
  
}