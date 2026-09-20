/*
==========================================
ALLCARE PROFESSIONAL NOTIFICATION SYSTEM
==========================================
*/

const Notification = {

    container: null,

    initialize() {

        if (this.container) return;

        this.container = document.createElement("div");
        this.container.id = "notificationContainer";

        document.body.appendChild(this.container);
    },

    show(message, type = "success") {

        this.initialize();

        const notification = document.createElement("div");

        notification.className = `notification notification-${type}`;

        notification.textContent = message;

        this.container.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add("show");
        });

        setTimeout(() => {

            notification.classList.remove("show");

            setTimeout(() => {
                notification.remove();
            }, 300);

        }, 4000);
    },

    success(message) {
        this.show(message, "success");
    },

    error(message) {
        this.show(message, "error");
    },

    warning(message) {
        this.show(message, "warning");
    },

    info(message) {
        this.show(message, "info");
    }
};

Notification.initialize();
