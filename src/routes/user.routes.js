const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const handleValidation = require('../middleware/validateRequest');
const {
    updateUserValidator,
    idParamValidator
  } = require('../validators/userValidator');

const { isAdmin } = require('../middleware/auth.middleware');

// USER ROUTERS
router.put('/',
   updateUserValidator,                         // UPDATING
   handleValidation, 
   userController.updateUser);

router.delete('/:user_id',
  idParamValidator,                             // DELETING
  handleValidation,
  userController.deleteUser);

router.get('/:user_id',
  idParamValidator,
  handleValidation,                             // GET USER
  userController.getUser);

router.get('/',
  isAdmin,
  handleValidation,                    
  userController.getAllUsers);                 //  GET USERS ( ONLY ADMIN)

module.exports = router;
