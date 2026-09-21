/*
==========================================
ALLCARE LOAN MANAGEMENT
==========================================
*/

const Loan = {
  initialize() {
    const form = document.getElementById("loanForm");

    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submitLoan();
    });
  },

  async submitLoan() {
    const name = document.getElementById("loanName").value.trim();

    const email = document.getElementById("loanEmail").value.trim();

    const phone = document.getElementById("loanPhone").value.trim();

    const category = document.getElementById("loanCategory").value;

    const amount = Number(document.getElementById("loanAmount").value);

    const reason = document.getElementById("loanReason").value.trim();

    if (!name || !email || !phone || !category || !amount || !reason) {
      Notification.error("Please complete all fields.");
      return;
    }

    try {
      const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/loans", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone,
          category,
          amount,
          reason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit loan");
      }

      Notification.success("Loan application submitted successfully.");

      document.getElementById("loanForm").reset();

      if (typeof Dashboard !== "undefined") {
        Dashboard.refresh();
      }
    } catch (error) {
      console.error("Failed to submit loan:", error);

      Notification.error("Failed to submit loan.");
    }
  },
};

Loan.initialize();
