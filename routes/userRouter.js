const express = require('express');
const { CreateUser } = require('../controllers/userController');
const router = express.Router();


router.post('/', CreateUser);

module.exports = router;