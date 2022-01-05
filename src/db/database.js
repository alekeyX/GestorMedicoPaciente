module.exports = {
    port: process.env.PORT || 4000,
    // direccion de base de datos local
    db: process.env.MONGODB || 'mongodb://localhost:27017/consultorioWeb',
    SECRET_TOKEN: process.env.SECRET_TOKEN || 'claveDeAccesoTokenParaConsultorioWeb'
}