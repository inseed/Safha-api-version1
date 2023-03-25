const { fn } = require('sequelize')
var models = require('../../models')
var { booksTransformer } = require('../../transformers/bookTransformer')


var store = async (req, res, next) => {
    
    var response = {
        success: true,
        messages: [],
        data: {}
    }

    var name = req?.body?.name.trim()
    var des = req?.body?.des.trim()

    //  Check the input values
    if(!name || name?.length < 3){
        response.success = false
        response.messages.push('The category name should have more than 2 letters.')
    }
    if (!des || des?.length < 5) {
        response.success = false
        response.messages.push('The category description should have more than 5 letters.')
    }

    // if the response is false return
    if (!response.success) {
        res.send(response)
        return
    }

    try {
        // store a new category
        var newCategory = await models.Category?.create({
            name: name,
            des: des,
        });
        response.data = newCategory
        if (newCategory) {
            res.status(200)
            response.messages.push('A new category has been add successfully')
        } else {
            res.status(404)
            response.success = false
            response.messages.push('Please try again later.')
        }
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push("Something went wrong! Please try again later")
    }
    res.send(response)
}

var index = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }

    try {
        
        var categories = await models.Category?.findAll({
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            include: {
                model: models.Book,
                attributes:{ exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
                
            }
        });

        if (Array?.isArray(categories)) {
            // console.log("categories::::",categories[0]?.dataValues?.Books)
            if(categories[0]?.dataValues?.Books){
                categories[0].dataValues.Books = booksTransformer(categories[0]?.dataValues?.Books)
            }
            response.data = categories
            
            response.messages.push('done')
        } else {
            res.status(404)
            res.success = false
            response.messages.push('Please try again later')
        }
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push("Something went wrong! Please try again later")
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
        var category = await models.Category?.findByPk(req.params.id, {
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            
            include: {
                model: models.Book,
                attributes:{ exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            }})
    
        if(category) {
            // console.log("category::::",category?.dataValues?.Books)
            if(category?.dataValues?.Books){
                category.dataValues.Books = booksTransformer(category?.dataValues?.Books)
            }
            response.data = category

        } else {
            res.status(404)
            response.success = false
            response.messages.push('Please Provide a valid ID')
        }
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push("Something went wrong! Please try again later")
    }
    res.send(response)
}

var destroy = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    try {
        var id = Number(req?.params?.id)
        var deleted = await models.Category?.destroy(
        {
            where: {
                id: id
            }
        });

        if (deleted) {
            res.status(200)
            response.messages.push('Category has been deleted successfully')
        } else {
            res.status(404)
            response.success = false
            response.messages.push('Something went wrong! Please try again later')
        } 
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push("Something went wrong! Please try again later")
    }
    res.send(response)
}

var update = async (req, res, next) => {

    var response = {
        success: true,
        messages: [],
        data: {}
    }

    var name = req?.body?.name.trim()
    var des = req?.body?.des.trim()

    //  Check the input values
    if(!name || name?.length < 3){
        response.success = false
        response.messages.push('The category name should have more than 2 letters.')
    }
    if (!des || des?.length < 5) {
        response.success = false
        response.messages.push('The category description should have more than 5 letters.')
    }

    // if the response is false return
    if (!response.success) {
        res.send(response)
        return
    }

    try {
        var id = req.params.id
        var updateCategory = await models.Category?.update({
            name: name,
            des: des,
        }, {
            where: {
                id
            }
        });

        response.data = updateCategory
        if (updateCategory == 1) {
            res.status(200)
            response.messages.push('Category has been updated successfully')
        } else {
            res.status(404)
            response.success = false
            response.messages.push('Something went wrong! Please try again later')
        } 
    } catch (err) {
        console.log('ERORR-->', err)
        response.success = false
        response.messages.push('Something went wrong! Please try again later')
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