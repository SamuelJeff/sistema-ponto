function permitirCargos(...cargosPermitidos) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        message: "Usuário não autenticado.",
      });
    }

    if (!cargosPermitidos.includes(req.user.cargo)) {
      return res.status(403).json({
        message: "Você não possui permissão para acessar este recurso.",
      });
    }

    next();
  };
}

module.exports = permitirCargos;
