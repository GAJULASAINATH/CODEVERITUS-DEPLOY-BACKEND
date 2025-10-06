const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected Successfully!!");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const adminsDB = mongoose.connection.useDb("adminsDB");
const usersDB = mongoose.connection.useDb("usersDB");
const submissionsDB = mongoose.connection.useDb("submissionsDB");

module.exports = { connectDB, adminsDB, usersDB, submissionsDB };
