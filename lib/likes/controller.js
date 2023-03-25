const { fn, Op } = require('sequelize')
var models = require('../../models')
const { update } = require('../reviews/controller')

var reviewsLike = async (req, res, next) => {
    var response = {
        success: true,
        messages: [],
        data: {}
    }
    const userId = req?.user?.id

    const likeableId = req?.body?.likeableId
    // const id = req?.params?.id
    const reviewId = await models.Review.findOne({
        where: {
            id: likeableId
        }
    })
    if(!reviewId) {
        response.messages.push('invalid review id')
        res.send(response)
        return
    }

    // const likeableId = id
    
    if (!likeableId) {
        response.success = false
        response.messages.push('invalid review id')
    }
    if (!response.success) {
        res.send(response)
        return
    }
    const [sharedlike, likedOrDisliked] = await models.Like.findOrCreate({
        where: {
            [Op.and]: [{ userId }, { likeableId }, { likeableType: "review" }]
        },
        defaults: {
            userId,
            likeableId,
            likeableType: "review",
        }
    })
    console.log("sharedlike",sharedlike)
    console.log("likedOrDisliked",likedOrDisliked)
    if (likedOrDisliked) {
        response.data = sharedlike
        response.messages.push('A new like have been added successfully.')
        return res.send(response)
    } else {
        if (!sharedlike?.deletedAt) {
            const disLike = await models.Like.update({
                deletedAt: fn("now")
            },
                {
                    where: {
                        [Op.and]: [{ userId }, { likeableId }, { likeableType: "review" }]
                    }
                })
            if (Array.isArray(disLike) && disLike[0]) {
                response.data = disLike
                response.messages.push('A like have been removed successfully.')
                return res.send(response)
            } else {
                response.success = false
                response.messages.push('A dislike failed')
                return res.send(response)
            }
        } else {
            const disLike = await models.Like.update({
                deletedAt: null
            },
                {
                    where: {
                        [Op.and]: [{ userId }, { likeableId }, { likeableType: "review" }]
                    }
                })
            if (Array.isArray(disLike) && disLike[0]) {
                response.data = disLike
                response.messages.push('A like has been added successfully.')
                return res.send(response)
            } else {
                response.success = false
                response.messages.push('A dislike failed')
                return res.send(response)
            }
        }

    }
}

var commentsLike = async (req, res, next) => {
    var response = {
        success: true,
        messages: [],
        data: {}
    }
    const userId = req?.user?.id
    // const id = req?.params?.id
    const likeableId = req?.body?.likeableId
    const commentId = await models.Comment.findOne({
        where: {
            id: likeableId
        }
    })
    if(!commentId) {
        response.messages.push('invalid comment id')
        res.send(response)
        return
    }
    
    // const likeableId = id
    if (!likeableId) {
        response.success = false
        response.messages.push('invalid comment id')
    }
    if (!response.success) {
        res.send(response)
        return
    }
    const [sharedlike, likedOrDisliked] = await models.Like.findOrCreate({
        where: {
            [Op.and]: [{ userId }, { likeableId }, { likeableType: "comment" }]
        },
        defaults: {
            userId,
            likeableId,
            likeableType: "comment",
        }
    })
    if (likedOrDisliked) {
        response.data = sharedlike
        response.messages.push('A new like has been added successfully.')
        return res.send(response)
    } else {
        if (!sharedlike?.deletedAt) {
            const disLike = await models.Like.update({
                deletedAt: fn("now")
            },
                {
                    where: {
                        [Op.and]: [{ userId }, { likeableId }, { likeableType: "comment" }]
                    }
                })
            if (Array.isArray(disLike) && disLike[0]) {
                response.data = disLike
                response.messages.push('A like has been removed successfully.')
                return res.send(response)
            } else {
                response.success = false
                response.messages.push('A dislike failed')
                return res.send(response)
            }
        } else {
            const disLike = await models.Like.update({
                deletedAt: null
            },
                {
                    where: {
                        [Op.and]: [{ userId }, { likeableId }, { likeableType: "comment" }]
                    }
                })
            if (Array.isArray(disLike) && disLike[0]) {
                response.data = disLike
                response.messages.push('A like has been added successfully.')
                return res.send(response)
            } else {
                response.success = false
                response.messages.push('A dislike failed')
                return res.send(response)
            }
        }

    }
}

module.exports = {
    reviewsLike,
    commentsLike
}