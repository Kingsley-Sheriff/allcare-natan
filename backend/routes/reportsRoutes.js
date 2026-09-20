const express = require("express");

const router = express.Router();

const reportsController = require("../controllers/reportsController");

/* ==========================================
   PROJECT IMPACT REPORTS
========================================== */

router.get("/employment", reportsController.employmentReport);

router.get("/income", reportsController.incomeReport);

router.get("/donor", reportsController.donorReport);

/* ==========================================
   ADMIN DATA EXPORT
========================================== */

router.get("/export-data", reportsController.exportData);

router.get("/backup", reportsController.backup);

router.post("/restore", reportsController.restore);

module.exports = router;
