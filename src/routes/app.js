const express = require('express');
const app = express();
const adminRoutes = require('./admin.routes');
const errorHandler = require('../middleware/error.middleware');
const {Authentication} = require('../middleware/auth.middleware');

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(setStaticUserId);
// USERS ONLY

app.use('/api/users/auth',
        require('./user.auth.routes')
);
app.use('/api/users',
    Authentication, 
    require('./user.routes')
);
app.use('/api/posts',
    Authentication, 
    require('./Post.routes')
);
app.use('/api/histroy',
    Authentication, 
    require('./history.routes')
);
app.use('/api/works',
    Authentication,
    require('./work.routes')
);
app.use('/api/payment',
    Authentication, 
    require('./Payment')
);
app.use('/api/categories',
    Authentication, 
    require('./category.routes')
);
app.use('/api/reviews',
    Authentication, 
    require('./review.route.')
); 
app.use('/api/reports',
    Authentication, 
    require('./report.route')
); 
app.use('/api/notifications',
    Authentication, 
    require('./notification.routes')
);


// ADMIN ONLY
app.use('/api/admins/auth', require('./admin.auth.routes'));
app.use('/api/admins',Authentication, adminRoutes);

// ERROR MIDDLEWARE
app.use(errorHandler);

module.exports = app;
