const mongoose = require("mongoose");
const { submissionsDB } = require("../dbConnections/db");

const UserCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: false },
  username: { type: String, required: true },
  codes: {
    type: [String], // Array of strings to store code snippets
    default: [],
  },
  detectionResult: {
    type: mongoose.Schema.Types.Mixed, // Accepts any JSON (object, array, etc.)
    default: {},
  },
  submittedAt: {
    type: String,
    default: Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  }
});

module.exports = submissionsDB.model("submissions", UserCodeSchema);
