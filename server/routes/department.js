const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Department = require("../models/Department");
const User = require("../models/User");

// Create Department (Manager only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "manager")
    return res.status(403).json({ msg: "Access denied" });
  const { departmentName, categoryName, location, salary, employeeIds } =
    req.body;
  try {
    const department = new Department({
      departmentName,
      categoryName,
      location,
      salary,
      employeeIds,
      createdBy: req.user.id,
    });
    await department.save();
    await User.updateMany(
      { _id: { $in: employeeIds } },
      { departmentId: department._id }
    );
    res.json(department);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get Departments (Pagination for Manager)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "manager")
    return res.status(403).json({ msg: "Access denied" });
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  try {
    const departments = await Department.find({ createdBy: req.user.id })
      .populate("employeeIds", "firstName lastName")
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Department.countDocuments({ createdBy: req.user.id });
    res.json({ departments, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update Department (Manager only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ msg: "Access denied" });
  }

  try {
    const department = await Department.findById(req.params.id);
    if (!department || department.createdBy.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ msg: "Department not found or unauthorized" });
    }

    const previousEmployeeIds = department.employeeIds.map((id) =>
      id.toString()
    );
    Object.assign(department, req.body);
    await department.save();

    const newEmployeeIds = req.body.employeeIds || [];
    const removedEmployeeIds = previousEmployeeIds.filter(
      (id) => !newEmployeeIds.includes(id)
    );
    const addedEmployeeIds = newEmployeeIds.filter(
      (id) => !previousEmployeeIds.includes(id)
    );

    // Update all users based on current departmentId
    await User.updateMany(
      { _id: { $in: removedEmployeeIds }, departmentId: req.params.id },
      { $unset: { departmentId: "" } }
    );
    await User.updateMany(
      { _id: { $in: addedEmployeeIds } },
      { $set: { departmentId: department._id } }
    );

    res.json(department);
  } catch (err) {
    console.error("Error updating department:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "manager")
    return res.status(403).json({ msg: "Access denied" });
  try {
    console.log("Deleting department with ID:", req.params.id);
    const department = await Department.findById(req.params.id);
    if (!department || department.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Department not found" });
    }

    await department.deleteOne();
    await User.updateMany(
      { departmentId: req.params.id },
      { $unset: { departmentId: "" } }
    );
    console.log("Department deleted and users updated");

    res.json({ msg: "Department deleted" });
  } catch (err) {
    console.error("Error deleting department:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
