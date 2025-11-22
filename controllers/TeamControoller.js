const Teams = require("../models/Teams");

exports.createTeam = async (req, res) => {
  try {
    const { name, description, createdBy, members } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Name and createdBy (email) are required",
      });
    }
    const newTeam = new Teams({
      name,
      description,
      members,
      createdBy,
    });
    await newTeam.save();
    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      team: newTeam,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getTeams = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const teams = await Teams.find({ createdBy: email });

    res.status(200).json({ success: true, count: teams.length, teams });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
