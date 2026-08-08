const RegistroModel = require("../models/RegistroModel");
const UserModel = require("../models/UserModel");

class AdminController {

  async registrosUsuario(req, res) {
    try {
      const { id } = req.params;

      const registros = await RegistroModel.findByUserId(id);

      return res.status(200).json(registros);

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  }

  async usuarios(req, res) {
    try {
      const usuarios = await UserModel.findAll();

      return res.status(200).json(usuarios);

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  }
  async registros(req, res) {
    try {
      const registros = await RegistroModel.findAllWithUsers();

      return res.status(200).json(registros);

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  }
}


module.exports = new AdminController();