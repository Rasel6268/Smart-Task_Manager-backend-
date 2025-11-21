const express = require('express')
const { createTeam } = require('../controllers/TeamControoller')
const router = express.Router()

router.post('',createTeam)

module.exports = router