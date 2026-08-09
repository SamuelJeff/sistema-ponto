const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

class UserController {
  async register(req, res, next) {
    try {
      const { nome, email, senha, cargo } = req.body;

      // 1. Validar campos obrigatórios
      if (
        !nome?.trim() ||
        !email?.trim() ||
        !senha?.trim() ||
        !cargo?.trim()
      ) {
        return res.status(400).json({
          message: "Nome, e-mail, senha e cargo são obrigatórios.",
        });
      }

      // 2. Verificar se o e-mail já está cadastrado
      const usuarioExiste = await UserModel.findByEmail(email);

      if (usuarioExiste) {
        return res.status(409).json({
          message: "E-mail já cadastrado.",
        });
      }

      // 3. Criptografar senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // 4. Salvar usuário
      await UserModel.create({
        nome,
        email,
        senha: senhaHash,
        cargo,
      });

      // 5. Resposta
      return res.status(201).json({
        message: "Usuário cadastrado com sucesso.",
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      // Validar campos
      if (!email || !senha) {
        return res.status(400).json({
          message: "E-mail e senha são obrigatórios.",
        });
      }

      // Buscar usuário
      const usuario = await UserModel.findByEmail(email);

      if (!usuario) {
        return res.status(401).json({
          message: "E-mail ou senha inválidos.",
        });
      }

      // Comparar senha
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({
          message: "E-mail ou senha inválidos.",
        });
      }

      // Gerar token
      const token = jwt.sign(
        {
          id: usuario.id,
          cargo: usuario.cargo,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      return res.status(200).json({
        message: "Login realizado com sucesso.",
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async profile(req, res, next) {
    try {
      const usuario = await UserModel.findById(req.user.id);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuário não encontrado.",
        });
      }

      return res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();