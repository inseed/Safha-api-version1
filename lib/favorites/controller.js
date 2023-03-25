const { Op } = require('sequelize')
var models = require('../../models')

const { fn } = require('sequelize')
var models = require('../../models')

var favorite = async (req, res, next) => {
    var response = {
        success: true,
        messages: [],
        data: {}
    }
    const userId = req?.user?.id

    const bookId = req?.body?.bookId
    const FindBookId = await models.Book.findOne({
        where: {
            id: bookId
        }
    })
    if (!FindBookId) {
        response.messages.push('invalid book id')
        res.send(response)
        return
    }
    // const bookId = req?.body?.bookId
    console.log("userId", userId)
    console.log("bookId", bookId)
    const [sharedFavorite, favOrUnfav] = await models.Favorite.findOrCreate({
        where: {
            [Op.and]: [{ userId }, { bookId }]
        },
        defaults: {
            userId,
            bookId,
        }
    })
    console.log("sharedFavorite", sharedFavorite)
    console.log("favOrUnfav", favOrUnfav)
    if (favOrUnfav) {
        response.data = sharedFavorite
        response.messages.push('A new favorite have been added successfully.')
        return res.send(response)
    } else {
        if (!sharedFavorite?.deletedAt) {
            const unFav = await models.Favorite.update({
                deletedAt: fn("now")
            },
                {
                    where: {
                        [Op.and]: [{ userId }, { bookId }]
                    }
                })
            if (Array.isArray(unFav) && unFav[0]) {
                response.data = unFav
                response.messages.push('A favorite have been removed successfully.')
                return res.send(response)
            } else {
                response.success = false
                response.messages.push('A unfavorite failed')
                return res.send(response)
            }
        } else {
            const unFav = await models.Favorite.update({
                deletedAt: null
            },
                {
                    where: {
                        [Op.and]: [{ userId }, { bookId },]
                    }
                })
            if (Array.isArray(unFav) && unFav[0]) {
                response.data = unFav
                response.messages.push('A favorite has been added successfully.')
                return res.send(response)
            } else {
                response.success = false
                response.messages.push('A unFav failed')
                return res.send(response)
            }
        }

    }
}


module.exports = {
    favorite
}