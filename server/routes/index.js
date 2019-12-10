const express = require("express");
const app = express();

/* importación del usuario: */
app.use(require('./usuario'));
/* importación login */
app.use(require('./login'));
/* importación categorias */
app.use(require('./categoria'));
/* importación productos */
app.use(require('./producto'));

module.exports = app;