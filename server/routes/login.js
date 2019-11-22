const express = require("express");
const bcrypt = require("bcrypt");
const jwt= require('jsonwebtoken')

const Usuario = require("../models/usuario");
const app = express();

app.post("/login", (req, res) => {
  /* entiendase como body: email y password */
  let body = req.body;

  /* 1. se verifica si el correo existe: */
  /* se verifica en el esquema con el metodo findOne que busca un documento 
    y se especifica una condición que el email exista, luego se llama un callback :
    se recibe el error, usuarioDB(usuario de base de datos)*/
  /* si existe un correo válido se va obtener en el parametro "usuarioDB" */
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      /* esto es un error "internal server error: 500*/
      return res.status(500).json({
        ok: false,
        err
      });
    }
    /* verificar si no viene un usuario de base de datos "userDB"
          es decir que el email que puso NO existe */
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectos"
        }
      });
    }
    /* verificando contraseña: */
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (contraseña) incorrectos"
        }
      });
    }
    /* se manda el payload o la información que se quiere almacenar en el token */
    // ========================
    // vencimiento del token
    // ========================
    //60 segundos
    //60 minutos
    //24 horas
    //30 dias
    let token = jwt.sign({
        usuario: usuarioDB
        },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });




    /* respuesta valida para enviar al usuario: */
    res.json({
      ok: true,
      usuario: usuarioDB,
      token: token
    });
  });
});

module.exports = app;
