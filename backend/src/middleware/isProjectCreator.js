const { Project } = require('../models');

const isProjectCreator = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id; // Assuming auth middleware sets req.user

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.creatorId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the creator of this project.' });
    }

    req.project = project; // Pass the found project to the next middleware/handler

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error while checking project ownership.' });
  }
};

module.exports = isProjectCreator;