const db = require("../db");

exports.getNotifications = (req, res) => {
  const sql = `
        SELECT
            id,
            title,
            message,
            notification_type AS type,
            created_at AS createdAt
        FROM notifications
        ORDER BY id DESC
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to load notifications",
      });
    }

    res.json(results);
  });
};
