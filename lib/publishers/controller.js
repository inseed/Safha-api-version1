const { fn } = require('sequelize')
var models = require('../../models')
const { booksTransformer } = require('../../transformers/bookTransformer')


var store = async (req, res, next) => {

    var response = {
        success: true,
        messages: [],
        data: {}
    }

    // column names
    var name = req?.body?.name?.trim()
    var des = req?.body?.des?.trim()

    //  Check the input values
    if (name.length < 3) {
        response.success = false
        response.messages.push('name is not a VALID!!, try again')
        return res.send(response)
    }
    if (des.length < 3) {
        response.success = false
        response.messages.push('The description length should be more than 5')
        return res.send(response)
    }

    // if the response is false return
    if (!response.success) {
        res.send(response)
        return
    }

    // store a new item
    try {
        var newPublisher = await models.Publisher?.create({
            name: name,
            des: des,
        })
        response.data = newPublisher
        response.messages.push('A new item has been added successfully.')
        res.send(response)
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push("Something went wrong! Please try again later")
        res.send(response)
    }

}

var index = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    try {
        var publishers = await models.Publisher?.findAll({
        attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            include: [
                {
                    model: models.Book,
                    attributes: 
                    {exclude: ['deletedAt', 'createdAt', 'updatedAt']}
                },
            ]
        })

        if (Array?.isArray(publishers)) {
            // console.log("publisher::::",publishers[0]?.dataValues?.Books)
            if(publishers[0]?.dataValues?.Books){
                publishers[0].dataValues.Books = booksTransformer(publishers[0]?.dataValues?.Books)
            }
            response.data = publishers
        } else {
            res.status(404)
            res.success = false
            response.messages.push('Please try again later')
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
    var publisher = await models.Publisher?.findByPk(req?.params?.id, {
        attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },

        include: [
            {
                model: models.Book,
                attributes: 
                {exclude: ['deletedAt', 'createdAt', 'updatedAt']}
            },
        ]
    })

    if (publisher){
        // console.log("publisher::::",publisher?.dataValues?.Books)
        if(publisher?.dataValues?.Books){
            publisher.dataValues.Books = booksTransformer(publisher?.dataValues?.Books)
        }
        response.data = publisher
    } else {
        res.status(404)
        response.success = false
        response.messages.push('Please Provide a valid ID')
    }
    res.send(response)
}
var update = async (req, res, next) => {

    var response = {
        success: true,
        messages: [],
        data: {}
    }

    // column names
    var name = req?.body?.name?.trim()
    var des = req?.body?.des?.trim()

    //  Check the input values
    if (name.length < 3) {
        response.success = false
        response.messages.push('name is not a VALID!!, try again')
        return res.send(response)
    }
    if (des.length < 3) {
        response.success = false
        response.messages.push('The description length should be more than 5')
        return res.send(response)
    }

    // if the response is false return
    if (!response.success) {
        res.send(response)
        return
    }

    // store a new item
    try {
        var updatePublisher = await models.Publisher?.update({
            name: name,
            des: des,
        }, {
            where: {
                id: req.params.id
            }
        })
        response.data = updatePublisher
        response.messages.push('A new item has been added successfully.')
        res.send(response)
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push("Something went wrong! Please try again later")
        res.send(response)
    }

}

var destroy = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id

    var deleted = await models.Publisher?.destroy(
    {
        where: {
            id: id
        }
    });

    if (deleted) {
        res.status(200)
        response.messages.push('Item has been removerd from Favorite list')
    } else {
        res.status(404)
        response.success = false
        response.messages.push('Please try again later.')
    }
    res.send(response)
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy
}