// // const bcrypt = require('bcryptjs');
// // const t="$2b$10$Reho40VRQR2AcI7ga1BW5uJCH3Yg.wtdgvfEUZ6sddYY0z6vGde06";

const { Notification, Roles, PostIsShow} = require('./src/models/index');

// // const data = Notification.create({
// //     "user_id":"ecd47ba1-63d2-41e5-a16f-6544d07dab32",
// //     "title":"Post created",
// //     "description":" A Description about post",
// //     "status": "SUCCESS"
// // })

// for (i of ["USER","WORKER","ADMIN"]){
//     console.log('d= :>> ', i); 
//     const data = Roles.create({
//             "name":i
//         })
//         console.log(data);

// }
// // const data = Roles.create({
// //     "name":"ADMIN"
// // })

// // console.log(data)


async function good(){
  await PostIsShow.create({
    is_show : false
  })

}
async function name() {
  const d = await PostIsShow.findOne();
  console.log("data = "+JSON.stringify(d))
  
}
// good()
name();

