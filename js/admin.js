/*
==========================================
ALLCARE ADMIN DASHBOARD
==========================================
*/
const Admin = {
  initialize() {
    this.loadStatistics();
    this.loadBeneficiaries();
    this.loadLoans();
    this.loadProjects();
    this.loadTrainings();
    this.loadNotifications();
    this.initializeButtons();
    this.initializeSearch();
    this.initializeUsers();
    this.loadAdministrator();
    document
      .getElementById("adminSettingsForm")
      .addEventListener("submit", this.saveAdministrator.bind(this));
  },

  saveAdministrator(event) {
    event.preventDefault();
    const fullname = document.getElementById("adminFullName").value.trim();
    const username = document.getElementById("adminUsername").value.trim();
    const email = document.getElementById("adminEmail").value.trim();
    const phone = document.getElementById("adminPhone").value.trim();
    const password = document.getElementById("adminPassword").value;
    const confirmPassword = document.getElementById(
      "adminConfirmPassword",
    ).value;
    if (!fullname || !username || !email) {
      Notification.error("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Notification.error("Passwords do not match.");
      return;
    }

    const admin = Database.load(Database.keys.admin);
    admin.fullname = fullname;
    admin.username = username;
    admin.email = email;
    admin.phone = phone;
    if (password !== "") {
      admin.password = password;
    }

    admin.updatedAt = new Date().toLocaleString();
    Database.save(Database.keys.admin, admin);
    Notification.success("Administrator updated successfully.");

    document.getElementById("adminPassword").value = "";
    document.getElementById("adminConfirmPassword").value = "";
  },

  /* ==========================================
  STATISTICS
  ========================================== */

  async loadStatistics() {
    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/dashboard/stats");

      if (!response.ok) {
        throw new Error("Failed to load dashboard statistics");
      }

      const stats = await response.json();

      this.updateText("adminBeneficiaries", stats.beneficiaries);
      this.updateText("adminLoans", stats.loans);
      this.updateText("adminProjects", stats.projects);
      this.updateText("adminTrainings", stats.trainings);
      this.updateText("adminReports", stats.reports);
      this.updateText("adminNotifications", stats.notifications);
    } catch (error) {
      console.error("Failed to load dashboard statistics:", error);
    }
  },

  updateText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  },

  initializeUsers() {
    this.loadUsers();
    const modal = document.getElementById("userModal");
    const addButton = document.getElementById("addUserBtn");
    const closeButton = document.getElementById("closeUserModal");
    const form = document.getElementById("userForm");

    if (addButton) {
      addButton.addEventListener("click", () => {
        form.reset();

        modal.classList.add("active");
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        modal.classList.remove("active");
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const editing = document.getElementById("editingUserId").value;
      if (editing) {
        this.updateUser(editing);
      } else {
        this.createUser();
      }
    });
  },

  async loadUsers() {
    const tbody = document.getElementById("usersTable");

    if (!tbody) return;

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/users");

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const users = await response.json();

      if (users.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center">
                        No users found.
                    </td>
                </tr>
            `;
        return;
      }

      tbody.innerHTML = users
        .map(
          (user) => `
                    <tr>
                        <td>${user.fullname}</td>
                        <td>${user.email}</td>
                        <td>${user.phone || ""}</td>
                        <td>${user.role}</td>
                        <td>${user.status || "Active"}</td>
                        <td>
                            <button
                                class="btn-edit"
                                onclick="Admin.editUser(${user.id})">
                                Edit
                            </button>

                            <button
                                class="btn-delete"
                                onclick="Admin.deleteUser(${user.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `,
        )
        .join("");
    } catch (error) {
      console.error("Failed to load users:", error);

      tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center">
                    Failed to load users.
                </td>
            </tr>
        `;
    }
  },

  async createUser() {
    const fullname = document.getElementById("userFullname").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const password = document.getElementById("userPassword").value;
    const confirm = document.getElementById("confirmUserPassword").value;
    const role = document.getElementById("userRole").value;
    const status = document.getElementById("userStatus").value;

    if (password !== confirm) {
      Notification.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          email,
          phone,
          password,
          role,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create user");
      }

      Notification.success("User created successfully.");

      document.getElementById("userModal").classList.remove("active");
      document.getElementById("editingUserId").value = "";
      document.getElementById("userForm").reset();

      this.loadUsers();
    } catch (error) {
      console.error(error);
      Notification.error(error.message || "Failed to create user.");
    }
  },

  async updateUser(id) {
    const fullname = document.getElementById("userFullname").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const password = document.getElementById("userPassword").value;
    const confirm = document.getElementById("confirmUserPassword").value;
    const role = document.getElementById("userRole").value;
    const status = document.getElementById("userStatus").value;

    if (password !== confirm) {
      Notification.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          email,
          phone,
          password,
          role,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user");
      }

      Notification.success("User updated successfully.");

      document.getElementById("editingUserId").value = "";
      document.getElementById("userForm").reset();
      document.getElementById("userModal").classList.remove("active");

      this.loadUsers();
    } catch (error) {
      console.error(error);
      Notification.error(error.message || "Failed to update user.");
    }
  },

  /* ==========================================
  BENEFICIARIES
  ========================================== */

  async loadBeneficiaries() {
    const tbody = document.getElementById("beneficiaryTable");

    if (!tbody) return;

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/trackers");

      if (!response.ok) {
        throw new Error("Failed to load beneficiaries");
      }

      const data = await response.json();

      if (data.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No beneficiaries found.
                    </td>
                </tr>
            `;
        return;
      }

      tbody.innerHTML = data
        .map(
          (person) => `
                <tr>
                    <td>${person.name}</td>
                    <td>${person.employment}</td>
                    <td>$${person.previousIncome}</td>
                    <td>$${person.currentIncome}</td>
                    <td>${person.businessStarted}</td>
                    <td>
                        <div class="action-buttons">
                            <button
                                class="btn-edit"
                                onclick="Admin.editBeneficiary(${person.id})">
                                Edit
                            </button>

                            <button
                                class="btn-delete"
                                onclick="Admin.deleteBeneficiary(${person.id})">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `,
        )
        .join("");
    } catch (error) {
      console.error("Failed to load beneficiaries:", error);

      tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load beneficiaries.
                </td>
            </tr>
        `;
    }
  },

  /* ==========================================
  LOANS
  ========================================== */

  async loadLoans() {
    const tbody = document.getElementById("loanTable");

    if (!tbody) return;

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/loans");

      if (!response.ok) {
        throw new Error("Failed to load loans");
      }

      const loans = await response.json();

      if (loans.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No loan applications found.
                    </td>
                </tr>
            `;
        return;
      }

      tbody.innerHTML = loans
        .map(
          (loan) => `
                    <tr>
                        <td>${loan.name}</td>
                        <td>${loan.category}</td>
                        <td>$${Number(loan.amount).toFixed(2)}</td>
                        <td>
                            <span class="badge ${this.badge(loan.status)}">
                                ${loan.status}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">

                                <button
                                    class="btn-edit"
                                    onclick="Admin.editLoan(${loan.id})">
                                    Edit
                                </button>

                                <button
                                    class="btn-approve"
                                    onclick="Admin.approveLoan(${loan.id})">
                                    Approve
                                </button>

                                <button
                                    class="btn-reject"
                                    onclick="Admin.rejectLoan(${loan.id})">
                                    Reject
                                </button>

                                <button
                                    class="btn-delete"
                                    onclick="Admin.deleteLoan(${loan.id})">
                                    Delete
                                </button>

                            </div>
                        </td>
                    </tr>
                `,
        )
        .join("");
    } catch (error) {
      console.error("Failed to load loans:", error);

      tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load loans.
                </td>
            </tr>
        `;
    }
  },

  /* ==========================================
  PROJECTS
  ========================================== */
  async loadProjects() {
    const tbody = document.getElementById("projectTable");

    if (!tbody) return;

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/projects");

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const projects = await response.json();

      if (projects.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        No projects found.
                    </td>
                </tr>
            `;

        return;
      }

      tbody.innerHTML = projects
        .map(
          (project) => `
                    <tr>

                        <td>${project.name}</td>

                        <td>
                            <span class="badge ${this.badge(project.status)}">
                                ${project.status}
                            </span>
                        </td>

                        <td>${project.progress}%</td>

                        <td>
                            <div class="action-buttons">

                                <button
                                    class="btn-edit"
                                    onclick="Admin.editProject(${project.id})">
                                    Edit
                                </button>

                                <button
                                    class="btn-delete"
                                    onclick="Admin.deleteProject(${project.id})">
                                    Delete
                                </button>

                            </div>
                        </td>

                    </tr>
                `,
        )
        .join("");
    } catch (error) {
      console.error("Failed to load projects:", error);

      tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    Failed to load projects.
                </td>
            </tr>
        `;
    }
  },

  /* ==========================================
  TRAININGS
  ========================================== */
  async loadTrainings() {
    const tbody = document.getElementById("trainingTable");
    if (!tbody) return;

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/trainings");

      if (!response.ok) {
        throw new Error("Failed to load trainings");
      }

      const trainings = await response.json();

      if (trainings.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        No training records found.
                    </td>
                </tr>
            `;
        return;
      }

      tbody.innerHTML = trainings
        .map(
          (training) => `
                    <tr>
                        <td>${training.course}</td>

                        <td>
                            <span class="badge ${this.badge(training.status)}">
                                ${training.status}
                            </span>
                        </td>

                        <td>${training.enrolledAt}</td>

                        <td>
                            <div class="action-buttons">
                                <button
                                    class="btn-edit"
                                    onclick="Admin.editTraining(${training.id})">
                                    Edit
                                </button>

                                <button
                                    class="btn-delete"
                                    onclick="Admin.deleteTraining(${training.id})">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `,
        )
        .join("");
    } catch (error) {
      console.error("Failed to load trainings:", error);

      tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    Failed to load trainings.
                </td>
            </tr>
        `;
    }
  },

  /* ==========================================
  DELETE BENEFICIARY
  ========================================== */
  async deleteBeneficiary(id) {
    if (!confirm("Delete this beneficiary?")) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/trackers/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete beneficiary");
      }

      Notification.success("Beneficiary deleted.");
      this.refresh();
    } catch (error) {
      console.error(error);
      Notification.error("Failed to delete beneficiary.");
    }
  },

  /* ==========================================
   EDIT BENEFICIARY
    ========================================== */
  async editBeneficiary(id) {
    const name = prompt("Beneficiary Name:");
    if (name === null) return;

    const employment = prompt("Employment Status:");
    if (employment === null) return;

    const previousIncome = prompt("Previous Income:");
    if (previousIncome === null) return;

    const currentIncome = prompt("Current Income:");
    if (currentIncome === null) return;

    const businessStarted = prompt("Business Started:");
    if (businessStarted === null) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/trackers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          employment,
          previousIncome: Number(previousIncome),
          currentIncome: Number(currentIncome),
          businessStarted,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update beneficiary");
      }

      Notification.success("Beneficiary updated.");
      this.refresh();
    } catch (error) {
      console.error(error);
      Notification.error("Failed to update beneficiary.");
    }
  },

  /* ==========================================
  DELETE LOAN
  ========================================== */
  deleteLoan(id) {
    if (!confirm("Delete this loan application?")) return;
    let loans = Database.load(Database.keys.loans) || [];
    loans = loans.filter((loan) => loan.id !== id);
    Database.save(Database.keys.loans, loans);
    Notification.success("Loan deleted.");
    this.refresh();
  },

  /* ==========================================
 EDIT LOAN
 ========================================== */
  editLoan(id) {
    const loans = Database.load(Database.keys.loans) || [];
    const loan = loans.find((item) => item.id === id);
    if (!loan) return;
    const category = prompt("Loan Category:", loan.category);
    if (category === null) return;
    const amount = prompt("Loan Amount:", loan.amount);
    if (amount === null) return;
    const reason = prompt("Loan Reason:", loan.reason);
    if (reason === null) return;
    const status = prompt("Loan Status:", loan.status);
    if (status === null) return;
    loan.category = category;
    loan.amount = Number(amount);
    loan.reason = reason;
    loan.status = status;
    Database.save(Database.keys.loans, loans);
    Notification.success("Loan updated.");
    this.refresh();
  },

  /* ==========================================
  DELETE PROJECT
  ========================================== */
  async deleteLoan(id) {
    if (!confirm("Delete this loan application?")) return;
    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/loans/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete loan");
      }
      Notification.success("Loan deleted.");
      this.refresh();
    } catch (error) {
      console.error("Failed to delete loan:", error);
      Notification.error("Failed to delete loan.");
    }
  },

  /* ==========================================
  EDIT PROJECT
  ========================================== */
  async editLoan(id) {
    const category = prompt("Loan Category:");
    if (category === null) return;

    const amount = prompt("Loan Amount:");
    if (amount === null) return;

    const reason = prompt("Loan Reason:");
    if (reason === null) return;

    const status = prompt("Loan Status:");
    if (status === null) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/loans/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          amount: Number(amount),
          reason,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update loan");
      }

      Notification.success("Loan updated.");
      this.refresh();
    } catch (error) {
      console.error("Failed to update loan:", error);
      Notification.error("Failed to update loan.");
    }
  },

  /* ==========================================
   DELETE PROJECT
========================================== */

  async deleteProject(id) {
    if (!confirm("Delete this project?")) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/projects/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete project");
      }

      Notification.success("Project deleted.");

      this.refresh();
    } catch (error) {
      console.error("Failed to delete project:", error);

      Notification.error("Failed to delete project.");
    }
  },

  /* ==========================================
   EDIT PROJECT
========================================== */

  async editProject(id) {
    const name = prompt("Project Name:");
    if (name === null) return;

    const description = prompt("Project Description:");
    if (description === null) return;

    const progress = prompt("Project Progress (%):");
    if (progress === null) return;

    const status = prompt("Project Status:");
    if (status === null) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/projects/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          description,
          progress: Number(progress),
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update project");
      }

      Notification.success("Project updated.");

      this.refresh();
    } catch (error) {
      console.error("Failed to update project:", error);

      Notification.error("Failed to update project.");
    }
  },

  /* ==========================================
  DELETE TRAINING
  ========================================== */
  async deleteTraining(id) {
    if (!confirm("Delete this training record?")) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/trainings/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete training");
      }

      Notification.success("Training deleted.");
      this.refresh();
    } catch (error) {
      console.error("Failed to delete training:", error);
      Notification.error("Failed to delete training.");
    }
  },

  /* ==========================================
 EDIT TRAINING
 ========================================== */
  async editTraining(id) {
    const course = prompt("Course Name:");
    if (course === null) return;

    const description = prompt("Training Description:");
    if (description === null) return;

    const status = prompt("Training Status:");
    if (status === null) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/trainings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          description,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update training");
      }

      Notification.success("Training updated.");
      this.refresh();
    } catch (error) {
      console.error("Failed to update training:", error);
      Notification.error("Failed to update training.");
    }
  },

  /* ==========================================
  APPROVE LOAN
  ========================================== */
  async approveLoan(id) {
    if (!confirm("Approve this loan application?")) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/loans/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Approved",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to approve loan");
      }

      Notification.success("Loan approved.");
      this.refresh();
    } catch (error) {
      console.error("Failed to approve loan:", error);
      Notification.error("Failed to approve loan.");
    }
  },

  /* ==========================================
  REJECT LOAN
  ========================================== */
  async rejectLoan(id) {
    if (!confirm("Reject this loan application?")) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/loans/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Rejected",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reject loan");
      }

      Notification.success("Loan rejected.");
      this.refresh();
    } catch (error) {
      console.error("Failed to reject loan:", error);
      Notification.error("Failed to reject loan.");
    }
  },

  /* ==========================================
  REFRESH
  ========================================== */

  refresh() {
    this.loadStatistics();
    this.loadBeneficiaries();
    this.loadLoans();
    this.loadProjects();
    this.loadTrainings();
    this.loadNotifications();
  },

  /* ==========================================
  BUTTONS
  ========================================== */

  initializeButtons() {
    const clear = document.getElementById("clearDatabase");
    const csv = document.getElementById("exportCSV");
    const json = document.getElementById("exportJSON");
    const restore = document.getElementById("restoreDatabase");
    if (csv) {
      csv.addEventListener("click", () => this.exportCSV());
    }

    if (json) {
      json.addEventListener("click", () => this.exportJSON());
    }

    if (restore) {
      restore.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
          this.restoreJSON(e.target.files[0]);
        };
        input.click();
      });
    }

    if (clear) {
      clear.addEventListener("click", () => {
        if (!confirm("Clear entire database?")) return;
        Database.clear();
        Notification.warning("Database cleared.");
        location.reload();
      });
    }
  },

  /* ==========================================
  NOTIFICATIONS
  ========================================== */

  async loadNotifications() {
    const container = document.getElementById("notificationList");

    if (!container) return;

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/notifications");

      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }

      const notifications = await response.json();

      if (notifications.length === 0) {
        container.innerHTML = `
                <p>No notifications available.</p>
            `;
        return;
      }

      container.innerHTML = notifications
        .map(
          (item) => `
                    <div class="notification-item">
                        <h4>${item.title || "System Notification"}</h4>
                        <p>${item.message || ""}</p>
                    </div>
                `,
        )
        .join("");
    } catch (error) {
      console.error("Failed to load notifications:", error);

      container.innerHTML = `
            <p>Failed to load notifications.</p>
        `;
    }
  },

  /* ==========================================
  SEARCH
  ========================================== */

  initializeSearch() {
    this.search("beneficiarySearch", "#beneficiaryTable tr");
    this.search("loanSearch", "#loanTable tr");
    this.search("projectSearch", "#projectTable tr");
    this.search("trainingSearch", "#trainingTable tr");
  },

  search(inputId, rows) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener("keyup", function () {
      const value = this.value.toLowerCase();
      document.querySelectorAll(rows).forEach((row) => {
        row.style.display = row.innerText.toLowerCase().includes(value)
          ? ""
          : "none";
      });
    });
  },

  /* ==========================================
  BADGE COLOR
  ========================================== */

  badge(status) {
    switch (status) {
      case "Approved":
        return "badge-active";
      case "Rejected":
        return "badge-rejected";
      case "Completed":
        return "badge-completed";
      default:
        return "badge-pending";
    }
  },

  /* ==========================================
EXPORT CSV
========================================== */
  async exportCSV() {
    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/reports/export-data");

      if (!response.ok) {
        throw new Error("Failed to export CSV data");
      }

      const data = await response.json();

      let csv = "";

      Object.keys(data).forEach((section) => {
        csv += section.toUpperCase() + "\n";

        if (!data[section] || data[section].length === 0) {
          csv += "No Records\n\n";
          return;
        }

        const headers = Object.keys(data[section][0]);
        csv += headers.join(",") + "\n";

        data[section].forEach((record) => {
          csv +=
            headers
              .map(
                (header) =>
                  `"${String(record[header] ?? "").replace(/"/g, '""')}"`,
              )
              .join(",") + "\n";
        });

        csv += "\n";
      });

      const blob = new Blob([csv], {
        type: "text/csv",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "allcare_database.csv";
      link.click();

      URL.revokeObjectURL(link.href);

      Notification.success("CSV exported.");
    } catch (error) {
      console.error(error);
      Notification.error("Failed to export CSV.");
    }
  },

  /* ==========================================
EXPORT JSON
========================================== */
  async exportJSON() {
    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/reports/backup");

      if (!response.ok) {
        throw new Error("Failed to create backup");
      }

      const backup = await response.json();

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "allcare_backup.json";
      link.click();

      URL.revokeObjectURL(link.href);

      Notification.success("Backup created.");
    } catch (error) {
      console.error(error);
      Notification.error("Failed to create backup.");
    }
  },

  /* ==========================================
RESTORE JSON
========================================== */
  restoreJSON(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);

        const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/reports/restore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to restore database");
        }

        Notification.success("Database restored.");
        this.refresh();
      } catch (error) {
        console.error(error);
        Notification.error("Failed to restore database.");
      }
    };

    reader.readAsText(file);
  },

  async editUser(id) {
    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/users`);

      if (!response.ok) {
        throw new Error("Failed to load user");
      }

      const users = await response.json();
      const user = users.find((u) => String(u.id) === String(id));

      if (!user) {
        Notification.error("User not found.");
        return;
      }

      document.getElementById("editingUserId").value = user.id;
      document.getElementById("userFullname").value = user.fullname || "";
      document.getElementById("userEmail").value = user.email || "";
      document.getElementById("userPhone").value = user.phone || "";
      document.getElementById("userRole").value = user.role || "";
      document.getElementById("userStatus").value = user.status || "";
      document.getElementById("userPassword").value = "";
      document.getElementById("confirmUserPassword").value = "";

      document.getElementById("userModal").classList.add("active");
    } catch (error) {
      console.error(error);
      Notification.error("Failed to load user.");
    }
  },

  async deleteUser(id) {
    const confirmDelete = confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://allcare-natan-production-72e6.up.railway.app/users/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      Notification.success("User deleted successfully.");

      this.loadUsers();
    } catch (error) {
      console.error(error);
      Notification.error(error.message || "Failed to delete user.");
    }
  },

  loadAdministrator() {
    const user = sessionStorage.getItem("allcare_user");

    if (!user) return;

    try {
      const admin = JSON.parse(user);

      const fullname = admin.fullname || admin.full_name || "";

      const username = admin.username || "";

      const email = admin.email || "";

      const phone = admin.phone || "";

      const fullnameInput = document.getElementById("adminFullName");

      const usernameInput = document.getElementById("adminUsername");

      const emailInput = document.getElementById("adminEmail");

      const phoneInput = document.getElementById("adminPhone");

      if (fullnameInput) {
        fullnameInput.value = fullname;
      }

      if (usernameInput) {
        usernameInput.value = username;
      }

      if (emailInput) {
        emailInput.value = email;
      }

      if (phoneInput) {
        phoneInput.value = phone;
      }
    } catch (error) {
      console.error("Failed to load administrator:", error);
    }
  },
};

/*
==========================================
LOGOUT
==========================================
*/

const logoutButton = document.getElementById("logoutBtn");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("allcare_logged_in");
    sessionStorage.removeItem("allcare_user");
    sessionStorage.removeItem("allcare_role");

    Notification.success("Logged out successfully.");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 700);
  });
}

/*
==========================================
INITIALIZE ADMIN
==========================================
*/

Admin.initialize();
