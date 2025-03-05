const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");
const departmentRoutes = require("./routes/department");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Create connection string using environment variables
const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const database = process.env.MONGO_DB;

const MONGO_URI = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Add routes after middleware
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/departments", departmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
