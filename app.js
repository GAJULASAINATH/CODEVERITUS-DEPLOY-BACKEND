//access credentials

//All packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

//routes
const { connectDB } = require("./dbConnections/db");
const usersRoute = require("./routes/usersRoutes");
const adminsRoute = require("./routes/adminsRoutes");
const jwtAuthenticator = require("./middleware/jwtAuthenticator");

//MAIN APP
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//PORT AVAILABILITY
const PORT = process.env.PORT || 4000;

const serverAndDatabaseConnection = async () => {
  try {
    await connectDB();

    //UNPROTEDTED ROUTES
    app.use("/api/users", usersRoute);
    app.use("/api/admins", adminsRoute);

    //PROTECTED ROUTES
    app.use("/api/admins/fetch", jwtAuthenticator, adminsRoute);

    app.listen(PORT, "0.0.0.0", () => { 
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  } finally {
    console.log("Server initialization attempted.");
  }
};

//VISIT CODE
app.get("/",(req,res)=>{
  res.send("CODEVERITUS-BACKEND");
})
serverAndDatabaseConnection();