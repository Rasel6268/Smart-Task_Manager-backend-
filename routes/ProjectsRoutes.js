const express = require('express')
const { createProject } = require('../controllers/ProjectsController')

const router = express.Router()

router.post('/',createProject)
// router.get('/',getTeams)

module.exports = router