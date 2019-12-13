const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const Usuario = require("../models/usuario.js");
const Producto = require("../models/producto.js");
const fs = require("fs"); /* file system */
const path = require("path");

/* middleware */
app.use(fileUpload());

app.put("/upload/:tipo/:id", (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ningún archivo"
      }
    });
  }
  /* validar tipo: */
  let tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Los tipos permitidas son " + tiposValidos.join(", ")
      }
    });
  }
  //   console.log('hola soy req.Files ', req_files)
  let archivo = req.files.archivo;
  //   console.log('hola soy archivo ',archivo)
  let nombreCortado = archivo.name.split(".");
  //   console.log(nombreCortado);
  let extension = nombreCortado[nombreCortado.length - 1];
  /* Extensiones permitidas */
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "Las extensiones permitidas son " + extensionesValidas.join(", "),
        extension: extension
      }
    });
  }
  /* cambio de nombre al archivo: */
  /* el nombre de la imagen seria algo asi: nombre-1232.jpg */
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
    /* Aqui, imagen cargada */
    if (tipo == "usuarios") {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }
  });
});
/* 1. debe verificar si el usuario existe en BD */
function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "usuarios");
      return res.status(500).json({
        ok: false,
        err
      });
    }
    console.log("usuariooooooDB", usuarioDB);
    /* verificando que exista ese usuario: */
    if (!usuarioDB) {
      borraArchivo(nombreArchivo, "usuarios");

      return res.status(400).json({
        ok: false,
        err: {
          message: `El id de usuario ${id} no existe`
        }
      });
    }
    borraArchivo(usuarioDB.img, "usuarios");

    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioDB) => {
      res.json({
        ok: true,
        usuario: usuarioDB,
        img: nombreArchivo
      });
    });
  });
}


function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "productos");
      return res.status(500).json({
        ok: false,
        err
      });
    }
    /* verificando que exista ese usuario: */
    if (!productoDB) {
      borraArchivo(nombreArchivo, "productos");

      return res.status(400).json({
        ok: false,
        err: {
          message: `El id de producto ${id} no existe`
        }
      });
    }
    borraArchivo(productoDB.img, "productos");

    productoDB.img = nombreArchivo;
    productoDB.save((err, productoDB) => {
      res.json({
        ok: true,
        producto: productoDB,
        img: nombreArchivo
      });
    });
  });
}

function borraArchivo(nombreImagen, tipo) {
    /* se especifica la ruta de la imagen */
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`
    );
    if (fs.existsSync(pathImagen)) {
      /* en caso de que exista se debe de borrar el path de la imagen */
      fs.unlinkSync(pathImagen);
    }
  }
module.exports = app;
