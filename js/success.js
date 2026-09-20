/*
==========================================
ALLCARE SUCCESS PAGE
==========================================
*/

const Success = {
  initialize() {
    this.loadDonation();

    this.initializeButtons();
  },

  loadDonation() {
    const donation = JSON.parse(sessionStorage.getItem("latestDonation"));

    if (!donation) {
      window.location.href = "index.html";

      return;
    }

    document.getElementById("receiptReference").textContent =
      donation.reference_no || "-";

    document.getElementById("receiptName").textContent =
      donation.donor_name || "Anonymous Donor";

    document.getElementById("receiptAmount").textContent =
      `GHS ${Number(donation.amount || 0).toFixed(2)}`;

    document.getElementById("receiptType").textContent =
      donation.donation_type || "One-Time";

    document.getElementById("receiptPayment").textContent =
      donation.payment_method || "Mobile Money";

    document.getElementById("receiptDate").textContent =
      donation.donated_at || new Date().toLocaleString();
  },

  initializeButtons() {
    document.getElementById("printReceipt").addEventListener("click", () => {
      window.print();
    });

    document.getElementById("donateAgain").addEventListener("click", () => {
      window.location.href = "donation.html";
    });

    document.getElementById("returnHome").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  },
};

Success.initialize();
