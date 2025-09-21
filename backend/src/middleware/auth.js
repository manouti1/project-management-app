const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('Auth Middleware: Received Token:', token);
    console.log('Auth Middleware: JWT_SECRET:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth Middleware: Authentication failed:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = auth;
