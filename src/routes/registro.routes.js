const express = require("express");

const router = express.Router();

const RegistroController = require("../controllers/RegistroController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");


router.post("/entrada", authMiddleware, RegistroController.entrada);

router.post("/inicio-almoco", authMiddleware, RegistroController.inicioAlmoco);

router.post("/fim-almoco", authMiddleware, RegistroController.fimAlmoco);

router.post("/saida", authMiddleware, RegistroController.saida);

router.get("/meus-registros", authMiddleware, RegistroController.meusRegistros);

router.get(
  "/teste-admin",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    return res.json({
      message: "Você é administrador."
    });
  }
);

module.exports = router;
