const express = require("express");
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require("../models/usuario");
/* importación del middleware de autenticación: usando
destructuración:*/
const {verificaToken,verificaAdmin_Role} = require('../middlewares/autenticacion')

/* routes: */
app.get("/usuario",verificaToken ,(req, res)=> {
 
  // return res.json({
  //  usuario: req.usuario,
  //  nombre: req.usuario.nombre,
  //  email: req.usuario.email
  
  // })
  
  /* acá estan los parámetros opcionales:
  desde que valor se quiere filtrar: */
  let desde = req.query.desde  ||  0;
  desde = Number(desde)

  let limite = req.query.limite || 5;
  limite = Number(limite)
  /* find retorna todo lo de la BD y si se quiere se puede especificar filtros */
  Usuario.find({estado:true}, 'nombre email role estado google img' )/* el segundo argumento se manda si se quiere mostrar que campos o propiedades
  de cada objeto queremos mostrar */
          // .skip(5)/* pagína o salta el resultado, es decir se salta los primeros 5 */
          .skip(desde)/* salta el filtro desde donde quiere el usuario que le aparezca el resultado*/
          // .limit(5)/* para ponerle limite de registros */
          .limit(limite)/* para ponerle limite de registros */

          /* exec(), ejecuta el find() */
          /* todas las funciones de mongoose reciben un error y la respuesta del resultado */        
        .exec((err, usuarios)=>{
          if (err) {
            return res.status(400).json({
              ok: false,
              err
            });
          }

          /* para retornar el numero total de registros: */
          /* count, va contar registros */
          Usuario.count({estado:true}, (err, conteo)=>{
            
            res.json({
              ok: true,
              usuarios:usuarios,
              cuantos: conteo
            })
          }) 


        })

  // res.json("get usuario Local");
});

app.post("/usuario", [verificaToken,verificaAdmin_Role], (req, res)=> {
  let body = req.body;
  /* para utilizar el modelo de la bd o esquema Usuario: */
  /* se crea una nueva instancia del esquema que ya fue creado con
    todas las propiedades y metodos que trae mongoose */
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    // img: body.img
    role: body.role
  });
  /* para grabar en la BD:
  save() es un método de mongoose y recibe:
  un error 
  un usuarioBD, es la respuesta que se grabo en mongodb */
  usuario.save((err, usuarioBD) =>{
   
    if(err){
      return res.status(400).json({
        ok:false,
        err
      });
    }
  /* para no mandar el objeto usuario completo en la respuesta: */
    // usuarioBD.password = null;


    /* si lo grabo correctamente: */
    res.json({
      ok: true,
      usuario: usuarioBD
    })
  });

  // if (body.nombre === undefined) {
  //   res.status(400).json({
  //     ok: false,
  //     mensaje: "El nombre es necesario"
  //   });
  // } else {
  //   res.json({
  //     persona: body
  //   });
  // }
});
/* servicio para actualizar: */
app.put("/usuario/:id", [verificaToken,verificaAdmin_Role], function(req, res) {
  let id =
    req.params.id; /* de esta manera se obtiene el parametro del id que viene desde la url */
  // let body = req.body; /* para obtener el body */
  /* utilizando underscore:
      params: 1, recibe todo el objeto que tiene todas las propiedades
              2, un arreglo con todas la propiedades válidas que se pueden actualizar */
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  // delete body.password;

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBD
      });
    }
  );
});

app.delete("/usuario/:id", [verificaToken,verificaAdmin_Role],function(req, res) {
  // res.json("delete usuario");
  let id = req.params.id;
  /* para realizar la eliminación fisica o sea de BD */
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  let cambiaEstado = {
    estado: false
  };
  Usuario.findByIdAndUpdate(id, cambiaEstado, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "usuario no encontrado"
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado,
      message: "Usuario borrado"
    });
  });
});

module.exports = app;
