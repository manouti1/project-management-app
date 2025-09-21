const { Task } = require('../models');

const isTaskCreator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You are not the creator of this task' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = isTaskCreator;