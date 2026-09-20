
const db = require("../db");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
    const sql = `
        SELECT
            id,
            full_name AS fullname,
            username,
            email,
            phone,
            role,
            status
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to load users"
            });
        }

        res.json(results);
    });
};

exports.createUser = async (req, res) => {
    const {
        fullname,
        email,
        phone,
        password,
        role,
        status
    } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Required fields are missing"
        });
    }

    try {
        const username = email.split("@")[0];
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users
            (full_name, username, email, phone, role, password, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                fullname,
                username,
                email,
                phone,
                role,
                hashedPassword,
                status
            ],
            (err) => {
                if (err) {
                    console.error(err);

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            success: false,
                            message: "Email already exists"
                        });
                    }

                    return res.status(500).json({
                        success: false,
                        message: "Failed to create user"
                    });
                }

                res.json({
                    success: true,
                    message: "User created successfully"
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;

    const {
        fullname,
        email,
        phone,
        password,
        role,
        status
    } = req.body;

    try {
        let sql;
        let values;

        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);

            sql = `
                UPDATE users
                SET
                    full_name = ?,
                    email = ?,
                    phone = ?,
                    role = ?,
                    status = ?,
                    password = ?
                WHERE id = ?
            `;

            values = [
                fullname,
                email,
                phone,
                role,
                status,
                hashedPassword,
                id
            ];
        } else {
            sql = `
                UPDATE users
                SET
                    full_name = ?,
                    email = ?,
                    phone = ?,
                    role = ?,
                    status = ?
                WHERE id = ?
            `;

            values = [
                fullname,
                email,
                phone,
                role,
                status,
                id
            ];
        }

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update user"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                message: "User updated successfully"
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update user"
        });
    }
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM users WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete user"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                message: "User deleted successfully"
            });
        }
    );
};
