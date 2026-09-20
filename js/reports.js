document.querySelectorAll(".report-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const type = button.dataset.report;

    try {
      button.disabled = true;

      button.textContent = "Generating...";

      const response = await fetch(`http://localhost:3000/reports/${type}`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate report.");
      }

      const blob = new Blob([result.content], {
        type: "text/plain",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${result.title}.txt`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      Notification.success("Report generated successfully.");
    } catch (error) {
      console.error("Report generation error:", error);

      Notification.error(error.message || "Failed to generate report.");
    } finally {
      button.disabled = false;

      button.textContent = "Download Report";
    }
  });
});
