const db = require("../db");
const crypto = require("crypto");

// =====================================================
// PAYSTACK MOBILE MONEY
// =====================================================

// =====================================================
// START MOBILE MONEY PAYMENT
// =====================================================

exports.startMobileMoneyPayment = async (req, res) => {
  try {
    let {
      donor_name,
      donor_email,
      amount,
      anonymous,
      mobile_money_phone,
      mobile_money_provider,
    } = req.body;

    const donation_type = "One-Time";
    const payment_method = "Mobile Money";
    // =========================
    // BASIC TYPE VALIDATION
    // =========================

    if (
      typeof donor_name !== "string" ||
      typeof donor_email !== "string" ||
      typeof mobile_money_phone !== "string" ||
      typeof mobile_money_provider !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation information.",
      });
    }

    donor_name = donor_name.trim();

    donor_email = donor_email.trim().toLowerCase();

    mobile_money_phone = mobile_money_phone.trim();

    mobile_money_provider = mobile_money_provider.trim().toLowerCase();

    // =========================
    // ANONYMOUS
    // =========================

    if (anonymous !== true && anonymous !== false) {
      anonymous = Boolean(anonymous);
    }

    if (!anonymous) {
      const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

      if (
        donor_name.length < 2 ||
        donor_name.length > 100 ||
        !namePattern.test(donor_name)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid donor name.",
        });
      }
    } else {
      donor_name = "Anonymous Donor";
    }

    // =========================
    // EMAIL
    // =========================

    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (donor_email.length > 254 || !emailPattern.test(donor_email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // =========================
    // AMOUNT
    // =========================

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid donation amount.",
      });
    }

    if (Math.round(amount * 100) !== amount * 100) {
      return res.status(400).json({
        success: false,
        message: "Donation amount can have a maximum of two decimal places.",
      });
    }

    // =========================
    // MOBILE MONEY PHONE
    // =========================

    const phonePattern = /^(\+233|0)[235][0-9]{8}$/;

    if (!phonePattern.test(mobile_money_phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Ghana Mobile Money number.",
      });
    }

    // =========================
    // PROVIDER
    // =========================

    const allowedProviders = ["mtn", "atl", "vod"];

    if (!allowedProviders.includes(mobile_money_provider)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid Mobile Money provider.",
      });
    }

    // =========================
    // PAYSTACK KEY
    // =========================

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is missing.");

      return res.status(500).json({
        success: false,
        message: "Payment service is not configured.",
      });
    }

    // =========================
    // CREATE UNIQUE REFERENCE
    // =========================

    const referenceNo = `DON-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    // Paystack expects amount in pesewas.
    const amountInPesewas = Math.round(amount * 100);

    // =========================
    // PAYSTACK CHARGE
    // =========================

    const paystackResponse = await fetch("https://api.paystack.co/charge", {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        amount: amountInPesewas,

        email: donor_email,

        currency: "GHS",

        reference: referenceNo,

        mobile_money: {
          phone: mobile_money_phone,

          provider: mobile_money_provider,
        },

        metadata: {
          reference_no: referenceNo,

          donor_name,

          donor_email,

          donation_type,

          amount,

          payment_method,

          anonymous,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || paystackData.status !== true) {
        console.error("Paystack charge error:", paystackData);

        return res.status(400).json({
        success: false,
        message: "Unable to start Mobile Money payment.",
        paystack_status: paystackData.status,
        paystack_message: paystackData.message,
      });
    }

    // =========================
    // PAYMENT CREATED
    // =========================

    return res.status(200).json({
      success: true,

      message: "Mobile Money payment initiated.",

      reference: paystackData.data.reference,

      status: paystackData.data.status,

      display_text: paystackData.data.display_text,
    });
  } catch (error) {
    console.error("Mobile Money payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to connect to the payment service.",
    });
  }
};

// =====================================================
// VERIFY MOBILE MONEY PAYMENT
// =====================================================

exports.verifyMobileMoneyPayment = async (req, res) => {
  try {
    const reference = req.params.reference;

    if (
      typeof reference !== "string" ||
      !/^DON-[A-Za-z0-9-]+$/.test(reference)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment reference.",
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
      return res.status(400).json({
        success: false,
        message: result.message || "Unable to verify payment.",
      });
    }

    const transaction = result.data;

    // =========================
    // PAYMENT SUCCESS
    // =========================

    if (transaction.status !== "success") {
      return res.json({
        success: true,

        paid: false,

        status: transaction.status,

        message:
          transaction.gateway_response || "Payment is not completed yet.",
      });
    }

    // =========================
    // PREVENT DUPLICATES
    // =========================

    db.query(
      "SELECT id FROM donations WHERE reference_no = ? LIMIT 1",
      [reference],
      (checkError, existing) => {
        if (checkError) {
          console.error("Donation lookup error:", checkError);

          return res.status(500).json({
            success: false,
            message: "Unable to verify donation record.",
          });
        }

        if (existing.length > 0) {
          return res.json({
            success: true,

            paid: true,

            reference,

            message: "Payment already recorded.",
          });
        }

        const metadata = transaction.metadata || {};

        const donorName =
          metadata.donor_name ||
          transaction.customer?.first_name ||
          "Anonymous Donor";

        const donorEmail =
          metadata.donor_email || transaction.customer?.email || "";

        const donationType = metadata.donation_type || "One-Time";

        const anonymous =
          metadata.anonymous === true || metadata.anonymous === "true";

        const donationAmount =
          Number(metadata.amount) || Number(transaction.amount) / 100;

        const sql = `
                    INSERT INTO donations
                    (
                        reference_no,
                        donor_name,
                        donor_email,
                        donation_type,
                        amount,
                        payment_method,
                        anonymous
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

        db.query(
          sql,
          [
            reference,
            anonymous ? "Anonymous Donor" : donorName,
            donorEmail,
            donationType,
            donationAmount,
            "Mobile Money",
            anonymous,
          ],
          (insertError) => {
            if (insertError) {
              console.error("Donation record error:", insertError);

              return res.status(500).json({
                success: false,
                message:
                  "Payment succeeded but donation record could not be saved.",
              });
            }

            return res.json({
              success: true,

              paid: true,

              reference,

              message: "Payment successful and donation recorded.",
            });
          },
        );
      },
    );
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment.",
    });
  }
};

// =====================================================
// PAYSTACK WEBHOOK
// =====================================================

exports.paystackWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      return res.sendStatus(401);
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.rawBody)
      .digest("hex");

    if (hash !== signature) {
      return res.sendStatus(401);
    }

    const event = req.body;

    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const transaction = event.data;

    const reference = transaction.reference;

    if (!reference) {
      return res.sendStatus(200);
    }

    // The frontend verification endpoint
    // also records the donation.
    // We only need to acknowledge the webhook here.

    return res.sendStatus(200);
  } catch (error) {
    console.error("Paystack webhook error:", error);

    return res.sendStatus(500);
  }
};
