const express = require('express');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.js');
const auth = require('../middleware/auth.js');
const isProjectCreator = require('../middleware/isProjectCreator.js'); // Import new middleware
const { createProjectValidator, updateProjectValidator } = require('../validators/project.js');
const { validationResult } = require('express-validator');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', auth, getAllProjects);
router.get('/:id', auth, getProjectById);
router.post('/', auth, createProjectValidator, validate, createProject);
router.put('/:id', auth, isProjectCreator, updateProjectValidator, validate, updateProject); // Apply isProjectCreator
router.delete('/:id', auth, isProjectCreator, deleteProject); // Apply isProjectCreator

module.exports = router;
