require("dotenv").config();
const axios = require("axios");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserCode = require("../models/submissions");
exports.usersSignup = async (req, res) => {
  const { role, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALTROUNDS)
    ); // FIX: `parseInt()`
    const newUser = new User({
      role,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: `${username} registered successfully` });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.usersLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); // FIX: `User` variable case
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_TOKEN
    );

    res.json({
      message: `${user.role} login successful`,
      username: user.username,
      jwtToken: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// API: Submit or update user codes
// exports.codeSubmit = async (req, res) => {
//   try {
//     const { username, code_samples } = req.body;

//     if (!username || !code_samples || !code_samples.length) {
//       return res
//         .status(400)
//         .json({ message: "username and code_samples are required." });
//     }

//     // Call external detection API
//     const detectionResponse = await axios.post(process.env.CORE_API, {
//       code_samples: code_samples,
//     });

//     const { data } = detectionResponse; // Extract response data
//     console.log(data);
//     // Update user code with submission and detection result
//     const updatedCode = await UserCode.findOneAndUpdate(
//       { username: username },
//       {
//         codes: code_samples,
//         detectionResult: data, // Store the external API response
//         submittedAt: new Date().toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//       },
//       { upsert: true, new: true, strict: true }
//     );

//     res.status(201).json({
//       message: "User codes saved successfully!",
//       detectionResult: data,
//     });
//   } catch (error) {
//     console.error("Error in code submission:", error);
//     res.status(500).json({ message: "Error saving user codes" });
//   }
// };
exports.codeSubmit = async (req, res) => {
  try {
    const { username, code_samples } = req.body;

    if (!username || !code_samples || !code_samples.length) {
      return res
        .status(400)
        .json({ message: "username and code_samples are required." });
    }

    // Fetch the userId from the User model
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Ensure userId is defined
    const userId = user._id;

    // Call external detection API
    const detectionResponse = await axios.post(process.env.CORE_API, {
      code_samples: code_samples,
    });

    const { data } = detectionResponse;
    console.log(data);

    // Update or insert user code submission
    const updatedCode = await UserCode.findOneAndUpdate(
      { userId: userId }, // Use userId instead of username
      {
        username,
        codes: code_samples,
        detectionResult: data,
        submittedAt: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "User codes saved successfully!",
      detectionResult: data,
    });
  } catch (error) {
    console.error("Error in code submission:", error);
    res.status(500).json({ message: "Error saving user codes" });
  }
};
