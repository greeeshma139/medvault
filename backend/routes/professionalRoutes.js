const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfessionalProfile,
  updateProfessionalProfile,
  getAllProfessionals,
  getProfessionalById,
} = require("../controllers/professionalController");

const router = express.Router();

// Public routes
router.get("/", getAllProfessionals);

// Protected routes (must come before /:id to avoid route matching conflicts)
router.get("/profile", authMiddleware, getProfessionalProfile);
router.put("/profile", authMiddleware, updateProfessionalProfile);

// Dynamic routes (must come last)
router.get("/:id", getProfessionalById);

module.exports = router;
