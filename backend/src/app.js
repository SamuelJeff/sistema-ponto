const express = require("express");
const cors = require("cors");

require("dotenv").config();

const errorMiddleware = require("./middlewares/errorMiddleware");

const registroRoutes = require("./routes/registro.routes");

const userRoutes = require("./routes/user.routes");

const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "API do Sistema de Ponto funcionando.",
  });
});

app.use("/users", userRoutes);

app.use("/registros", registroRoutes);

app.use("/admin", adminRoutes);

app.use(errorMiddleware);

module.exports = app;
