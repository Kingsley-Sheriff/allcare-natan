
const db = require("../db");

// Dashboard Statistics
exports.getDashboardStats = (req, res) => {
    const stats = {};
    db.query(
        "SELECT COUNT(*) AS total FROM beneficiaries",
        (err, beneficiaries) => {
            if (err) return res.status(500).json(err);
            stats.beneficiaries = beneficiaries[0].total;
            db.query(
                "SELECT COUNT(*) AS total FROM loans",
                (err, loans) => {
                    if (err) return res.status(500).json(err);
                    stats.loans = loans[0].total;
                    db.query(
                        "SELECT COUNT(*) AS total FROM projects",
                        (err, projects) => {
                            if (err) return res.status(500).json(err);
                            stats.projects = projects[0].total;
                            db.query(
                                "SELECT COUNT(*) AS total FROM trainings",
                                (err, trainings) => {
                                    if (err) return res.status(500).json(err);
                                    stats.trainings = trainings[0].total;

                                    db.query(
                                        "SELECT COUNT(*) AS total FROM reports",
                                        (err, reports) => {
                                            if (err) return res.status(500).json(err);
                                            stats.reports = reports[0].total;
                                            db.query(
                                                "SELECT COUNT(*) AS total FROM notifications",
                                                (err, notifications) => {
                                                    if (err) return res.status(500).json(err);
                                                    stats.notifications = notifications[0].total;
                                                    res.json(stats);
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};
