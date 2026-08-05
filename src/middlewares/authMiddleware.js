const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // Ler o cabeçalho Authorization
  const authHeader = req.headers.authorization;

  // Verificar se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado."
    });
  }

  // Separar "Bearer" do token
  const [, token] = authHeader.split(" ");

  try {
    // Validar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Salvar informações do usuário
    req.user = decoded;

    // Continuar para a próxima função
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token inválido."
    });
  }
}

module.exports = authMiddleware;