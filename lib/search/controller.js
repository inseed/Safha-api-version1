
const { Op } = require('sequelize')
var models = require('../../models')


var search = async function (req, res, next) {
    console.log("inside search");
    var response = {
        success: true,
        data: {},
        messages: []
    }
    try {
        var search = {
            author: req?.query?.author,
            date: req?.query?.date,
            name: req?.query?.name,
            ISBN: req?.query?.ISBN,
            category: req?.query?.category
        }
        console.log(req.query)
        var terms = {}
        if (search.author) {
            terms.author = {
                [Op.like]: `%${search.author}%`
            }
        }
        if (search.ISBN) {
            terms.ISBN = search.ISBN
        }
        if (search.name) {
            terms.name = {
                [Op.like]: `%${search.name}%`
            }
        }
        const categoryName = await models.Category.findOne({
            where: {
                name: { [Op.like]: `%${search.category}%` }
            }
        })
        if (search.category) {
            terms.categoryId = categoryName.id
        }
    
        var books = await models.Book.findAll({
            where: terms,
            attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            include: [
                {
                    model: models.User, as: 'Creator' ,
                    attributes:
                        { exclude: ['deletedAt', 'createdAt', 'updatedAt'] }
                },
                {
                    model: models.Review,
                    attributes: {
                        exclude: ['deletedAt', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: models.Publisher,
                    attributes: {
                        exclude: ['deletedAt', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: models.Category,
                    attributes: {
                        exclude: ['deletedAt', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: models.Rate,
                    attributes: {
                        exclude: ['deletedAt', 'createdAt', 'updatedAt']
                    }
                },
            ]
        })

        if (Array?.isArray(books)) {
            response.data = books
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

module.exports = {
    search
}