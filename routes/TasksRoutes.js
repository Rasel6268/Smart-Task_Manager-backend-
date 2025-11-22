const express = require('express')
const { CreateTask, getTasks, getTasksByProject, updateTask, deleteTask, autoAssignTask } = require('../controllers/taskController')

const router = express.Router()

router.post('/',CreateTask)
router.get('/', getTasksByProject);
router.post('/auto-assign', autoAssignTask);
router.get('/:email',getTasks)
router.put('/:id',updateTask)
router.delete('/:id', deleteTask);




module.exports = router