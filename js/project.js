/*
==========================================
ALLCARE PROJECT MANAGEMENT
==========================================
*/

const Projects = {
  initialize() {
    const form = document.getElementById("projectForm");

    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.saveProject();
    });

    this.renderProjects();
  },

  async saveProject() {
    const name = document.getElementById("projectName").value.trim();

    const description = document
      .getElementById("projectDescription")
      .value.trim();

    const progressInput = document.getElementById("projectProgress").value;
    const progress = Number(progressInput);

    const status = document.getElementById("projectStatus").value;

    // ==============================
    // FRONTEND VALIDATION
    // ==============================

    if (!name) {
      Notification.error("Project name is required.");
      return;
    }

    if (name.length < 3) {
      Notification.error("Project name must be at least 3 characters.");
      return;
    }

    if (name.length > 150) {
      Notification.error("Project name must not exceed 150 characters.");
      return;
    }

    if (!description) {
      Notification.error("Project description is required.");
      return;
    }

    if (description.length < 10) {
      Notification.error(
        "Project description must be at least 10 characters.",
      );
      return;
    }

    if (description.length > 1000) {
      Notification.error(
        "Project description must not exceed 1000 characters.",
      );
      return;
    }

    if (progressInput === "") {
      Notification.error("Completion percentage is required.");
      return;
    }

    if (!Number.isFinite(progress)) {
      Notification.error("Completion percentage must be a valid number.");
      return;
    }

    if (progress < 0 || progress > 100) {
      Notification.error(
        "Completion percentage must be between 0 and 100.",
      );
      return;
    }

    if (!Number.isInteger(progress)) {
      Notification.error(
        "Completion percentage must be a whole number.",
      );
      return;
    }

    const validStatuses = ["Planning", "Ongoing", "Completed"];

    if (!validStatuses.includes(status)) {
      Notification.error("Please select a valid project status.");
      return;
    }

    // ==============================
    // SEND TO BACKEND
    // ==============================

    try {
      const response = await fetch("http://localhost:3000/projects", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          description,
          progress,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save project.");
      }

      Notification.success("Project saved successfully.");

      document.getElementById("projectForm").reset();

      this.renderProjects();

      if (typeof Dashboard !== "undefined") {
        Dashboard.refresh();
      }
    } catch (error) {
      console.error("Failed to save project:", error);

      Notification.error(
        error.message || "Failed to save project.",
      );
    }
  },

  async renderProjects() {
    const container = document.getElementById("projectList");

    if (!container) return;

    try {
      const response = await fetch("http://localhost:3000/projects");

      if (!response.ok) {
        throw new Error("Failed to load projects.");
      }

      const projects = await response.json();

      if (projects.length === 0) {
        container.innerHTML = "<p>No projects yet.</p>";
        return;
      }

      container.innerHTML = projects
        .map(
          (project) => `
            <div class="project-item">
              <h4>${this.escapeHTML(project.name)}</h4>

              <p>${this.escapeHTML(project.description)}</p>

              <p>
                Status:
                <strong>${this.escapeHTML(project.status)}</strong>
              </p>

              <p>
                Progress:
                <strong>${Number(project.progress)}%</strong>
              </p>

              <hr>
            </div>
          `,
        )
        .join("");
    } catch (error) {
      console.error("Failed to load projects:", error);

      container.innerHTML = "<p>Failed to load projects.</p>";
    }
  },

  escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  },
};

Projects.initialize();

