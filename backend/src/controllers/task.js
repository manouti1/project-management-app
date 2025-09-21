
const { Task } = require('../models');

const getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) {
      where.status = status;
    }
    const tasks = await Task.findAll({ where });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, status, due_date, project_id } = req.body;
    const userId = req.user.id; // Get userId from authenticated user
    const task = await Task.create({ title, status, due_date, project_id, userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, due_date, project_id } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.update({ title, status, due_date, project_id });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
