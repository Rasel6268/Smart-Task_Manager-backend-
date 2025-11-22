const express = require('express')
const { createProject, getProject, } = require('../controllers/ProjectsController')

const router = express.Router()

router.post('/',createProject)
router.get('/:email',getProject)

module.exports = router