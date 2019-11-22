require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");

/* middlewares: */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(morgan('dev'));

/* configuración global de las rutas: */
app.use(require('./routes/index'));


/* establecer conexión a la base de datos: */
// mongoose.connect('mongodb://localhost:27/cafe',{useNewUrlParser: true, useCreateIndex: true},
//     (err, resp)=>{

//   if (err) throw err; /* si encontro un error y lo lanza */

//   console.log('Base de datos ONLINE')
// });
// const urlMongoDb = "mongodb://localhost:27017/cafe";
const urlMongoDb = process.env.urlDB;

const getMongo = async urlMongoDb => {
    await mongoose.connect(urlMongoDb, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
      })
    
    .then(db => console.log("DB is coneccted"))
    .catch(err => console.log(err))
};

getMongo(urlMongoDb);


app.listen(process.env.PORT, () => {
  console.log("Escuchando puerto", process.env.PORT);
});
