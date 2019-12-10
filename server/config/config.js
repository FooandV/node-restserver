/* se declaran constantes, variables de forma global */

// ========================
// Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;

// ========================
// entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ========================
// vencimiento del token
// ========================
//60 segundos
//60 minutos
//24 horas
//30 dias
// process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';

// ========================
// seed "semilla" de autenticación
// ========================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarollo";

// ========================
// Base de datos
// ========================

let urlDB;

if (process.env.NODE_ENV == "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  // process.env.mongodb; 
urlDB = "mongodb+srv://freyder:violetta@cluster0-rzoqa.mongodb.net/test?retryWrites=true&w=majority";
    
}
// ========================
// Google Client Id
// ======================== 
process.env.CLIENT_ID = process.env.CLIENT_ID || '843894900556-t0u34jncbgn3hukulqhd9t7tpd49evlb.apps.googleusercontent.com'; 



process.env.urlDB = urlDB;

/* sring connection local: */
// mongodb://localhost:27017/cafe

/* string connection remote: */
// mongodb+srv://freyder:<zNG9CllIfQURV1Xx>@cluster0-rzoqa.mongodb.net/cafe
// mongodb+srv://freyder:<violetta>@cluster0-rzoqa.mongodb.net/test?retryWrites=true&w=majority
