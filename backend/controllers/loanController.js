const db = require("../db");

// GET /loans
exports.getLoans = (req, res) => {
  const sql = `
        SELECT
            id,
            reference_no AS referenceNo,
            user_id AS userId,
            full_name AS name,
            email,
            phone,
            category,
            amount,
            reason,
            status,
            submitted_at AS submittedAt
        FROM loans
        ORDER BY id DESC
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching loans:", err);

      return res.status(500).json({
        message: "Failed to fetch loans",
      });
    }

    res.json(results);
  });
};

// POST /loans
exports.createLoan = (req, res) => {
  const { name, email, phone, category, amount, reason } = req.body;

  const sql = `
        INSERT INTO loans
        (
            full_name,
            email,
            phone,
            category,
            amount,
            reason,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `;

  db.query(
    sql,
    [name, email, phone, category, amount, reason],
    (err, result) => {
      if (err) {
        console.error("Error creating loan:", err);

        return res.status(500).json({
          message: "Failed to create loan",
        });
      }

      res.status(201).json({
        message: "Loan application submitted successfully",
        id: result.insertId,
      });
    },
  );
};

// PUT /loans/:id
exports.updateLoan = (req, res) => {
  const { id } = req.params;

  const { category, amount, reason, status } = req.body;

  let sql;
  let values;

  if (status && category === undefined) {
    sql = `
            UPDATE loans
            SET status = ?
            WHERE id = ?
        `;

    values = [status, id];
  } else {
    sql = `
            UPDATE loans
            SET
                category = ?,
                amount = ?,
                reason = ?,
                status = ?
            WHERE id = ?
        `;

    values = [category, amount, reason, status, id];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating loan:", err);

      return res.status(500).json({
        message: "Failed to update loan",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }

    res.json({
      message: "Loan updated successfully",
    });
  });
};

// DELETE /loans/:id
exports.deleteLoan = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM loans WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting loan:", err);

      return res.status(500).json({
        message: "Failed to delete loan",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }

    res.json({
      message: "Loan deleted successfully",
    });
  });
};
