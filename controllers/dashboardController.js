const Projects = require("../models/Projects");
const Tasks = require("../models/Tasks");
const Teams = require("../models/Teams");


exports.getDashboardByEmail = async (req, res) => {
  try {
    const { email } = req.params;



    // Get totals
    const totalProjects = await Projects.countDocuments({ createdBy: email });
    const totalTasks = await Tasks.countDocuments({ createdBy: email });

    // Get task status counts
    const taskStatusCounts = await Tasks.aggregate([
      { $match: { createdBy: email } },
      { $group: { 
        _id: '$status', 
        count: { $sum: 1 } 
      }}
    ]);

    // Get task priority counts
    const taskPriorityCounts = await Tasks.aggregate([
      { $match: { createdBy: email } },
      { $group: { 
        _id: '$priority', 
        count: { $sum: 1 } 
      }}
    ]);

    // Convert arrays to objects for easier access
    const statusCounts = {};
    taskStatusCounts.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    const priorityCounts = {};
    taskPriorityCounts.forEach(item => {
      priorityCounts[item._id] = item.count;
    });

    // Get team summary with task counts
    const teams = await Teams.find({ createdBy: email });
    const teamSummary = [];

    for (const team of teams) {
      const projects = await Projects.find({ team: team._id });
      const projectIds = projects.map(p => p._id);

      // Get task counts per member for this team's projects
      const taskCounts = await Tasks.aggregate([
        { $match: { project: { $in: projectIds } } },
        { $unwind: '$assignedMember' },
        { $group: { 
          _id: '$assignedMember.name', 
          count: { $sum: 1 } 
        }}
      ]);

      const memberSummary = team.members.map(member => {
        const taskCount = taskCounts.find(tc => tc._id === member.name)?.count || 0;
        return {
          name: member.name,
          role: member.role,
          capacity: member.capacity,
          currentTasks: taskCount,
          isOverloaded: taskCount > member.capacity
        };
      });

      teamSummary.push({
        teamName: team.name,
        members: memberSummary
      });
    }

    // Get recent reassignments
    // const recentReassignments = await ActivityLog.find({ 
    //   userId: user._id,
    //   type: 'TASK_REASSIGNED'
    // })
    // .sort({ timestamp: -1 })
    // .limit(5)
    // .lean();

    // Format recent reassignments
    // const formattedReassignments = recentReassignments.map(log => ({
    //   taskTitle: log.taskTitle,
    //   fromMember: log.fromMember,
    //   toMember: log.toMember,
    //   timestamp: log.timestamp
    // }));

    res.json({
      totalProjects,
      totalTasks,
      completedTasks: statusCounts['Done'] || 0,
      pendingTasks: statusCounts['Pending'] || 0,
      inProgressTasks: statusCounts['In Progress'] || 0,
      highPriorityTasks: priorityCounts['High'] || 0,
      mediumPriorityTasks: priorityCounts['Medium'] || 0,
      lowPriorityTasks: priorityCounts['Low'] || 0,
      teamSummary,
     // recentReassignments: formattedReassignments
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
};