const express = require("express");

const router = express.Router();

const AdminController = require("../controllers/AdminController");

const authMiddleware = require("../middlewares/authMiddleware");

const permitirCargos = require("../middlewares/roleMiddleware");

/*
 * CEO e Administrador podem consultar
 * registros de usuários.
 *
 * Depois o AdminController vai verificar
 * se o usuário solicitado pode realmente
 * ser visualizado.
 */
router.get(
  "/users/:id/registros",
  authMiddleware,
  permitirCargos("CEO", "Administrador"),
  AdminController.registrosUsuario,
);

/*
 * CEO e Administrador podem listar
 * usuários.
 *
 * A lista retornada será diferente
 * dependendo do cargo.
 */
router.get(
  "/users",
  authMiddleware,
  permitirCargos("CEO", "Administrador"),
  AdminController.usuarios,
);

/*
 * Consulta geral de registros.
 *
 * CEO e Administrador podem acessar,
 * mas também precisaremos aplicar
 * a hierarquia dentro do controller/service.
 */
router.get(
  "/registros",
  authMiddleware,
  permitirCargos("CEO", "Administrador"),
  AdminController.registros,
);

module.exports = router;
