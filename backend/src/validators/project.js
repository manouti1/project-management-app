
const { body } = require('express-validator');

const createProjectValidator = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').notEmpty().withMessage('Project description is required'),
];

const updateProjectValidator = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').notEmpty().withMessage('Project description is required'),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
};
