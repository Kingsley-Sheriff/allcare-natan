/*
==========================================
ALLCARE SIGNUP VALIDATION
==========================================
*/

const Signup = {
  initialize() {
    const form = document.getElementById("signupForm");

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      this.register();
    });
  },

  validateName(name) {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name);
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  },

  validatePhone(phone) {
    return /^(0[235][0-9]{8}|233[235][0-9]{8})$/.test(phone);
  },

  validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
      password,
    );
  },

  async register() {
    const full_name = document.getElementById("signupName").value.trim();

    const email = document.getElementById("signupEmail").value.trim();

    const phone = document.getElementById("signupPhone").value.trim();

    const password = document.getElementById("signupPassword").value;

    const confirm = document.getElementById("signupConfirmPassword").value;

    const terms = document.getElementById("terms").checked;

    /* ==========================================
           NAME VALIDATION
           ========================================== */

    if (!full_name) {
      Notification.error("Please enter your full name.");

      return;
    }

    if (full_name.length < 2 || full_name.length > 100) {
      Notification.error("Full name must be between 2 and 100 characters.");

      return;
    }

    if (!this.validateName(full_name)) {
      Notification.error(
        "Full name can only contain letters, spaces, hyphens and apostrophes.",
      );

      return;
    }

    /* ==========================================
           EMAIL VALIDATION
           ========================================== */

    if (!email) {
      Notification.error("Please enter your email address.");

      return;
    }

    if (!this.validateEmail(email)) {
      Notification.error("Please enter a valid email address.");

      return;
    }

    /* ==========================================
           PHONE VALIDATION
           ========================================== */

    if (!phone) {
      Notification.error("Please enter your phone number.");

      return;
    }

    if (!this.validatePhone(phone)) {
      Notification.error(
        "Enter a valid Ghana phone number: 0552699205 or 233552699205.",
      );

      return;
    }

    /* ==========================================
           PASSWORD VALIDATION
           ========================================== */

    if (!this.validatePassword(password)) {
      Notification.error(
        "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number and special character.",
      );

      return;
    }

    /* ==========================================
           CONFIRM PASSWORD
           ========================================== */

    if (password !== confirm) {
      Notification.error("Passwords do not match.");

      return;
    }

    /* ==========================================
           TERMS & CONDITIONS
           ========================================== */

    if (!terms) {
      Notification.warning("Please agree to the Terms & Conditions.");

      return;
    }

    /* ==========================================
           SEND TO BACKEND
           ========================================== */

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/signup", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Notification.error(data.message || "Registration failed.");

        return;
      }

      if (data.success) {
        Notification.success("Registration successful.");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1000);
      } else {
        Notification.error(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);

      Notification.error("Cannot connect to the server.");
    }
  },
};

Signup.initialize();
