var express = require('express');
var router = express.Router();
const controller  = require('./controller');
var isAuthenticated = require('../../middlewares/isAuthenticated')
var isAuthorized = require('../../middlewares/isAuthorized');

/* GET users listing. */
router.post('/',isAuthenticated, isAuthorized, controller.store)
router.get('/all', controller.index)
router.get('/:id', controller.show)
router.delete('/:id',isAuthenticated, isAuthorized, controller.destroy)
router.put('/edit/:id',isAuthenticated, isAuthorized, controller.update)


module.exports = router;