const { Project } = require('../models');

const isProjectCreator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You are not the creator of this project' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = isProjectCreator;