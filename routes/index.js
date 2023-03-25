var express = require('express');
var router = express.Router();


router.use('/users',require("../lib/users"))
router.use('/reviews',require("../lib/reviews"))
router.use('/comments',require("../lib/comments"))
router.use('/categories',require("../lib/categories"))
router.use('/books',require("../lib/books"))
router.use('/userTypes',require("../lib/usersType"))
router.use('/userInfos',require("../lib/userInfo"))
router.use('/likes',require("../lib/likes"))
router.use('/favorites',require("../lib/favorites"))
// router.use('/bookTypes',require("../lib/bookTypes"))
router.use('/authors',require("../lib/authors"))
router.use('/admins',require("../lib/admin"))
router.use('/publishers',require("../lib/publishers"))
router.use('/search',require("../lib/search"))
router.use('/counts',require("../lib/count"))
router.use('/rates',require("../lib/rates"))


module.exports = router;
 