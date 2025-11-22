const Projects = require("../models/Projects");
const Tasks = require("../models/Tasks");

exports.CreateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedMembers,
      priority,
      status,
      createdBy,
    } = req.body;

    
  

    const task = new Tasks({
      title,
      description,
      project: projectId,
      assignedMember: assignedMembers,
      priority,
      status,
      createdBy: createdBy,
    });
    await task.save();

    res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      task
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};
exports.getTasks = async (req, res) => {
  try {
    const {email} = req.params

    const tasks = await Tasks.find({createdBy: email}).populate({
    path: "project",
    model: "Projects",
    populate: {
      path: "team",
      model: "Team"
    }
  })
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.query;
    

    const tasks = await Tasks.find({ project: projectId }).populate({
      path: "project",
      model: "Projects",
      populate: {
        path: "team",
        model: "Team"
      }
    });

    res.json({
      success: true,
      tasks: tasks || []
    });
  } catch (error) {
    console.error('Get tasks by project error:', error);
    res.status(500).json({ error: 'Failed to fetch project tasks' });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Tasks.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate({
      path: "project",
      model: "Projects",
      populate: {
        path: "team",
        model: "Team"
      }
    });
    res.json({
      success: true,
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};
