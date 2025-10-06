const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers");

router.post("/signup", usersController.usersSignup);
router.post("/login", usersController.usersLogin);
router.post("/submit", usersController.codeSubmit);
module.exports = router;
