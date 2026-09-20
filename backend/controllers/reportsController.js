const db = require("../db");

const tables = [
  "beneficiaries",
  "loans",
  "projects",
  "trainings",
  "reports",
  "notifications",
];

/* ==========================================
   EXPORT DATA
========================================== */

exports.exportData = async (req, res) => {
  try {
    const data = {};

    for (const table of tables) {
      data[table] = await query(`SELECT * FROM ${table}`);
    }

    res.json(data);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export data",
    });
  }
};

/* ==========================================
   JSON BACKUP
========================================== */

exports.backup = async (req, res) => {
  try {
    const backup = {};

    for (const table of tables) {
      backup[table] = await query(`SELECT * FROM ${table}`);
    }

    res.json(backup);
  } catch (error) {
    console.error("Backup error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create backup",
    });
  }
};

/* ==========================================
   RESTORE JSON
========================================== */

exports.restore = async (req, res) => {
  const data = req.body;

  try {
    for (const table of tables) {
      if (!Array.isArray(data[table])) {
        continue;
      }

      await query(`DELETE FROM ${table}`);

      for (const record of data[table]) {
        const keys = Object.keys(record);

        if (keys.length === 0) continue;

        const columns = keys.map((key) => `\`${key}\``).join(", ");

        const placeholders = keys.map(() => "?").join(", ");

        const values = keys.map((key) => record[key]);

        await query(
          `INSERT INTO ${table} (${columns})
                     VALUES (${placeholders})`,
          values,
        );
      }
    }

    res.json({
      success: true,
      message: "Database restored successfully",
    });
  } catch (error) {
    console.error("Restore error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to restore database",
    });
  }
};

/* ==========================================
   DATABASE QUERY HELPER
========================================== */

function query(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

/* ==========================================
   EMPLOYMENT REPORT
========================================== */

exports.employmentReport = async (req, res) => {
  try {
    const results = await query(`
            SELECT
                COUNT(*) AS total_beneficiaries,
                SUM(
                    CASE
                        WHEN employment_status IS NOT NULL
                        AND employment_status <> ''
                        THEN 1
                        ELSE 0
                    END
                ) AS employed_beneficiaries
            FROM beneficiaries
        `);

    const data = results[0] || {};

    const content = `
ALLCARE - NATAN
EMPLOYMENT REPORT
==========================================

Total Beneficiaries: ${data.total_beneficiaries || 0}
Beneficiaries with Employment: ${data.employed_beneficiaries || 0}

Generated: ${new Date().toLocaleString()}
`.trim();

    res.json({
      success: true,
      title: "employment_report",
      content,
    });
  } catch (error) {
    console.error("Employment report error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate employment report.",
    });
  }
};

/* ==========================================
   INCOME GROWTH REPORT
========================================== */

exports.incomeReport = async (req, res) => {
  try {
    const results = await query(`
            SELECT
                COUNT(*) AS total_beneficiaries,
                COALESCE(AVG(previous_income), 0) AS average_previous_income,
                COALESCE(AVG(current_income), 0) AS average_current_income
            FROM beneficiaries
        `);

    const data = results[0] || {};

    const previous = Number(data.average_previous_income || 0);

    const current = Number(data.average_current_income || 0);

    let growth = 0;

    if (previous > 0) {
      growth = ((current - previous) / previous) * 100;
    }

    const content = `
ALLCARE - NATAN
INCOME GROWTH REPORT
==========================================

Total Beneficiaries: ${data.total_beneficiaries || 0}

Average Previous Income:
GHS ${previous.toFixed(2)}

Average Current Income:
GHS ${current.toFixed(2)}

Income Growth:
${growth.toFixed(2)}%

Generated: ${new Date().toLocaleString()}
`.trim();

    res.json({
      success: true,
      title: "income_growth_report",
      content,
    });
  } catch (error) {
    console.error("Income report error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate income report.",
    });
  }
};

/* ==========================================
   DONOR ACCOUNTABILITY REPORT
========================================== */

exports.donorReport = async (req, res) => {
  try {
    const results = await query(`
            SELECT
                COUNT(*) AS total_donations,
                COALESCE(SUM(amount), 0) AS total_amount,
                COALESCE(AVG(amount), 0) AS average_donation
            FROM donations
        `);

    const data = results[0] || {};

    const content = `
ALLCARE - NATAN
DONOR ACCOUNTABILITY REPORT
==========================================

Total Donations:
${data.total_donations || 0}

Total Donations Received:
GHS ${Number(data.total_amount || 0).toFixed(2)}

Average Donation:
GHS ${Number(data.average_donation || 0).toFixed(2)}

Generated: ${new Date().toLocaleString()}
`.trim();

    res.json({
      success: true,
      title: "donor_accountability_report",
      content,
    });
  } catch (error) {
    console.error("Donor report error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate donor report.",
    });
  }
};
