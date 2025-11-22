const express = require('express')
const { CreateTask, getTasks, getTasksByProject } = require('../controllers/taskController')

const router = express.Router()

router.post('/',CreateTask)
router.get('/', getTasksByProject);
router.get('/:email',getTasks)


module.exports = router