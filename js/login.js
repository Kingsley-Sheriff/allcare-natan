/*
==========================================
ALLCARE LOGIN
==========================================
*/

const Login = {

    initialize() {

        const form = document.getElementById("loginForm");

        if (form) {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                this.login();
            });
        }

        const toggle = document.getElementById("togglePassword");

        if (toggle) {
            toggle.addEventListener("click", () => {
                this.togglePassword();
            });
        }

        this.loadRemembered();
    },


    async login() {

        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");
        const rememberInput = document.getElementById("rememberMe");

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const remember = rememberInput.checked;


        /* ==========================================
           EMAIL VALIDATION
           ========================================== */

        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

        if (!email) {
            Notification.error("Please enter your email address.");
            emailInput.focus();
            return;
        }

        if (!emailPattern.test(email)) {
            Notification.error("Please enter a valid email address.");
            emailInput.focus();
            return;
        }


        /* ==========================================
           PASSWORD VALIDATION
           ========================================== */

        if (!password) {
            Notification.error("Please enter your password.");
            passwordInput.focus();
            return;
        }

        if (password.length > 128) {
            Notification.error("Password is too long.");
            passwordInput.focus();
            return;
        }


        /* ==========================================
           LOGIN REQUEST
           ========================================== */

        try {

            const response = await fetch(
                "https://allcare-natan-production-72e6.up.railway.app/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok || !data.success) {
                Notification.error(
                    data.message || "Invalid email or password."
                );
                return;
            }


            /* ==========================================
               CREATE SESSION
               ========================================== */

            sessionStorage.setItem(
                "allcare_logged_in",
                "true"
            );

            sessionStorage.setItem(
                "allcare_user",
                JSON.stringify(data.user)
            );

            sessionStorage.setItem(
                "allcare_role",
                data.user.role
            );


            /* ==========================================
               REMEMBER EMAIL
               ========================================== */

            if (remember) {

                localStorage.setItem(
                    "allcare_remember_email",
                    email
                );

            } else {

                localStorage.removeItem(
                    "allcare_remember_email"
                );
            }


            /* ==========================================
               SUCCESS NOTIFICATION
               ========================================== */

            Notification.success(
                "Welcome back " + data.user.full_name
            );


            /* ==========================================
               REDIRECT
               ========================================== */

            setTimeout(() => {

                if (data.user.role === "Administrator") {

                    window.location.href = "admin.html";

                } else {

                    window.location.href = "index.html";

                }

            }, 800);

        }

        catch (error) {

            console.error("Login error:", error);

            Notification.error(
                "Unable to connect to the server."
            );
        }
    },


    /* ==========================================
       PASSWORD VISIBILITY
       ========================================== */

    togglePassword() {

        const password =
            document.getElementById("loginPassword");

        const button =
            document.getElementById("togglePassword");

        if (password.type === "password") {

            password.type = "text";
            button.textContent = "Hide";

        } else {

            password.type = "password";
            button.textContent = "Show";
        }
    },


    /* ==========================================
       REMEMBERED EMAIL
       ========================================== */

    loadRemembered() {

        const email =
            localStorage.getItem("allcare_remember_email");

        if (!email) return;

        document.getElementById("loginEmail").value = email;

        document.getElementById("rememberMe").checked = true;
    }
};


Login.initialize();
