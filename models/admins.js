const mongoose = require("mongoose");
const { adminsDB } = require("../dbConnections/db");

// User Schema
const adminsSchema = new mongoose.Schema({
  role: { type: String, required: false, default: "admin" }, // 'user' or 'admin'
  adminname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = adminsDB.model("admins", adminsSchema);
