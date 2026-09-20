const db = require("../db");


// ==========================================
// VALIDATION HELPERS
// ==========================================

const namePattern =
    /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;


function validateName(name) {

    if (typeof name !== "string") {
        return "Beneficiary name is required.";
    }

    name = name.trim();

    if (name.length < 2 || name.length > 100) {
        return "Beneficiary name must be between 2 and 100 characters.";
    }

    if (!namePattern.test(name)) {
        return "Beneficiary name can only contain letters, spaces, hyphens and apostrophes.";
    }

    return null;
}


function validateEmployment(employment) {

    if (typeof employment !== "string") {
        return "Employment status is required.";
    }

    if (!employment.trim()) {
        return "Employment status is required.";
    }

    if (employment.trim().length > 50) {
        return "Invalid employment status.";
    }

    return null;
}


function validateIncome(value, fieldName) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return `${fieldName} is required.`;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return `${fieldName} must be a valid number.`;
    }

    if (number < 0) {
        return `${fieldName} cannot be negative.`;
    }

    return null;
}


function validateBusinessStarted(value) {

    if (typeof value !== "string") {
        return "Business status is required.";
    }

    value = value.trim().toLowerCase();

    if (!["yes", "no"].includes(value)) {
        return "Business status must be Yes or No.";
    }

    return null;
}


function validateTrackerData(data) {

    const {
        name,
        employment,
        previousIncome,
        currentIncome,
        businessStarted
    } = data;


    let error = validateName(name);
    if (error) return error;


    error = validateEmployment(employment);
    if (error) return error;


    error = validateIncome(
        previousIncome,
        "Previous income"
    );

    if (error) return error;


    error = validateIncome(
        currentIncome,
        "Current income"
    );

    if (error) return error;


    error = validateBusinessStarted(
        businessStarted
    );

    if (error) return error;


    return null;
}


// ==========================================
// GET ALL TRACKERS
// ==========================================

exports.getAllTrackers = (req, res) => {

    const sql = `
        SELECT
            id,
            full_name AS name,
            employment_status AS employment,
            previous_income AS previousIncome,
            current_income AS currentIncome,
            business_started AS businessStarted,
            created_at AS createdAt
        FROM beneficiaries
        ORDER BY id DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Error fetching beneficiaries:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch beneficiaries"
            });
        }


        res.json(results);
    });
};


// ==========================================
// GET TRACKER BY ID
// ==========================================

exports.getTrackerById = (req, res) => {

    const { id } = req.params;


    if (!/^\d+$/.test(id)) {

        return res.status(400).json({
            message: "Invalid beneficiary ID."
        });
    }


    const sql = `
        SELECT
            id,
            full_name AS name,
            employment_status AS employment,
            previous_income AS previousIncome,
            current_income AS currentIncome,
            business_started AS businessStarted,
            created_at AS createdAt
        FROM beneficiaries
        WHERE id = ?
    `;


    db.query(sql, [id], (err, results) => {

        if (err) {

            console.error(
                "Error fetching beneficiary:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch beneficiary"
            });
        }


        if (results.length === 0) {

            return res.status(404).json({
                message: "Beneficiary not found"
            });
        }


        res.json(results[0]);
    });
};


// ==========================================
// CREATE TRACKER
// ==========================================

exports.createTracker = (req, res) => {

    const {
        name,
        employment,
        previousIncome,
        currentIncome,
        businessStarted
    } = req.body;


    const validationError = validateTrackerData({
        name,
        employment,
        previousIncome,
        currentIncome,
        businessStarted
    });


    if (validationError) {

        return res.status(400).json({
            message: validationError
        });
    }


    const cleanName = name.trim();
    const cleanEmployment = employment.trim();
    const cleanBusinessStarted =
        businessStarted.trim().toLowerCase();

    const cleanPreviousIncome =
        Number(previousIncome);

    const cleanCurrentIncome =
        Number(currentIncome);


    const sql = `
        INSERT INTO beneficiaries
        (
            full_name,
            employment_status,
            previous_income,
            current_income,
            business_started
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            cleanName,
            cleanEmployment,
            cleanPreviousIncome,
            cleanCurrentIncome,
            cleanBusinessStarted
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Error creating beneficiary:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to create beneficiary"
                });
            }


            res.status(201).json({
                message: "Beneficiary created successfully",
                id: result.insertId
            });
        }
    );
};


// ==========================================
// UPDATE TRACKER
// ==========================================

exports.updateTracker = (req, res) => {

    const { id } = req.params;


    if (!/^\d+$/.test(id)) {

        return res.status(400).json({
            message: "Invalid beneficiary ID."
        });
    }


    const {
        name,
        employment,
        previousIncome,
        currentIncome,
        businessStarted
    } = req.body;


    const validationError = validateTrackerData({
        name,
        employment,
        previousIncome,
        currentIncome,
        businessStarted
    });


    if (validationError) {

        return res.status(400).json({
            message: validationError
        });
    }


    const cleanName = name.trim();
    const cleanEmployment = employment.trim();
    const cleanBusinessStarted =
        businessStarted.trim().toLowerCase();

    const cleanPreviousIncome =
        Number(previousIncome);

    const cleanCurrentIncome =
        Number(currentIncome);


    const sql = `
        UPDATE beneficiaries
        SET
            full_name = ?,
            employment_status = ?,
            previous_income = ?,
            current_income = ?,
            business_started = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            cleanName,
            cleanEmployment,
            cleanPreviousIncome,
            cleanCurrentIncome,
            cleanBusinessStarted,
            id
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Error updating beneficiary:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to update beneficiary"
                });
            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Beneficiary not found"
                });
            }


            res.json({
                message: "Beneficiary updated successfully"
            });
        }
    );
};


// ==========================================
// DELETE TRACKER
// ==========================================

exports.deleteTracker = (req, res) => {

    const { id } = req.params;


    if (!/^\d+$/.test(id)) {

        return res.status(400).json({
            message: "Invalid beneficiary ID."
        });
    }


    const sql =
        "DELETE FROM beneficiaries WHERE id = ?";


    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error(
                "Error deleting beneficiary:",
                err
            );

            return res.status(500).json({
                message: "Failed to delete beneficiary"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Beneficiary not found"
            });
        }


        res.json({
            message: "Beneficiary deleted successfully"
        });
    });
};
