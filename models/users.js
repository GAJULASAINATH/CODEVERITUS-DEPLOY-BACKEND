const mongoose = require("mongoose");
const { usersDB } = require("../dbConnections/db");

// User Schema
const usersSchema = new mongoose.Schema({
  role: { type: String, required: false, default: "user" }, // 'user' or 'admin'
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = usersDB.model("users", usersSchema);
