/* este js sera el encargado de trabajar el modelo de datos: */

const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');



/* obtener la plantilla para crear esquemas de mongoose: */
let Schema = mongoose.Schema;
let rolesValidos = {
  values: ['ADMIN_ROLE','USER_ROLE'],
  message: '{VALUE} no es un rol válido'
}; 

let usuarioSchema = new Schema({
  /* campos: */
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"]
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos 
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});
/* como la contraseña jamas se regresa: */

/* para no mandar el objeto en la respuesta, se puede manipular el schema */
/* toJSON, este método en un esquema siempre se llama cuando se intenta imprimir, como es en este caso
que en la respuesta estamos mandando todo el objeto completo del esquema mediante un json   */
usuarioSchema.methods.toJSON = function(){
  let user= this;/* lo que sea que tenga en ese momento */
  /* se toma el objeto de ese usuario: */
  let userObject = user.toObject();/* con esto ya tengo todas las propiedades y métodos */
  delete userObject.password;/* acá ya se tiene un objeto que NO tiene la contraseña */

  return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único'});

module.exports = mongoose.model("Usuario", usuarioSchema);
