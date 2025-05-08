
#   DAYCENTS
This is a project setup guide. 
## 🎯 Purpose of the App
A smart platform where people can post small home-related problems or tasks and instantly find nearby workers to solve them.
It helps local workers discover jobs close to their location, boosting opportunities without complex job-hunting.
This app bridges the gap between job posters and job seekers with real-time updates, clean listings, and secure communication.






## DEPENDENCIES
### SOFTWARES
##### FOR WINDOWS:
1.  [nodejs 17X ](https://www.python.org/downloads/)

2.  [Git](https://git-scm.com/)
3.  [PostgreSQL 16](https://www.postgresql.org/download/)
            (or)
    [Sqlite]
4. Redis
5. Vs Code Editor



### PACKAGES:
```
    "axios": "^1.9.0",

    "bcryptjs": "^3.0.2",

    "body-parser": "^2.2.0",

    "dotenv": "^16.5.0",

    "express": "^5.1.0",

    "express-validator": "^7.2.1",

    "firebase-admin": "^13.2.0",

    "haversine": "^1.1.1",

    "jsonwebtoken": "^9.0.2",

    "multer": "^1.4.5-lts.2",

    "nodemailer": "^7.0.0",

    "pg": "^8.15.6",

    "pg-hstore": "^2.3.4",

    "razorpay": "^2.9.6",

    "redis": "^5.0.1",

    "sequelize": "^6.37.7",

    "sqlite3": "^5.1.7",

    "swagger-jsdoc": "^6.2.8",

    "swagger-ui-express": "^5.0.1",

    "uuid": "^11.1.0"
```
---




## Environment Setup

1. Create the `.env` file from the sample .env provided below.
2. Replace placeholders with your Credentials.

### SAMPLE `.env` file:

```
NODE_ENV=development
DATABASE_URL=postgres://user:password@host:port/database
JWT_SECRET=ldfjfkjfsfjlffjf;;;
RAZORPAY_KEY_ID=rzp_live_KdgCnlP1DrVQAC
RAZORPAY_KEY_SECRET=razorpayadsce
FAST2SMS_API_KEY=dklkfksfjlfkflfjlfjlddddddsxccsddffsd
EMAIL_USER=user@gmail.com
EMAIL_PASS=dkdjjkfjskfjslkf
PORT=0000
FIREBASE_SERVICE_FILE='{}'
```












### DATABASE DIAGRAM : https://dbdiagram.io/d/6660372a8f6e135d4a586cbd
## Run Locally

Clone the project

```bash
  git clone https://github.com/Rameshkumar-V/Daycents-Backend.git
```

Go to the project directory

```bash
  cd Daycents-Backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node src\index.js
```


## 🚀 Features

- ⚙️ **RESTful API Architecture – Clean and Scalable**  
  Modular and maintainable design ready for expansion.

- 🔐 **Lightning-Fast User Signup & Secure JWT Auth**  
  Seamless user authentication with industry-standard security.

- 📍 **Location-Based Post Listings**  
  Display posts relevant to the user's geolocation.

- 🛡️ **Role-Based Access Control (Guest, Admin, etc.)**  
  Fine-grained permission management.

- 💳 **Payment Integration (RazorPay)**  
  Secure and fast payment gateway setup.

- 📲 **Push Notification Token Handling (Future Ready)**  
  Firebase-ready token storage for instant alerts.

- 📝 **Smart Post Filtering with Clean Content Validation**  
  Prevents users from posting contact info in descriptions.

- 🗂️ **Dynamic Category Management with Media Support**  
  Easily manage categories with icons and visibility.

- 🗃️ **Relational Database with Sequelize ORM**  
  Structured models and strong relationship mapping.

- 🔄 **Real-Time User Post Syncing & Updates**  
  Instant reflection of new and updated data.

- 🎯 **Pin-Point Search with Pincode & Geo Coordinates**  
  Accurate location-based search filters.

- 🧠 **Validation Rules to Block Contact Sharing in Descriptions**  
  Enforces safe content standards automatically.

- ☁️ **Cloud-Optimized File & Image Handling (Firebase)**  
  Efficient media upload and access via Firebase Storage.

- 🧪 **Tested with Tools like Insomnia**  
  Endpoints verified with modern API testing tools.

- 🧱 **Redis & SQL Layer for Efficient Caching and Storage**  
  Combines speed and reliability for data handling.

- 🌱 **Scalable Project Structure for Future Features**  
  Built to grow with clean folder and module separation.

## Documentation

[JWT (JSON WEB TOKEN)](https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html)

[SEQUELIZE](https://sequelize.org/docs/v6/getting-started/)

[RAZORPAY](https://razorpay.com/docs/payments/server-integration/nodejs)

[API DESIGN](https://swagger.io/resources/articles/best-practices-in-api-design/)

