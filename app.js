require("dotenv").config();
const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const cors = require("cors");
const chokidar = require("chokidar");

const { connectDB } = require("./dbConnections/db");
const usersRoute = require("./routes/usersRoutes");
const adminsRoute = require("./routes/adminsRoutes");
const jwtAuthenticator = require("./middleware/jwtAuthenticator");

const app = express();
app.use(express.json());
app.set("trust proxy", true);

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || origin.startsWith("https://codeveritus.tech")
        ? cb(null, true)
        : cb(new Error("CORS blocked")),
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("✅ CODEVERITUS BACKEND (HTTPS active)"));

app.use("/api/users", usersRoute);
app.use("/api/admins", adminsRoute);
app.use("/api/admins/fetch", jwtAuthenticator, adminsRoute);

connectDB();

// --- SSL CONFIG ---
const CERT_PATH = "/etc/letsencrypt/live/api.codeveritus.tech";
let sslOptions = {
  key: fs.readFileSync(`${CERT_PATH}/privkey.pem`),
  cert: fs.readFileSync(`${CERT_PATH}/fullchain.pem`),
};

// Auto-reload on cert renewal
chokidar.watch(CERT_PATH, { persistent: true }).on("change", () => {
  console.log("🔁 Reloading renewed SSL certs...");
  sslOptions = {
    key: fs.readFileSync(`${CERT_PATH}/privkey.pem`),
    cert: fs.readFileSync(`${CERT_PATH}/fullchain.pem`),
  };
});

// HTTPS server
https.createServer(sslOptions, app).listen(443, "0.0.0.0", () => {
  console.log("🚀 HTTPS server live on port 443");
});

// HTTP → HTTPS redirect
http
  .createServer((req, res) => {
    res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
    res.end();
  })
  .listen(80, "0.0.0.0", () => console.log("↪ Redirecting HTTP → HTTPS"));
