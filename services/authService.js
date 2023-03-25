var bcrypt = require('bcryptjs')

var jwt = require('jsonwebtoken');
const authService = {
    hashPassword: function(plainTextPassword) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(plainTextPassword, salt);
        return hash
    },

    comparePassword: function(plain, hash) {
        return bcrypt.compareSync(plain, hash)
    },

    generateToken: function(user) {
        return jwt.sign({
            id: user.id,
            type: user?.userTypeId,
            email: user.email,
            username: user.username
        }, '1234567890')
    },
    
    decryptToken: function(token) {
        var payload = null
        try {
            payload = jwt.verify(token, '1234567890')
        } catch (e) {
        }
        return payload
    }
}
module.exports = authService