const express = require("express");

const router = express.Router();

const AdminController = require("../controllers/AdminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/users/:id/registros", authMiddleware, adminMiddleware, AdminController.registrosUsuario,);

router.get("/users", authMiddleware, adminMiddleware, AdminController.usuarios);

router.get("/registros", authMiddleware, adminMiddleware, AdminController.registros);

module.exports = router;
