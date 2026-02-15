const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getPatientProfile,
  updatePatientProfile,
  addPreferredDoctor,
} = require('../controllers/patientController');

const router = express.Router();

// Protected routes
router.get('/profile', authMiddleware, getPatientProfile);
router.put('/profile', authMiddleware, updatePatientProfile);
router.post('/add-preferred-doctor', authMiddleware, addPreferredDoctor);

module.exports = router;
