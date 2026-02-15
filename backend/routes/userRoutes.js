const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  register,
  login,
  verifyEmail,
  getCurrentUser,
  updateProfile,
} = require('../controllers/userController');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
