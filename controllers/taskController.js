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
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Tasks.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
exports.autoAssignTask = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Projects.findById(projectId).populate({
      path: "team",
      model: "Team"
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!project.team || !project.team.members || project.team.members.length === 0) {
      return res.status(400).json({ error: "No team members found for this project" });
    }
    const projectTasks = await Tasks.find({ project: projectId });
    const memberWorkload = project.team.members.map(member => {
      const taskCount = projectTasks.filter(task => 
        task.assignedMember.some(assigned => assigned.name === member.name)
      ).length;
      
      return {
        member,
        taskCount,
        availableCapacity: member.capacity - taskCount
      };
    });

    const availableMembers = memberWorkload
      .filter(({ availableCapacity }) => availableCapacity > 0)
      .sort((a, b) => b.availableCapacity - a.availableCapacity);

    if (availableMembers.length === 0) {
      return res.status(400).json({ 
        error: "No team members have available capacity",
        details: memberWorkload.map(m => ({
          member: m.member.name,
          currentTasks: m.taskCount,
          capacity: m.member.capacity
        }))
      });
    }

    const bestMember = availableMembers[0].member;

    res.json({
      success: true,
      assignedMember: bestMember,
      message: `Auto-assigned to ${bestMember.name} with ${availableMembers[0].availableCapacity} tasks available`,
      details: {
        memberName: bestMember.name,
        currentTasks: availableMembers[0].taskCount,
        capacity: bestMember.capacity,
        availableTasks: availableMembers[0].availableCapacity
      }
    });

  } catch (error) {
    console.error('Auto-assign task error:', error);
    res.status(500).json({ error: 'Failed to auto-assign task' });
  }
};
