const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado.",
    });
  }

  const [tipo, token] = authHeader.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Formato do token inválido.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await UserModel.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        message: "Usuário não encontrado.",
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        message: "Usuário desativado.",
      });
    }

    req.user = {
      id: usuario.id,
      cargo: usuario.cargo,
      ceo_id: usuario.ceo_id,
    };

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}

module.exports = authMiddleware;
