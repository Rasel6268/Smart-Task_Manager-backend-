const Projects = require("../models/Projects");

exports.createProject = async (req, res) => {
  try {
    const { name, description, teamId, createdBy } = req.body;

    const project = new Projects({
      name,
      description,
      team: teamId,
      createdBy: createdBy,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};
exports.getProject = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const projects = await Projects.find({ createdBy: email }).populate('team');
    

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
