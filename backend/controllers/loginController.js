const db = require("../db");
const bcrypt = require("bcrypt");


exports.login = (req, res) => {

    let { email, password } = req.body;


    /* ==========================================
       BASIC INPUT VALIDATION
       ========================================== */

    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid login information."
        });
    }


    /* ==========================================
       CLEAN INPUT
       ========================================== */

    email = email.trim().toLowerCase();


    /* ==========================================
       EMAIL VALIDATION
       ========================================== */

    const emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

    if (!emailPattern.test(email)) {

        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }


    /* ==========================================
       PASSWORD VALIDATION
       ========================================== */

    if (password.length === 0) {

        return res.status(400).json({
            success: false,
            message: "Please enter your password."
        });
    }


    if (password.length > 128) {

        return res.status(400).json({
            success: false,
            message: "Invalid password."
        });
    }


    /* ==========================================
       1. CHECK ADMINISTRATORS
       ========================================== */

    const adminSql = `
        SELECT
            id,
            full_name,
            username,
            email,
            phone,
            password
        FROM administrators
        WHERE email = ?
        LIMIT 1
    `;


    db.query(adminSql, [email], async (err, admins) => {

        if (err) {

            console.error("Administrator login error:", err);

            return res.status(500).json({
                success: false,
                message: "Server error."
            });
        }


        if (admins.length > 0) {

            const admin = admins[0];


            try {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        admin.password
                    );


                if (!passwordMatch) {

                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password."
                    });
                }


                return res.json({

                    success: true,

                    message: "Login successful.",

                    user: {
                        id: admin.id,
                        full_name: admin.full_name,
                        email: admin.email,
                        role: "Administrator"
                    }
                });

            }

            catch (error) {

                console.error(
                    "Administrator password verification error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error."
                });
            }
        }


        /* ==========================================
           2. CHECK NORMAL USERS
           ========================================== */

        const userSql = `
            SELECT
                id,
                full_name,
                email,
                phone,
                role,
                password
            FROM users
            WHERE email = ?
            LIMIT 1
        `;


        db.query(userSql, [email], async (err, users) => {

            if (err) {

                console.error("User login error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Server error."
                });
            }


            if (users.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }


            const user = users[0];


            try {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );


                if (!passwordMatch) {

                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password."
                    });
                }


                return res.json({

                    success: true,

                    message: "Login successful.",

                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        role: user.role
                    }
                });

            }

            catch (error) {

                console.error(
                    "User password verification error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error."
                });
            }
        });
    });
};
