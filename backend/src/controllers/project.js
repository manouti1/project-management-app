
const { Project } = require('../models');

const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: projects } = await Project.findAndCountAll({
      limit,
      offset,
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
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; // Get userId from authenticated user
    const project = await Project.create({ name, description, userId });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.update({ name, description });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
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
