module.exports = {
    port: process.env.PORT || 4000,
    db: process.env.MONGODB || 'mongodb://localhost:27017/consultorio',
    SECRET_TOKEN: 'claveDeAccesoTokenParaConsultorioWeb'
}