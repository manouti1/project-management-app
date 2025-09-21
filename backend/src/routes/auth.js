const express = require('express');
const { register, login } = require('../controllers/user.js');
const { registerValidator, loginValidator } = require('../validators/user.js');
const { validationResult } = require('express-validator');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

module.exports = router;
