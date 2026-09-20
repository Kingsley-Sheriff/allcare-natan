const express = require("express");
const router = express.Router();

const trainingController = require("../controllers/trainingController");

router.get("/", trainingController.getTrainings);
router.post("/", trainingController.createTraining);
router.put("/:id", trainingController.updateTraining);
router.delete("/:id", trainingController.deleteTraining);

module.exports = router;
