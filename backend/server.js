
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const userRoutes = require("./routes/userRoutes");
const signupRoutes = require("./routes/signupRoutes");
const loginRoutes = require("./routes/loginRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const trackerRoutes = require("./routes/trackerRoutes");
const loanRoutes = require("./routes/loanRoutes");
const donationRoutes =require("./routes/donationRoutes");
const projectRoutes = require("./routes/projectRoutes");
const trainingRoutes = require("./routes/trainingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const app = express();

app.use(cors());
app.use(express.json({
    verify: (req, res, buffer) => {
        req.rawBody = buffer;
    }
}));
app.use("/users", userRoutes);
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/loans", loanRoutes);
app.use("/donations", donationRoutes);
app.use("/projects", projectRoutes);
app.use("/reports", reportsRoutes);
app.use("/trainings", trainingRoutes);
app.use("/notifications", notificationRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/trackers", trackerRoutes);
app.get("/", (req, res) => {
    res.send("AllCare Backend is Running!");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
