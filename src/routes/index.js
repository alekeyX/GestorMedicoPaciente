// Cargamos módulos
const express = require('express')
const router = express.Router()
// Cargamos controladores
const userCtrl = require('../controllers/user')
const auth = require('../middleware/auth')

// Especificamos nuestras rutas teniendo en cuenta los metodos creados en nuestro controlador, y especificando que seran rutas que usaran el metodo POST
router.post('/create', userCtrl.signUp )
router.post('/signin', userCtrl.signIn )
router.get('/users/', userCtrl.getAll)
router.get('/users/:id', auth, userCtrl.getById)
router.get('/', (req, res) => res.send('hello world'))
router.get('/tasks',auth,  (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task one',
            description: 'lorem ipsum',
            date: "2020-04-28T20:39:05.2111Z"
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'lorem ipsum',
            date: "2020-04-28T20:39:05.2111Z"
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'lorem ipsum',
            date: "2020-04-28T20:39:05.2111Z"
        },
    ])
})



module.exports = router;