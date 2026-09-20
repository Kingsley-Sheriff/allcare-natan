const Donation = {
  initialize() {
    this.initializeAmountButtons();

    const form = document.getElementById("donationForm");

    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.submitDonation();
    });
  },

  // ==========================================
  // AMOUNT BUTTONS
  // ==========================================

  initializeAmountButtons() {
    const buttons = document.querySelectorAll(".amount-btn");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("active"));

        button.classList.add("active");

        document.getElementById("donationAmount").value = button.dataset.amount;
      });
    });
  },

  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  // ==========================================
  // SUBMIT
  // ==========================================

  async submitDonation() {
    const type = document.getElementById("donationType").value;

    const amount = Number(document.getElementById("donationAmount").value);

    let name = document.getElementById("donorName").value.trim();

    const email = document.getElementById("donorEmail").value.trim();

    const payment = "Mobile Money";

    const anonymous = document.getElementById("anonymous").checked;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!type) {
      Notification.error("Please select a donation type.");

      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      Notification.error("Please enter a valid donation amount.");

      return;
    }

    if (!email) {
      Notification.error("Please enter your email address.");

      return;
    }

    if (!anonymous && !name) {
      Notification.error("Please enter your full name.");

      return;
    }

    if (anonymous) {
      name = "Anonymous Donor";
    }

    // ==========================================
    // MOBILE MONEY
    // ==========================================
    const mobileMoneyPhone = document
      .getElementById("mobileMoneyPhone")
      .value.trim();

    const mobileMoneyProvider = document.getElementById(
      "mobileMoneyProvider",
    ).value;

    const ghanaPhonePattern = /^(\+233|0)[235][0-9]{8}$/;

    if (!ghanaPhonePattern.test(mobileMoneyPhone)) {
      Notification.error("Please enter a valid Ghana Mobile Money number.");
      return;
    }

    const allowedProviders = ["mtn", "atl", "vod"];

    if (!allowedProviders.includes(mobileMoneyProvider)) {
      Notification.error("Please select a valid Mobile Money network.");
      return;
    }

    if (!mobileMoneyPhone) {
      Notification.error("Please enter your Mobile Money number.");

      return;
    }

    if (!mobileMoneyProvider) {
      Notification.error("Please select your Mobile Money provider.");

      return;
    }

    // ==========================================
    // DISABLE BUTTON
    // ==========================================

    const button = document.querySelector(".donate-btn");

    if (button) {
      button.disabled = true;

      button.textContent = "Starting Payment...";
    }

    try {
      const response = await fetch(
        "http://localhost:3000/donations/mobile-money",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            donor_name: name,
            donor_email: email,
            amount,
            anonymous,
            mobile_money_phone: mobileMoneyPhone,
            mobile_money_provider: mobileMoneyProvider,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to start payment.");
      }

      // ==========================================
      // SHOW PAYSTACK INSTRUCTION
      // ==========================================

      Notification.info(
        `Check your ${mobileMoneyProvider.toUpperCase()} Mobile Money phone to complete the donation.`,
      );

      // ==========================================
      // WAIT FOR PAYMENT
      // ==========================================

      await this.waitForPayment(data.reference);
    } catch (error) {
      console.error("Donation payment error:", error);

      Notification.error(error.message || "Unable to process payment.");
    } finally {
      if (button) {
        button.disabled = false;

        button.textContent = "Donate Now";
      }
    }
  },

  // ==========================================
  // VERIFY PAYMENT
  // ==========================================

  async waitForPayment(reference) {
    const maximumAttempts = 36;

    for (let attempt = 0; attempt < maximumAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await fetch(
        `http://localhost:3000/donations/verify/${encodeURIComponent(reference)}`,
      );

      const result = await response.json();

      if (result.success && result.paid) {
        const donation = {
          reference_no: reference,

          amount: Number(document.getElementById("donationAmount").value),

          donor_name: document.getElementById("donorName").value.trim(),

          donor_email: document.getElementById("donorEmail").value.trim(),

          donation_type: document.getElementById("donationType").value,

          payment_method: "Mobile Money",

          anonymous: document.getElementById("anonymous").checked,
        };

        sessionStorage.setItem("latestDonation", JSON.stringify(donation));

        Notification.success(
          "Payment successful. Thank you for your donation!",
        );

        setTimeout(() => {
          window.location.href = "success.html";
        }, 1000);

        return;
      }

      if (result.status === "failed" || result.status === "abandoned") {
        throw new Error(result.message || "The payment was not completed.");
      }
    }
    throw new Error(
      "Payment confirmation timed out. Please check your Mobile Money account before trying again.",
    );
  },
};

Donation.initialize();
