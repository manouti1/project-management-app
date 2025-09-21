const { Project } = require('../models');

const isProjectCreator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('isProjectCreator Middleware: Project User ID:', project.userId);
    console.log('isProjectCreator Middleware: Request User ID (from token):', req.user.id);

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You are not the creator of this project' });
    }

    next();
  } catch (error) {
    console.error('isProjectCreator Middleware Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = isProjectCreator;