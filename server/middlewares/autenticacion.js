const jwt = require("jsonwebtoken");

/* se crea una funcipión que ejecute algo en particular
  para el caso sera la verificación del token*/

// =========================
// verificar token
// =========================

let verificaToken = (req, res, next) => {
  /* 1 leer los headers */
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no válido"
        }
      });
    }

    req.usuario = decoded.usuario; /* todo esto es el payload */
    console.log(req.usuario);
    next();
  });
};

/* que se quiere hacer con el token: */

//  res.json({
//     token: token

//  })
//   console.log(token);
// =========================
// verificar AdminRole
// =========================
let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;
  console.log('soy el usuario de verificaAdmin!!!',usuario)
  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El usuario no es administrador"
      }
    });
  }
};
// =========================
// verificar Token para imagen
// =========================
let verificaTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no válido"
        }
      });
    }

    req.usuario = decoded.usuario; /* todo esto es el payload */
    console.log(req.usuario);
    next();
  });

}


module.exports = {
  verificaToken,
  verificaAdmin_Role,
  verificaTokenImg
};
