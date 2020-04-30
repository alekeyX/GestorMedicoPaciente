// Cargamos módulos
const express = require('express')
const router = express.Router()
// Cargamos controladores
const userCtrl = require('../controllers/user')

// Especificamos nuestras rutas teniendo en cuenta los metodos creados en nuestro controlador, y especificando que seran rutas que usaran el metodo POST
// router.get('/users', userCtrl.getUsers )
// router.get('/user/:id', userCtrl.getUser )
router.post('/create', userCtrl.signUp )
router.post('/signin', userCtrl.signIn )
// router.get('/users', userCtrl.getUsers )
// router.get('/users', userCtrl.getUsers )
// router.get('/users', userCtrl.getUsers )
// router.get('/users', userCtrl.getUsers )

module.exports = router;