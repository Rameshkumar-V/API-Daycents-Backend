// // const bcrypt = require('bcryptjs');
// // const t="$2b$10$Reho40VRQR2AcI7ga1BW5uJCH3Yg.wtdgvfEUZ6sddYY0z6vGde06";

// const {Notification,Roles} = require('./src/models/index');

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



var axios = require("axios").default;

var options = {
  method: 'POST',
  url: 'https://api-daycents-backend.vercel.app/api/posts/7bde8251-bb54-4711-b367-d63eb1a0651d/images',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
    'User-Agent': 'insomnia/11.0.2',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTcwYTMxNWItM2VkNS00YjIxLTgwNmEtNDY3Y2ZjODgzOGI1IiwiaXNWZXJpZmllZCI6dHJ1ZSwicm9sZSI6eyJpZCI6IjdmZGY2YWNhLTkyZmYtNGQ5Ni1iNWY1LTYzMjZiMzNhNjA5OSIsIm5hbWUiOiJVU0VSIn0sImlhdCI6MTc0OTU2NTEwMSwiZXhwIjoxNzQ5NTY4NzAxfQ.vTDuci8VKL_zhsiLPeld6C3qLPD_W4MezPRfyZ770EQ'
  },
  data: '-----011000010111000001101001\r\nContent-Disposition: form-data; name="files"; filename="export.png"\r\nContent-Type: image/png\r\n\r\n\r\n-----011000010111000001101001--\r\n'
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});