module.exports = {
    port: process.env.PORT || 4000,
    // db: process.env.MONGODB || 'mongodb://localhost:27017/consultorio',
    db: process.env.MONGODB || 'mongodb+srv://alekey:<alekey>@medicopaciente.ddape.mongodb.net/<MedicoPaciente>?retryWrites=true&w=majority',
    SECRET_TOKEN: 'claveDeAccesoTokenParaConsultorioWeb'
}