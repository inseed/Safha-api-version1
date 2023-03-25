var express = require('express');
var router = express.Router();
const controller = require('./controller')
var isAuthenticated = require('../../middlewares/isAuthenticated')
var isAuthorized = require('../../middlewares/isAuthorized');

/* GET users listing. */
router.post('/signup', controller.SignUp)
router.get('/all', controller.index)
router.get('/', isAuthenticated, controller.show)
router.get('/:id', isAuthenticated, controller.showOneUser)
router.delete('/',isAuthenticated,isAuthorized, controller.destroy)
router.put('/edit',isAuthenticated, isAuthorized, controller.update)
router.post('/login', controller.login)


module.exports = router;