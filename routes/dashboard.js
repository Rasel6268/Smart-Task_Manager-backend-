const express = require('express');
const { getDashboardByEmail } = require('../controllers/dashboardController');


const router = express.Router();


router.get('/:email', getDashboardByEmail);

module.exports = router;