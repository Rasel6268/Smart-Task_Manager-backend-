const express = require('express');
const { CreateUser, getUser } = require('../controllers/userController');
const router = express.Router();


router.post('/', CreateUser);
router.get('/',getUser)

module.exports = router;