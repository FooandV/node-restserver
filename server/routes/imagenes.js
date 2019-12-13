const express = require('express');
const fs= require('fs');  
const path=require('path')
const {verificaTokenImg}= require('../middlewares/autenticacion')

let app= express();

/*el usuario tiene que decir que tipo de imagen es la que
quiere cargar o quiere que se le presente en el response:*/
app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
  let tipo = req.params.tipo;
  let img = req.params.img;
  /* se arma un path
    - tipo: productos o usuarios
    - img: imagen que esta mandando */
  let pathImg = `./uploads/${tipo}/${img}`;

  /* se especifica la ruta de la imagen por medio de un path: */
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  /* se valida la existencia de la imagen en ese path */
  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    /* path absoluto de la imagen default: */
    let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);
    /* para que se regrese una imagen por defecto: */
    res.sendFile(noImagePath);
  }

});


module.exports= app;