// /server/routes/employee.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Department = require("../models/Department");

// Get current user's data (employee or manager)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    const department = user.departmentId
      ? await Department.findById(user.departmentId)
      : null;
    res.json({ user, department });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all employees (manager-only)
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ msg: "Access denied: Managers only" });
  }
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
