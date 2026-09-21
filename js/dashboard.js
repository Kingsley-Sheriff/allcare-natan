
async function loadDashboardStats() {
    try {
        const response = await fetch("https://allcare-natan-production-72e6.up.railway.app/dashboard/stats");
        const stats = await response.json();
        document.getElementById("adminBeneficiaries").textContent = stats.beneficiaries;
        document.getElementById("adminLoans").textContent = stats.loans;
        document.getElementById("adminProjects").textContent = stats.projects;
        document.getElementById("adminTrainings").textContent = stats.trainings;
        document.getElementById("adminReports").textContent = stats.reports;
        document.getElementById("adminNotifications").textContent = stats.notifications;
    } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
    }
}

loadDashboardStats();
