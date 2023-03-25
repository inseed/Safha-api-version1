var express = require('express');
var router = express.Router();
const controller  = require('./controller')

var isAdmin = require('../../middlewares/isAdmin')
var isAuthenticated = require('../../middlewares/isAuthenticated');


/*  Admin. */
router.post('/login', controller.login) 
router.get('/all', isAuthenticated, isAdmin, controller.index) //this will show all admins
router.get('/allusers', isAuthenticated, isAdmin, controller.indexUsers) //this will show all user includes author and admin
router.get('/', isAuthenticated, isAdmin, controller.show) //this does not work
router.get('/show/:id', isAuthenticated, isAdmin, controller.showUser)
router.delete('/:id', isAuthenticated, isAdmin, controller.destroy)
router.post('/', isAuthenticated, isAdmin, controller.store) 
router.put('/edit/:id', isAuthenticated, isAdmin, controller.update)




module.exports = router;