
const { Task, Project } = require('../models');

const getAllTasks = async (req, res) => {
  try {
    const { status, projectId } = req.query;
    const userId = req.user.id;
    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      // In a real-world app with teams, you'd also check if the user is a member of the project.
      if (project.creatorId !== userId) {
        return res.status(403).json({ error: 'Forbidden: You do not have access to tasks for this project.' });
      }
      where.project_id = projectId;
    } else {
      // If no projectId is given, only show tasks from projects the user created.
      const userProjects = await Project.findAll({ where: { creatorId: userId }, attributes: ['id'] });
      if (userProjects.length > 0) {
        const projectIds = userProjects.map(p => p.id);
        where.project_id = projectIds;
      } else {
        // If user has no projects, return an empty array of tasks.
        res.json([]);
        return;
      }
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
    const userId = req.user.id;
    const task = await Task.findByPk(id, {
      include: {
        model: Project,
        as: 'project',
      },
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.project.creatorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this task.' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, due_date, project_id } = req.body;
    const creatorId = req.user.id; // Get creatorId from authenticated user

    const project = await Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.creatorId !== creatorId) {
      return res.status(403).json({ error: 'Forbidden: You cannot create tasks for this project.' });
    }

    const task = await Task.create({ title, description, status, due_date, project_id });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date, project_id } = req.body;
    const userId = req.user.id;
    const task = await Task.findByPk(id, {
      include: { model: Project, as: 'project' },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.project.creatorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this task.' });
    }

    // If moving the task to a new project, check for access to the new project
    if (project_id && project_id !== task.project_id) {
      const newProject = await Project.findByPk(project_id);
      if (!newProject) {
        return res.status(404).json({ error: 'New project not found' });
      }
      if (newProject.creatorId !== userId) {
        return res.status(403).json({ error: 'Forbidden: You cannot move tasks to this project.' });
      }
    }

    await task.update({ title, description, status, due_date, project_id: project_id || task.project_id });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const task = await Task.findByPk(id, {
      include: { model: Project, as: 'project' },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.project.creatorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this task.' });
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
