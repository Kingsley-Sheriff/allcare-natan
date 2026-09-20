const express = require("express");

const router = express.Router();

const donationController =
    require("../controllers/donationController");


// Mobile Money payment
router.post(
    "/mobile-money",
    donationController.startMobileMoneyPayment
);


// Verify payment
router.get(
    "/verify/:reference",
    donationController.verifyMobileMoneyPayment
);


// Paystack webhook
router.post(
    "/webhook",
    donationController.paystackWebhook
);


module.exports = router;
