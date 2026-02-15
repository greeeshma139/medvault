const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProfessionalProfile,
  updateProfessionalProfile,
  getAllProfessionals,
  getProfessionalById,
} = require('../controllers/professionalController');

const router = express.Router();

// Public routes
router.get('/', getAllProfessionals);
router.get('/:id', getProfessionalById);

// Protected routes
router.get('/profile', authMiddleware, getProfessionalProfile);
router.put('/profile', authMiddleware, updateProfessionalProfile);

module.exports = router;
