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
