/*
==========================================
ALLCARE TRAINING MANAGEMENT
==========================================
*/
const Training = {
  initialize() {
    const buttons = document.querySelectorAll(".enroll-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.enroll(button.dataset.course);
      });
    });
  },
  async enroll(course) {
    try {
      const response = await fetch("http://localhost:3000/trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          description: "",
          status: "Enrolled",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to enroll");
      }

      Notification.success(course + " enrolled successfully.");

      if (typeof Dashboard !== "undefined") {
        Dashboard.refresh();
      }
    } catch (error) {
      console.error("Failed to enroll:", error);
      Notification.error("Failed to enroll.");
    }
  },
};
Training.initialize();
