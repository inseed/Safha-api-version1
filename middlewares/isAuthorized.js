var isAuthorized = function(req, res, next) {
    if (req.user.type == 1 || (req.user.type == 2) || (req.user.type == 3)) {
        return next()
    }
    res.status(403)
    res.send({
        success: false,
        messages: ['You do not Have permission to perform this action']
    })
}

module.exports = isAuthorized
