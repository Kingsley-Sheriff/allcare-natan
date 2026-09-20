
/*
==========================================
ALLCARE AUTH GUARD
==========================================
*/

const Auth = {

    requireLogin() {

        const loggedIn =
            sessionStorage.getItem("allcare_logged_in");

        if (loggedIn !== "true") {

            window.location.href = "login.html";

        }

    },

    requireAdmin() {

        this.requireLogin();

        const role =
            sessionStorage.getItem("allcare_role");

        if (role !== "Administrator") {

            Notification.error(
                "Access denied."
            );

            setTimeout(() => {

                window.location.href = "index.html";

            },1000);

        }

    },

    logout() {
        sessionStorage.removeItem(
            "allcare_logged_in"
        );
        sessionStorage.removeItem(
            "allcare_user"
        );
        sessionStorage.removeItem(
            "allcare_role"
        );
        window.location.href =
            "login.html";

    }

};
