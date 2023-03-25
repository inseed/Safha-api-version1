var express = require('express');
var router = express.Router();
const controller  = require('./controller')
var isAuthenticated = require('../../middlewares/isAuthenticated');
const isAuthorized = require('../../middlewares/isAuthorized');
const isAdmin = require('../../middlewares/isAdmin');
const isAuthor = require('../../middlewares/isAuthor')


router.get('/allAuthors', isAuthenticated, isAuthorized, isAdmin, controller.index)
router.get('/', isAuthenticated, isAuthor, controller.show)  // get my profile 
router.delete('/' ,isAuthenticated, isAuthor, controller.destroy)
router.put('/edit', isAuthenticated, isAuthor, controller.update)


module.exports = router;