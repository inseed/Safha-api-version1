const isAdmin = function(req, res, next) {
    if (req.user) {
        if (req.user.type == 1) {
            return next()
        }
    }
    res.status(403)
    res.send({
        success: false,
        messages: ['You do not have permission to perform this action']
    })
}

module.exports = isAdmin