const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");
const permitirCargos = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/signup", UserController.signup);

router.post(
  "/register",
  authMiddleware,
  permitirCargos("CEO"),
  UserController.register,
);

router.post("/login", UserController.login);

router.get("/profile", authMiddleware, UserController.profile);

router.patch(
  "/:id/status",
  authMiddleware,
  permitirCargos("CEO"),
  UserController.alterarStatus,
);

module.exports = router;
