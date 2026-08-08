const express = require('express');
const app = express();
const cors = require('cors');


const registroRoutes = require("./routes/registro.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/users", userRoutes);
app.use("/registros", registroRoutes);
app.use("/admin", adminRoutes);

module.exports = app;