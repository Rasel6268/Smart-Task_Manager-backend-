const express = require('express')
const { CreateTask, getTasks, getTasksByProject, updateTask } = require('../controllers/taskController')

const router = express.Router()

router.post('/',CreateTask)
router.get('/', getTasksByProject);
router.get('/:email',getTasks)
router.put('/:id',updateTask)


module.exports = router