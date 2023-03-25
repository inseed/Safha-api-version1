
var models = require('../../models')


var count = async function(req, res, next) {
    
    var response = {
        success: true,
        data: {
            usersCount: 0,
            booksCount: 0,
            reviewsCount: 0,
            authorsCount: 0,
        },
        messages: []
    }
    var noUsers = await models.User.count()
    var noBooks = await models.Book.count()
    var noReviews = await models.Review.count()
    const authorType = await models.UserType.findOne({
        where: {
            type: 'author'
        }
    })

    var noAuthors = await models.User.count({
        where: {
            userTypeId: authorType.id
        }
    })

    response.data.usersCount = noUsers
    response.data.booksCount = noBooks
    response.data.reviewsCount = noReviews
    response.data.authorsCount = noAuthors

    res.send(response)
}

module.exports = { 
    count
}