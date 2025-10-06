const express = require("express");
const router = express.Router();
const adminsController = require("../controllers/adminsControllers");

// Routes connected to controller functions
router.post("/signup", adminsController.adminsSignup);
router.post("/login", adminsController.adminsLogin);
router.get("/codeSubmissions", adminsController.seeCode);
module.exports = router;
