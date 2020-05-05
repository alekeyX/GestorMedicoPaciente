
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const db = require('../db/database')

// Metodo para un solo token 
const auth = async(req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({ message: 'No tienes autorizacion'})
    }
    // const token = req.header('Authorization').replace('Bearer ', '')
    const token = req.headers.authorization.split(" ")[1]
    const data = jwt.verify(token, db.SECRET_TOKEN, function(err, decoded) {
        if(err)
            return next(err) // Token incorrecto
        else {
            if(decoded.exp <= moment().unix()) {
                // Token expirado
                next(null, false, {message: 'Token expirado'});
            }
            // Token correcto
            next(null, decoded, { scope: '*'});
        }
    })
    try {
        req.userId = data._id;
        next()
    } catch (error) {
        res.status(401).send({ error: 'No autorizado para acceder a este recurso' })
    }
}

//  Metodo con arrays de tokens en el model user
// const auth = async(req, res, next) => {
//     if(!req.headers.authorization) {
//         return res.status(403).send({ message: 'No tienes autorizacion'})
//     }
//     // const token = req.header('Authorization').replace('Bearer ', '')
//     const token = req.headers.authorization.split(" ")[1]
//     const data = jwt.verify(token, db.SECRET_TOKEN)
//     try {
//         const user = await User.findOne({ _id: data._id, 'tokens.token': token })
//         if (!user) {
//             throw new Error()
//         }
//         req.user = user
//         req.token = token
//         next()
//     } catch (error) {
//         res.status(401).send({ error: 'No autorizado para acceder a este recurso' })
//     }
// }

module.exports = auth