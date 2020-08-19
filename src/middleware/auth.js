
const jwt = require('jsonwebtoken')
const db = require('../db/database')

// Metodo para un solo token 
const auth = async(req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({ message: 'No tienes autorizacion'})
    }
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, db.SECRET_TOKEN,function(err, decoded){
    try {
        req.userId = decoded._id;
        next()
    } catch (error) {
        res.status(401).send({ message: 'No autorizado para acceder a este recurso' })
    }
    });
    
}

module.exports = auth