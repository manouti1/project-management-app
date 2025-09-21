
const { body } = require('express-validator');

const registerValidator = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidator = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidator,
  loginValidator,
};
