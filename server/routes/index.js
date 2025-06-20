const express = require("express");

const app = express();

app.use("/auth", require("./authRoutes"));
app.use("/candidate", require("./candidateRoutes"));
app.use("/leave", require("./leaveRoutes"));

module.exports = app;