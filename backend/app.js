require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionRoute = require("./route/sessionRoute");
const classesRoute = require("./route/classRoute");
const subjectRoute = require("./route/subjectRoute");
const studentRoute = require("./route/studentRoute");
const teacherRoute = require("./route/teacherRoute");
const examRoute = require("./route/examRoute");
const marksheetRoute = require("./route/marksheetRoute");
const feesRoute = require("./route/feesRoute");
const eventRoute = require("./route/eventRoute");
const userRoute = require("./route/userRoute");
const settingsRoute = require("./route/settingRoute");

app.get("/", (req, res) => {
  res.send("School Management System");
});

app.use("/api/sessions", sessionRoute);
app.use("/api/classes", classesRoute);
app.use("/api/subjects", subjectRoute);
app.use("/api/students", studentRoute);
app.use("/api/teachers", teacherRoute);
app.use("/api/exams", examRoute);
app.use("/api/events", eventRoute);
app.use("/api/marksheets", marksheetRoute);
app.use("/api/fees", feesRoute);
app.use("/api/user", userRoute);
app.use("/api/usersettings", settingsRoute);

module.exports = app;
