const db = require("../db");

const VALID_STATUSES = ["Planning", "Ongoing", "Completed"];

function validateProject(name, description, progress, status) {
  if (typeof name !== "string" || !name.trim()) {
    return "Project name is required.";
  }

  if (name.trim().length < 3) {
    return "Project name must be at least 3 characters.";
  }

  if (name.trim().length > 150) {
    return "Project name must not exceed 150 characters.";
  }

  if (typeof description !== "string" || !description.trim()) {
    return "Project description is required.";
  }

  if (description.trim().length < 10) {
    return "Project description must be at least 10 characters.";
  }

  if (description.trim().length > 1000) {
    return "Project description must not exceed 1000 characters.";
  }

  if (
    progress === undefined ||
    progress === null ||
    progress === ""
  ) {
    return "Completion percentage is required.";
  }

  const numericProgress = Number(progress);

  if (!Number.isFinite(numericProgress)) {
    return "Completion percentage must be a valid number.";
  }

  if (numericProgress < 0 || numericProgress > 100) {
    return "Completion percentage must be between 0 and 100.";
  }

  if (!Number.isInteger(numericProgress)) {
    return "Completion percentage must be a whole number.";
  }

  if (
    typeof status !== "string" ||
    !VALID_STATUSES.includes(status)
  ) {
    return "Please select a valid project status.";
  }

  return null;
};


// ==========================================
// CREATE PROJECT
// ==========================================

exports.createProject = (req, res) => {
  const {
    name,
    description,
    progress,
    status,
  } = req.body;

  const validationError = validateProject(
    name,
    description,
    progress,
    status,
  );

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  const sql = `
    INSERT INTO projects
    (project_name, description, progress, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name.trim(),
      description.trim(),
      Number(progress),
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating project:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to create project.",
        });
      }

      res.status(201).json({
        success: true,
        message: "Project created successfully.",
        id: result.insertId,
      });
    },
  );
};


// ==========================================
// GET PROJECTS
// ==========================================

exports.getProjects = (req, res) => {
  const sql = `
    SELECT
      id,
      project_name AS name,
      description,
      progress,
      status,
      created_at AS createdAt
    FROM projects
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error loading projects:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to load projects.",
      });
    }

    res.json(results);
  });
};


// ==========================================
// UPDATE PROJECT
// ==========================================

exports.updateProject = (req, res) => {
  const { id } = req.params;

  const {
    name,
    description,
    progress,
    status,
  } = req.body;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID.",
    });
  }

  const validationError = validateProject(
    name,
    description,
    progress,
    status,
  );

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  const sql = `
    UPDATE projects
    SET
      project_name = ?,
      description = ?,
      progress = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name.trim(),
      description.trim(),
      Number(progress),
      status,
      Number(id),
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating project:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to update project.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      res.json({
        success: true,
        message: "Project updated successfully.",
      });
    },
  );
};


// ==========================================
// DELETE PROJECT
// ==========================================

exports.deleteProject = (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID.",
    });
  }

  const sql = "DELETE FROM projects WHERE id = ?";

  db.query(sql, [Number(id)], (err, result) => {
    if (err) {
      console.error("Error deleting project:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to delete project.",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  });
};
