//REQUIREMENTS FOR CURRENT MODULE
require("dotenv").config();
const Admin = require("../models/admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserCode = require("../models/submissions");
exports.adminsSignup = async (req, res) => {
  const { role, adminname, email, password } = req.body;

  try {
    // Check if username or email exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password and save new user
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALTROUNDS)
    );
    const newUser = new Admin({
      role,
      adminname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: `${adminname} registered successfully` });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// API: admin Login
exports.adminsLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET_TOKEN
    );

    res.json({
      message: `${admin.role}login successful`,
      adminname: admin.adminname,
      jwtToken: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// API: Get all submitted user codes (including usernames)
exports.seeCode = async (req, res) => {
  try {
    const userCodes = await UserCode.find()
      .sort({ submittedAt: -1 })
      .populate("username"); // Fetch all user codes
    res.json(userCodes);
  } catch (error) {
    console.error("Error fetching user codes:", error);
    res.status(500).json({ message: "Error fetching user codes" });
  }
};