const db = require("../db");

exports.getTrainings = (req, res) => {
  const sql = `
        SELECT
            id,
            course_name AS course,
            description,
            status,
            created_at AS enrolledAt
        FROM trainings
        ORDER BY id DESC
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to load trainings",
      });
    }

    res.json(results);
  });
};

exports.createTraining = (req, res) => {
  const { course, description, status } = req.body;

  const sql = `
        INSERT INTO trainings
        (course_name, description, status)
        VALUES (?, ?, ?)
    `;

  db.query(
    sql,
    [course, description || "", status || "Enrolled"],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Failed to save training",
        });
      }

      res.json({
        success: true,
        id: result.insertId,
        message: "Training saved successfully",
      });
    },
  );
};

exports.updateTraining = (req, res) => {
  const { id } = req.params;
  const { course, description, status } = req.body;

  const sql = `
        UPDATE trainings
        SET
            course_name = ?,
            description = ?,
            status = ?
        WHERE id = ?
    `;

  db.query(sql, [course, description || "", status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to update training",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Training not found",
      });
    }

    res.json({
      success: true,
      message: "Training updated successfully",
    });
  });
};

exports.deleteTraining = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM trainings WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete training",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Training not found",
      });
    }

    res.json({
      success: true,
      message: "Training deleted successfully",
    });
  });
};
