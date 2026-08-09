const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // 1. Ler o cabeçalho Authorization
  const authHeader = req.headers.authorization;

  // 2. Verificar se o Authorization foi enviado
  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado.",
    });
  }

  // 3. Separar Bearer e token
  const [tipo, token] = authHeader.split(" ");

  // 4. Verificar o formato
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Formato do token inválido.",
    });
  }

  try {
    // 5. Validar o token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 6. Salvar informações do usuário
    // dentro da requisição
    req.user = decoded;

    // 7. Continuar para a próxima função
    next();

  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}

module.exports = authMiddleware;