const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/medicalRecordController");

// Create medical record (professional or patient)
router.post("/", auth, controller.createRecord);

// Specific routes (must come before /:id dynamic routes)
router.get("/me", auth, controller.getMyRecords);
router.get("/patient/:patientId", auth, controller.getPatientRecords);
router.get("/type/:recordType", auth, controller.getRecordsByType);

// Dynamic routes (must come last)
router.put("/:id", auth, controller.updateRecord);
router.post("/:id/documents", auth, controller.addDocument);
router.delete("/:id", auth, controller.deleteRecord);

module.exports = router;
