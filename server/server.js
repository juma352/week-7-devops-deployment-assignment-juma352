require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Root route to avoid 404 on localhost/
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Task Manager API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serve running on http://localhost:${PORT}`));
