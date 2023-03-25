var models = require("../../models")
const { fn } = require('sequelize')
const { bookTransformer } = require("../../transformers/bookTransformer")
const { userInfoTransformer } = require("../../transformers/userInfoTransformer")


var store = async function (req, res, next) {
   
    var response = {
        success: true,
        messages: [],
        data: {}
    }
    var bookId = Number(req?.body?.bookId)
    var content = req?.body?.content?.trim()

    if(!bookId || bookId < 1){
        response.success = false
        response.messages.push('The bookId should be a number.')
    }
    if (!content || content?.length < 3) { 
        response.success = false
        response.messages.push('content is not a valid')
    }
    if (!response.success) {
        res.send(response)
        return
    }

    try {
        var newReview = await models.Review?.create({
            userId : req?.user?.id,
            bookId : bookId,
            content: content,
        })
        response.data = newReview
        response.messages.push('Review has been created successfully.')
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push('Something went wrong! Please try again later')
    }
    res.send(response)
}

var index = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    try {
        var allReviews = await await models.Review?.findAll({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            include: [
                {
                model: models.User,
                attributes: 
                    {exclude: ['deletedAt', 'createdAt', 'updatedAt']}
                },
                {
                model: models.Comment,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }},
                {
                model: models.Book,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }},
                {
                    model: models.Like,
                    attributes: {
                        exclude: ['deletedAt', 'createdAt', 'updatedAt']
                    }},
            ]
        })
        if (Array?.isArray(allReviews)) {
            // console.log("allReviews::::",allReviews[0]?.dataValues?.Book)
            if(allReviews[0]?.dataValues?.Book){
                allReviews[0].dataValues.Book = bookTransformer(allReviews[0]?.dataValues?.Book)
            }
            response.data = allReviews
        } else {
            res.status(404)
            res.success = false
            response.messages.push('Please Try again later')
        }
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push('Something went wrong! Please try again later')
    }
    res.send(response)
}

var show = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    try {
        var id = req?.params?.id
        var review = await models.Review?.findByPk(id,{
            attributes: { exclude: ['deletedAt', 'updatedAt'] },
            include: [
                {
                model: models.User,
                attributes: 
                    {exclude: ['deletedAt', 'createdAt', 'updatedAt']}
                },
                {
                    model: models.UserInfo,
                    attributes: 
                        {exclude: ['deletedAt', 'createdAt', 'updatedAt']}
                },
                {
                model: models.Comment,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }},
                {
                model: models.Book,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }},
                {
                    model: models.Like,
                    attributes: {
                        exclude: ['deletedAt', 'createdAt', 'updatedAt']
                    }},
            ]
        })
        if (review) {
            // console.log("review::::",review?.dataValues?.Book)
            if(review?.dataValues?.Book){
                review.dataValues.Book = bookTransformer(review?.dataValues?.Book)
            }
            // console.log("review?.dataValues?.UserInfo",review?.dataValues?.UserInfo)
            if(review?.dataValues?.UserInfo){
                review.dataValues.UserInfo = userInfoTransformer(review?.dataValues?.UserInfo)
            }

            response.data = review
        } else {
            res.status(404)
            response.messages.push('Please Provide a valid ID')
            response.success = false
        }
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push('Something went wrong! Please try again later')
    }
    res.send(response)
}

var destroy = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    try {
        var id = req?.params?.id
        var deleted = await models.Review?.destroy(
        {
            where: {
                id: id
            }
        });
        if (deleted) {
            response.messages.push('Your review has ben removed successfully.')

        } else {
            res.status(404)
            response.success = false
            response.messages.push('Please try again later.') 
        }
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push('Something went wrong! Please try again later')
    }

    res.send(response)
}

var update = async function (req, res, next) { 
   
    var response = {
        success: true,
        messages: [],
        data: {}
    }

    var bookId = Number(req?.body?.bookId)
    var content = req?.body?.content.trim()

    if(!bookId || bookId < 1){
        response.success = false
        response.messages.push('The bookId should be a number.')
    }
    if (!content || content?.length < 3) { 
        response.success = false
        response.messages.push('content is not a valid')
    }
    if (!response.success) {
        res.send(response)
        return
    }
    
    try {
        var id = req.params.id
        var updateReview = await models.Review?.update({
            userId : req?.user?.id,
            bookId : bookId,
            content: content,
        }, {
            where: {
                id
            }
        })

        response.data = updateReview
        if (updateReview == 1) {
            res.status(200)
            response.messages.push('Review has been updated successfully')
        } else {
            res.status(404)
            response.success = false
            response.messages.push('Something went wrong! Please try again later.')
        } 
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push('Something went wrong! Please try again later.')
    }
    res.send(response)
}

module.exports = {
    store,
    index,
    show,
    destroy,
    update
}