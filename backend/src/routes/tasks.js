const express = require('express');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.js');
const auth = require('../middleware/auth.js');
const isTaskCreator = require('../middleware/isTaskCreator.js'); // Import new middleware
const { createTaskValidator, updateTaskValidator } = require('../validators/task.js');
const { validationResult } = require('express-validator');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', auth, getAllTasks);
router.get('/:id', auth, getTaskById);
router.post('/', auth, createTaskValidator, validate, createTask);
router.put('/:id', auth, isTaskCreator, updateTaskValidator, validate, updateTask); // Apply isTaskCreator
router.delete('/:id', auth, isTaskCreator, deleteTask); // Apply isTaskCreator

module.exports = router;
