const db = require("../db");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { full_name, email, phone, password } = req.body;

  /* ==========================================
       REQUIRED FIELDS
       ========================================== */

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  /* ==========================================
       NAME VALIDATION
       ========================================== */

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  if (
    full_name.length < 2 ||
    full_name.length > 100 ||
    !nameRegex.test(full_name)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid full name. Use letters, spaces, hyphens or apostrophes only.",
    });
  }

  /* ==========================================
       EMAIL VALIDATION
       ========================================== */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  /* ==========================================
       PHONE VALIDATION
       ========================================== */

  const phoneRegex = /^(0[235][0-9]{8}|233[235][0-9]{8})$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid Ghana phone number: 0552699205 or 233552699205.",
    });
  }

  /* ==========================================
       PASSWORD VALIDATION
       ========================================== */

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number and special character.",
    });
  }

  try {
    /* ==========================================
           CHECK EXISTING EMAIL
           ========================================== */

    const existingUser = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(results);
        },
      );
    });

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    /* ==========================================
           GENERATE USERNAME
           ========================================== */

    const username = email.split("@")[0];

    const role = "Volunteer";

    /* ==========================================
           HASH PASSWORD
           ========================================== */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ==========================================
           INSERT USER
           ========================================== */

    const sql = `
            INSERT INTO users
            (
                full_name,
                username,
                email,
                phone,
                role,
                password
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    db.query(
      sql,
      [full_name, username, email, phone, role, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            success: false,
            message: "Unable to create account.",
          });
        }

        res.status(201).json({
          success: true,

          message: "User created successfully.",

          userId: result.insertId,
        });
      },
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "An unexpected server error occurred.",
    });
  }
};
