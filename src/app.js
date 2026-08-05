const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require("./routes/user.routes");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(userRoutes);

module.exports = app;