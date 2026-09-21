/*
==========================================
ALLCARE BENEFICIARY TRACKER
==========================================
*/

const Tracker = {

    initialize() {
        const form = document.getElementById("trackerForm");

        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.saveRecord();
        });

        this.renderRecords();
    },


    async saveRecord() {

        const nameInput = document.getElementById("trackerName");
        const employmentInput = document.getElementById("employmentStatus");
        const previousIncomeInput = document.getElementById("previousIncome");
        const currentIncomeInput = document.getElementById("currentIncome");
        const businessStartedInput = document.getElementById("businessStarted");

        const name = nameInput.value.trim();
        const employment = employmentInput.value.trim();
        const previousIncome = previousIncomeInput.value.trim();
        const currentIncome = currentIncomeInput.value.trim();
        const businessStarted = businessStartedInput.value.trim();


        // ==============================
        // NAME VALIDATION
        // ==============================

        const namePattern =
            /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

        if (!name) {
            Notification.error("Please enter the beneficiary's full name.");
            nameInput.focus();
            return;
        }

        if (name.length < 2 || name.length > 100) {
            Notification.error("Name must be between 2 and 100 characters.");
            nameInput.focus();
            return;
        }

        if (!namePattern.test(name)) {
            Notification.error(
                "Name can only contain letters, spaces, hyphens and apostrophes."
            );
            nameInput.focus();
            return;
        }


        // ==============================
        // EMPLOYMENT VALIDATION
        // ==============================

        if (!employment) {
            Notification.error("Please select an employment status.");
            employmentInput.focus();
            return;
        }


        // ==============================
        // PREVIOUS INCOME VALIDATION
        // ==============================

        if (previousIncome === "") {
            Notification.error("Please enter the previous income.");
            previousIncomeInput.focus();
            return;
        }

        const previousIncomeNumber = Number(previousIncome);

        if (
            !Number.isFinite(previousIncomeNumber) ||
            previousIncomeNumber < 0
        ) {
            Notification.error(
                "Previous income must be a valid non-negative number."
            );
            previousIncomeInput.focus();
            return;
        }


        // ==============================
        // CURRENT INCOME VALIDATION
        // ==============================

        if (currentIncome === "") {
            Notification.error("Please enter the current income.");
            currentIncomeInput.focus();
            return;
        }

        const currentIncomeNumber = Number(currentIncome);

        if (
            !Number.isFinite(currentIncomeNumber) ||
            currentIncomeNumber < 0
        ) {
            Notification.error(
                "Current income must be a valid non-negative number."
            );
            currentIncomeInput.focus();
            return;
        }


        // ==============================
        // BUSINESS STATUS VALIDATION
        // ==============================

        if (!businessStarted) {
            Notification.error(
                "Please select whether the beneficiary started a business."
            );
            businessStartedInput.focus();
            return;
        }


        // ==============================
        // SEND TO SERVER
        // ==============================

        try {

            const response = await fetch(
                "https://allcare-natan-production-72e6.up.railway.app/trackers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        employment,
                        previousIncome: previousIncomeNumber,
                        currentIncome: currentIncomeNumber,
                        businessStarted
                    })
                }
            );


            const result = await response.json();


            if (!response.ok) {
                Notification.error(
                    result.message || "Failed to save beneficiary."
                );
                return;
            }


            Notification.success(
                "Beneficiary progress saved successfully."
            );


            document.getElementById("trackerForm").reset();

            this.renderRecords();


            if (typeof Dashboard !== "undefined") {
                Dashboard.refresh();
            }


        } catch (error) {

            console.error("Failed to save beneficiary:", error);

            Notification.error(
                "Unable to connect to the server. Please try again."
            );
        }
    },


    async renderRecords() {

        const container = document.getElementById("trackerList");

        if (!container) return;


        try {

            const response = await fetch(
                "https://allcare-natan-production-72e6.up.railway.app/trackers"
            );


            if (!response.ok) {
                throw new Error("Failed to load beneficiaries");
            }


            const trackers = await response.json();


            if (trackers.length === 0) {

                container.innerHTML =
                    "<p>No beneficiary records yet.</p>";

                return;
            }


            container.innerHTML = trackers
                .map(
                    (record) => `
                        <div class="tracker-item">

                            <h4>${this.escapeHTML(record.name)}</h4>

                            <p>
                                Employment:
                                <strong>
                                    ${this.escapeHTML(record.employment)}
                                </strong>
                            </p>

                            <p>
                                Income:
                                $${Number(record.previousIncome).toFixed(2)}
                                →
                                $${Number(record.currentIncome).toFixed(2)}
                            </p>

                            <p>
                                Business Started:
                                <strong>
                                    ${this.escapeHTML(record.businessStarted)}
                                </strong>
                            </p>

                            <hr>

                        </div>
                    `
                )
                .join("");


        } catch (error) {

            console.error(
                "Failed to load beneficiaries:",
                error
            );

            container.innerHTML =
                "<p>Failed to load beneficiary records.</p>";
        }
    },


    // Prevent database content from becoming executable HTML
    escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};


Tracker.initialize();
