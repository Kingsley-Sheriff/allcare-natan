
const express = require("express");
const router = express.Router();

const trackerController = require("../controllers/trackerController");

// Get all beneficiaries/trackers
router.get("/", trackerController.getAllTrackers);

// Get one beneficiary/tracker
router.get("/:id", trackerController.getTrackerById);

// Create a beneficiary/tracker
router.post("/", trackerController.createTracker);

// Update a beneficiary/tracker
router.put("/:id", trackerController.updateTracker);

// Delete a beneficiary/tracker
router.delete("/:id", trackerController.deleteTracker);

module.exports = router;
