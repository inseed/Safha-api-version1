var express = require('express');
var router = express.Router();
const controller  = require('./controller');
var isAuthenticated = require('../../middlewares/isAuthenticated');
var isAuthorized = require('../../middlewares/isAuthorized');

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split('.')
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext[ext.length - 1])
    }
})
const upload = multer({ storage: storage })

router.post('/', isAuthenticated, isAuthorized, upload.single('cover'), controller.store)
router.put('/edit/:id',isAuthenticated, isAuthorized, upload.single('cover'), controller.update)

/* GET users listing. */
router.get('/all', controller.index)
router.get('/:id', controller.show)
router.delete('/:id',isAuthenticated, isAuthorized, controller.destroy)

module.exports = router;