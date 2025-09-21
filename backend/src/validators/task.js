
const { body } = require('express-validator');

const createTaskValidator = [
  body('title').notEmpty().withMessage('Task title is required'),
  body('status').isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('project_id').isInt().withMessage('Project ID must be an integer'),
];

const updateTaskValidator = [
  body('title').notEmpty().withMessage('Task title is required'),
  body('status').isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('project_id').isInt().withMessage('Project ID must be an integer'),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
};
