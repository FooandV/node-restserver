const express = require('express');
const {verificaToken}= require('../middlewares/autenticacion');
const _ = require('underscore');

let app= express();
let Producto = require('../models/producto')

// =====================================
// Obtener todos los productos 
// =====================================
app.get("/productos", verificaToken, (req, res) => {
  /* trae todos los productos */
  /* populate: usuario, categoria */
  /* paginado */
  /* para controlar la pagina que se quiere controlar: */
  let desde = req.query.desde || 0; /* esto es un string */
  desde = Number(desde); /* se transforma en un numero */
  /* solo traera los productos que esten disponibles: */
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

      Producto.count({ disponible: true }, (err, conteo) => {
        res.json({
          ok: true,
          productos,
          productosDisponibles: conteo
        });
      });
    });
});
// =====================================
// Obtener un producto
// =====================================
app.get("/productos/:id", verificaToken, (req, res) => {
  /* trae un producto */
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El Id no es correcto"
          }
        });
      }
      res.json({
        ok: true,
        producto: productoDB
      });
    });
});
// =====================================
// Buscar Productos
// =====================================
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;
let regex= new RegExp(termino, 'i');/* expresion regular */

  Producto.find({ nombre: regex })
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        productos
      });
    });
});












// =====================================
// cear un producto 
// debe grabar el usuario
// grabar una categoria del listado
// =====================================
app.post("/producto",verificaToken, (req, res)=>{

    let body= req.body;
    console.log('soy el bodyde producto', req)
    let producto = new Producto({
      usuario: req.usuario._id,
      nombre: body.nombre,
      precioUni: body.precioUni,
      descripcion: body.descripcion,
      disponible: body.disponible,
      categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        res.status(201).json({
          ok: true,
          producto: productoDB
        });
      });

});
// =====================================
// Actualizar un producto 
// =====================================
app.put("/producto/:id",verificaToken, (req, res) => {
  let id = req.params.id;
  let body=req.body;

  Producto.findById(
    id,
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err:{
              message: 'El id no existe'
          }
        });
      }
      /* si existe el producto: se actualiza:*/
      productoDB.nombre = body.nombre; 
      productoDB.precioUni = body.precioUni;
      productoDB.categoria = body.categoria;
      productoDB.disponible = body.disponible;
      productoDB.descripcion = body.descripcion;
      /* ahora se actualiza en la base de datos: */
      productoDB.save((err, productoGuardado)=>{
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
          }
          
        res.json({
            ok: true,
            producto: productoGuardado
        })
      })
    }
  );
});
// =====================================
// Eliminar(inactivar) un producto 
// =====================================
app.delete("/productos/:id", verificaToken,(req, res) => {
  

    let id= req.params.id;
    Producto.findById(id, (err, productoDB)=>{
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        if (!productoDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "El Id del producto no existe"
            }
          });
        }
        /* si encuentra el producto hay que cambiar el estado
        de disponible:*/
        productoDB.disponible= false;
        /* ahora se graba en base de datos: */
        productoDB.save((err, productoInactivo)=>{
            if (err) {
                return res.status(500).json({
                  ok: false,
                  err
                });
              }
              
            res.json({
                ok: true,
                productoInactivo: productoInactivo,
                message:'Producto Borrado(inactivo)'
            })
        })


    })
});

module.exports = app;