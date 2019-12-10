const express = require("express");

let { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");
let app = express();
let Categoria = require("../models/categoria");

/* tarea, crear 5 servicios */
/* ============================== */
// Mostrar todas las categorias
/* ==============================  */
app.get("/categoria", verificaToken, (req, res) => {
  Categoria.find({})
  /* sort:Establece el orden de clasificación Si se pasa un objeto, 
  los valores permitidos son asc, desc, ascendente, descendente, 1 y -1 */
  .sort('descripcion')

  /* populate:Especifica rutas que deben rellenarse con otros documentos. 
  Las rutas se rellenan después de que se ejecuta la consulta 
   y se recibe una respuesta */
  .populate('usuario', 'nombre email')
  .exec((err, categorias) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      }); 
    }

    res.json({
      ok: true,
      Categorias: categorias
    });
  });
});

/* ============================== */
// Mostrar una categoria por ID
/* ==============================  */
app.get("/categoria/:id", verificaToken, (req, res) => {
  // Categoria.findById(...);
 let id= req.params.id;
  Categoria.findById(id)
    .exec((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoriaDB){
      return res.status(400).json({
        ok:false,
        err:{
          message: 'El Id no es correcto'

        }

      })

    }
    res.json({
      ok: true,
      Categoria: categoriaDB
    });
  });


});

/* ============================== */
// Crear una categoria
/* ==============================  */
app.post("/categoria", verificaToken, (req, res) => {
  // regresa la nuesva categoria
  // req.usuario._id
  let body = req.body;
  // console.log('soy el body',req.body);
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB){
        return res.status(400).json({
            ok:false,
            err
        })
    }
    res.json({
      ok: true,
      usuario: categoriaDB
    });
  });
});

/* ============================== */
// actualizar una categoria
/* ==============================  */
app.put('/categoria/:id', verificaToken, (req, res) => {

  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
      descripcion: body.descripcion
  };

  Categoria.findByIdAndUpdate(id,
       descCategoria,
        { new: true, runValidators: true },
         (err, categoriaDB) => {

      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!categoriaDB) {
          return res.status(400).json({
              ok: false,
              err
          });
      }

      res.json({
          ok: true,
          categoria: categoriaDB
      });
  });
});

/* ============================== */
// Eliminar una categoria
/* ==============================  */
app.delete("/categoria/:id", [verificaToken,verificaAdmin_Role ],(req, res) => {
  // solo la puede borrar un admon
  // tiene que pedir el token
  // Categoria.findByIdAndRemove, este realiza un borrado fisico
  let id= req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no existe"
        }
      });
    }

    res.json({
      ok: true,
      message: `Categoria Borrada: ${categoriaDB}`
    });
  });


});

module.exports = app;
