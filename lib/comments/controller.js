const { fn } = require('sequelize')
var models = require("../../models")
const { userInfoTransformer } = require('../../transformers/userInfoTransformer')

var store = async function (req, res, next) {

    var response = {
        success: true,
        messages: [],
        data: {}
    }

   
    var reviewId = Number(req?.body?.reviewId)
    var content = req?.body?.content.trim()

   
    if (!reviewId || reviewId < 1) {
        response.success = false
        response.messages.push('This field should be a number.')
    }
    if (!content || content?.length < 5) {
        response.success = false
        response.messages.push('The content length should be more than 5')
    }
    if (!response.success) {
        res.send(response)
        return
    }
    try {
        var newComment = await models.Comment?.create({
            userId: req?.user?.id,
            reviewId: reviewId,
            content: content,
            include: [
                { model: models.User },
                { model: models.Review },
                { model: models.Like },
            ]
        });
        response.data = newComment
        if (newComment) {
            res.status(200)
            response.messages.push('Your comment has been added successfully')
        }
        res.send(response)
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push("Something went wrong! Please try again later")
        res.send(response)
    }

}

var index = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    try {
        var allComments = await models.Comment?.findAll({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            include: [
                {
                model: models.User,
                attributes: 
                    {exclude: ['deletedAt', 'createdAt', 'updatedAt']}
                },
                {
                model: models.Review,
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
        if (Array?.isArray(allComments)) {
            response.data = allComments
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
    var id = Number(req?.params?.id)
    var comment = await models.Comment?.findByPk(id, {
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
            model: models.Like,
            attributes: {
                exclude: ['deletedAt', 'createdAt', 'updatedAt']
            }},
        ]
    })
    
    if (comment) {
        if(comment?.dataValues?.UserInfo){
            comment.dataValues.UserInfo = userInfoTransformer(comment?.dataValues?.UserInfo)
        }
        response.data = comment
    } else {
        res.status(404)
        response.success = false
        response.messages.push('Please provide a Valid ID')
    }
    res.send(response)
}

var destroy = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id

    try {
        var deleted = await models.Comment?.destroy({
            where: {
                id
            }
        });
        if (deleted) {
            response.messages.push('Your comment has been deleted successfuly')
        } else {
            res.status(404)
            response.success = false
            response.messages.push('Please try again')
        }
    } catch (err) {
        console.log(err)
        response.success = false
        response.messages.push('Please try again')
    }
    res.send(response)
}

var update = async function (req, res, next) {

    var response = {
        success: true,
        messages: [],
        data: {}
    }

   
    var reviewId = Number(req?.body?.reviewId)
    var content = req?.body?.content.trim()

   
    if (!reviewId || reviewId < 1) {
        response.success = false
        response.messages.push('This field should be a number.')
    }
    if (!content || content?.length < 5) {
        response.success = false
        response.messages.push('The content length should be more than 5')
    }
    if (!response.success) {
        res.send(response)
        return
    }
    try {
        var id = req.params.id
        var updateComment = await models.Comment?.update({
            userId: req?.user?.id,
            reviewId: reviewId,
            content: content,
        }, {
            where: {
                id
            }
        })
        response.data = updateComment
        if (response.data == 1) {
            res.status(200)
            response.messages.push('Your comment has been updated successfully.')
        } else {
            res.status(404)
            response.success = false
            response.messages.push('Please try again later.')
        }
        res.send(response)

    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push("Something went wrong! Please try again later")
    }

}

module.exports = {
    store,
    index,
    show,
    destroy,
    update
}
