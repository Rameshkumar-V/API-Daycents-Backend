// work.routes.js
const express = require('express');
const router = express.Router();
const workController = require('../controllers/work.controller');

router.post('/request',
    workController.requestForWork
);
router.post('/assign', 
    workController.assignToWork
); 
router.post('/decline', 
    workController.declineToWork
);
router.get('/',
    workController.getWorks
);

module.exports = router;
