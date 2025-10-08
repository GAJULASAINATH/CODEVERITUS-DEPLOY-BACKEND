require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./dbConnections/db");
const usersRoute = require("./routes/usersRoutes");
const adminsRoute = require("./routes/adminsRoutes");
const jwtAuthenticator = require("./middleware/jwtAuthenticator");

const app = express();
app.use(express.json());
app.set("trust proxy", true);

// CORS: restrict to your frontend domain
app.use(
  cors({
    origin: (origin, cb) =>
      !origin || origin.startsWith("https://codeveritus.tech") // Production domain
        ? cb(null, true)
        : cb(new Error("CORS blocked")),
    credentials: true,
  })
);

// Test endpoint
app.get("/", (req, res) => res.send("✅ CODEVERITUS BACKEND (Docker container running)"));

// API routes
app.use("/api/users", usersRoute);
app.use("/api/admins", adminsRoute);
app.use("/api/admins/fetch", jwtAuthenticator, adminsRoute);

// Connect to DB
connectDB();

// Start HTTP server for backend container (nginx handles HTTPS)
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
