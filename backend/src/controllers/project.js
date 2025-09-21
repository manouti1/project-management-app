
const { Project } = require('../models');

const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const creatorId = req.user.id;

    const { count, rows: projects } = await Project.findAndCountAll({
      limit,
      offset,
      where: { creatorId },
    });

    res.json({
      projects,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalProjects: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this project.' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creatorId = req.user.id; // Get userId from authenticated user
    const project = await Project.create({ name, description, creatorId });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = req.project; // Get project from isProjectCreator middleware

    await project.update({ name, description });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = req.project; // Get project from isProjectCreator middleware
    await project.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
