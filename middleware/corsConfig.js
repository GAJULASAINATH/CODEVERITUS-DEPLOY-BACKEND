const cors = require("cors");

const corsConfig = cors({
  origin: ["https://your-netlify-site.netlify.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

module.exports = corsConfig;
