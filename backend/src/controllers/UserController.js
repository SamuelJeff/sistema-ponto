const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

class UserController {
  async signup(req, res, next) {
    try {
      const { nome, nome_empresa, email, senha } = req.body;

      if (
        !nome?.trim() ||
        !nome_empresa?.trim() ||
        !email?.trim() ||
        !senha?.trim()
      ) {
        return res.status(400).json({
          message: "Nome, nome da empresa, e-mail e senha são obrigatórios.",
        });
      }

      const emailFormatado = email.trim().toLowerCase();

      const usuarioExiste = await UserModel.findByEmail(emailFormatado);

      if (usuarioExiste) {
        return res.status(409).json({
          message: "E-mail já cadastrado.",
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      await UserModel.create({
        ceo_id: null,
        nome: nome.trim(),
        nome_empresa: nome_empresa.trim(),
        email: emailFormatado,
        senha: senhaHash,
        cargo: "CEO",
        jornada_diaria_minutos: 480,
        ativo: true,
        status_assinatura: "ativa",
      });

      return res.status(201).json({
        message: "Conta criada com sucesso.",
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { nome, email, senha, cargo, jornada_diaria_minutos } = req.body;

      if (!nome?.trim() || !email?.trim() || !senha?.trim() || !cargo?.trim()) {
        return res.status(400).json({
          message: "Nome, e-mail, senha e cargo são obrigatórios.",
        });
      }

      const cargosPermitidos = ["Administrador", "Funcionario"];

      if (!cargosPermitidos.includes(cargo)) {
        return res.status(400).json({
          message: "Cargo inválido. Use Administrador ou Funcionario.",
        });
      }

      const emailFormatado = email.trim().toLowerCase();

      const usuarioExiste = await UserModel.findByEmail(emailFormatado);

      if (usuarioExiste) {
        return res.status(409).json({
          message: "E-mail já cadastrado.",
        });
      }

      const jornadaDiaria = jornada_diaria_minutos ?? 480;

      if (
        !Number.isInteger(Number(jornadaDiaria)) ||
        Number(jornadaDiaria) <= 0 ||
        Number(jornadaDiaria) > 1440
      ) {
        return res.status(400).json({
          message: "Jornada diária inválida.",
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      await UserModel.create({
        ceo_id: req.user.id,
        nome: nome.trim(),
        nome_empresa: null,
        email: emailFormatado,
        senha: senhaHash,
        cargo,
        jornada_diaria_minutos: Number(jornadaDiaria),
        ativo: true,
        status_assinatura: null,
      });

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

      if (!email?.trim() || !senha) {
        return res.status(400).json({
          message: "E-mail e senha são obrigatórios.",
        });
      }

      const emailFormatado = email.trim().toLowerCase();

      const usuario = await UserModel.findByEmail(emailFormatado);

      if (!usuario) {
        return res.status(401).json({
          message: "E-mail ou senha inválidos.",
        });
      }

      if (!usuario.ativo) {
        return res.status(403).json({
          message: "Usuário desativado.",
        });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({
          message: "E-mail ou senha inválidos.",
        });
      }

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

      if (!usuario.ativo) {
        return res.status(403).json({
          message: "Usuário desativado.",
        });
      }

      return res.status(200).json({
        id: usuario.id,
        ceo_id: usuario.ceo_id,
        nome: usuario.nome,
        nome_empresa: usuario.nome_empresa,
        email: usuario.email,
        cargo: usuario.cargo,
        jornada_diaria_minutos: usuario.jornada_diaria_minutos,
        ativo: usuario.ativo,
        status_assinatura: usuario.status_assinatura,
      });
    } catch (error) {
      next(error);
    }
  }
  async alterarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      if (typeof ativo !== "boolean") {
        return res.status(400).json({
          message: "O campo ativo deve ser true ou false.",
        });
      }

      const usuario = await UserModel.findById(id);

      if (!usuario) {
        return res.status(404).json({
          message: "Usuário não encontrado.",
        });
      }

      /*
       * O CEO não pode usar essa rota
       * para desativar a própria conta.
       */
      if (Number(usuario.id) === Number(req.user.id)) {
        return res.status(400).json({
          message:
            "Você não pode alterar o status da própria conta por esta rota.",
        });
      }

      /*
       * O usuário precisa pertencer
       * ao CEO autenticado.
       */
      if (Number(usuario.ceo_id) !== Number(req.user.id)) {
        return res.status(403).json({
          message: "Você não possui permissão para alterar este usuário.",
        });
      }

      await UserModel.updateStatus(usuario.id, ativo);

      return res.status(200).json({
        message: ativo
          ? "Usuário reativado com sucesso."
          : "Usuário desativado com sucesso.",
      });
    } catch (error) {
      next(error);
    }
  }wwwww
}

module.exports = new UserController();
