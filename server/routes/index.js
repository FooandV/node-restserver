const express = require("express");
const app = express();

/* importación del usuario: */
app.use(require('./usuario'));
/* importación login */
app.use(require('./login'));




module.exports = app;