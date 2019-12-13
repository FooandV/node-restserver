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
/* importación archivos */
app.use(require('./uploads'));
/* importación imagenes */
app.use(require('./imagenes'));

module.exports = app;