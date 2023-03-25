var express = require('express');
var router = express.Router();
const controller  = require('./controller');
var isAuthenticated = require('../../middlewares/isAuthenticated');
var isAuthorized = require('../../middlewares/isAuthorized');


/* GET users listing. */
router.post('/', isAuthenticated, isAuthorized, controller.rate)
router.delete('/:id', isAuthenticated, isAuthorized, controller.destroy)

module.exports = router;