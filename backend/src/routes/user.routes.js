const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/profile", authMiddleware, UserController.profile);

module.exports = router;