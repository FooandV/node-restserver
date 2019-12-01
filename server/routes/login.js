const express = require("express");
const bcrypt = require("bcrypt");
const jwt= require('jsonwebtoken')
/* libreria de google para validar token */
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
/* importando el modelo: */
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


/* configuraciones de Google */
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID // Specify the CLIENT_I D of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  console.log(payload.name)
  console.log(payload.email)
  console.log(payload.picture)   

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true

  }

}

/* ruta de servicio google */
app.post("/google", async (req, res) => {
  let token = req.body.idtoken;/* se recibe el token */
  // console.log('token-GOOGLE:',token)

  /* llamando la función de google que verifica el token de google con las propiedades del usuario 
  que se logueo: */
  let googleUser = await verify(token)
  /* si sucede algun error o si el token es invalido no se va ejecutar */
  .catch(e => {
    return res.status(403).json({
      ok: false,
      err: e
    });
  });
  /* si el token es válido se obtiene un objeto googleUser: */
  // res.json({
  //   // token: token
  //   usuarioGoogle: googleUser
  // })
  /* validando si el user existe en el modelo de datos con el correo que se esta logueando: */
  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      /* esto es un error "internal server error: 500*/
      return res.status(500).json({
        ok: false,
        err
      });
    }
    /* si existe el usuario de BD: */
    if(usuarioDB){
      /* si existe el usuario en BD y trato de loguarse por google */
      if(usuarioDB.google === false){
        return res.status(400).json({
          ok: false,
          err:{
            message: 'Debe de usar su autenticación normal'
          }
        });
      }else{
        /* validación de que sea un usuario autenticado p or google anteriormente: 
        se renueva su token: */
        let token = jwt.sign({
          usuario: usuarioDB
          },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        
          return res.json({
            ok: true,
            usuarioAutenticado: usuarioDB,
            token:token
          });
      }
      /* validación si el usuario de base de datos No existe, quiere decir
      que este usuario esta usando credenciales válidas de google para crear su
      usuario en nuestra base de datos: */
    }else{
      /* si el usuario no existe en nuestra base de datos: */
      let usuario= new Usuario();
        usuario.nombre = googleUser.nombre;
        usuario.email = googleUser.email;
        usuario.img = googleUser.img;
        usuario.google = true;
        usuario.password = ':)';

        usuario.save((err, usuarioDB) =>{
          if (err) {
            /* esto es un error "internal server error: 500*/
            return res.status(500).json({
              ok: false,
              err
            });
          }
          /* genero un nuevo token: */
          let token = jwt.sign({
            usuario: usuarioDB
            },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
          
            return res.json({
              ok: true,
              usuarioNuevoDB: usuarioDB,
              token:token
            });

        });
    }

  });
});

module.exports = app;
