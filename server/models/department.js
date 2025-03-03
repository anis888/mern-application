const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  categoryName: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  employeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Department", departmentSchema);
