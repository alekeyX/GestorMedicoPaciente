const mongoose = require('mongoose')
const app = require('./app')
const db = require('./db/database')

mongoose.connect(db.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }, (err, res) => {
    if(err) {
        return console.log(`Error al conectar a la base de datos: ${err}`);
    }
    console.log('Conexion a la base de datos establecida...');

    app.listen(db.port, () => {
        console.log(`API REST corriendo en http://localhost:${db.port}`);
    })
})