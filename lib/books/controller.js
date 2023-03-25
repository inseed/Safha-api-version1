const { fn } = require('sequelize')
var models = require('../../models')
var { bookTransformer, booksTransformer } = require('../../transformers/bookTransformer')
var Sequelize = require('sequelize');

var store = async (req, res, next) => {

    var response = {
        success: true,
        messages: [],
        data: {}
    }

    // column names
    var name = req?.body?.name.trim()
    var pagesCount = Number(req?.body?.pagesCount)
    var des = req?.body?.des.trim()
    var publish = req?.body?.publish.trim()
    var lang = req?.body?.lang.trim()
    var ISBN = req?.body?.ISBN.trim()
    var author = req?.body?.author.trim()
    var categoryId = Number(req?.body?.categoryId)
    var publisherId = Number(req?.body?.publisherId)
    var kindle = Number(req?.body?.kindle)
    var paper = Number(req?.body?.paper)

    //  Check the input values
    if (!name || name?.length < 1) {
        response.success = false
        response.messages.push('The book name should be more than one letter.')
    }
    if (!ISBN || ISBN.length < 4) {
        response.success = false
        response.messages.push('This field should have more than 3 letters.')
    }
    if (!pagesCount || pagesCount < 1) {
        response.success = false
        response.messages.push('The pages count should be a number.')
    }
    if (!categoryId || categoryId < 1) {
        response.success = false
        response.messages.push('You should enter category name.')
    }
    if (!publisherId || publisherId < 1) {
        response.success = false
        response.messages.push('You should enter publisher name.')
    }
    if (!des || des?.length < 5) {
        response.success = false
        response.messages.push('The description should have more than 5 letters.')
    }
    if (!(/^(((\d{4})(-)(0[13578]|10|12)(-)(0[1-9]|[12][0-9]|3[01]))|((\d{4})(-)(0[469]|11)(-)([0][1-9]|[12][0-9]|30))|((\d{4})(-)(02)(-)(0[1-9]|1[0-9]|2[0-8]))|(([02468][048]00)(-)(02)(-)(29))|(([13579][26]00)(-)(02)(-)(29))|(([0-9][0-9][0][48])(-)(02)(-)(29))|(([0-9][0-9][2468][048])(-)(02)(-)(29))|(([0-9][0-9][13579][26])(-)(02)(-)(29)))$/.test(publish))) {
        response.success = false,
            response.messages.push('please check the publish date')
    }
    if (!lang || lang?.length < 1) {
        response.success = false
        response.messages.push('The language should have at least 2 letters.')
    }
    if (!author || author?.length < 1) {
        response.success = false
        response.messages.push('Please enter the name of the author.')
    }

    // if the response is false return
    if (!response.success) {
        res.send(response)
        return
    }

    // console.log(bookCover)
    const bookCover = req?.file?.filename

    // store a new item
    try {
        var [newBook, created] = await models.Book?.findOrCreate({
            where: {
                ISBN: ISBN
            },
            defaults: {
                name: name,
                userId: req?.user?.id,
                pagesCount: pagesCount,
                categoryId: categoryId,
                publisherId: publisherId,
                des: des,
                cover: bookCover,
                publish: publish,
                lang: lang,
                ISBN: ISBN,
                author: author,
                kindle: kindle,
                paper: paper,
            },
        })
        if (created) {
            response.messages.push('A new book have been added successfully.')
            console.log("newBook.cover", newBook.dataValues.cover)
            response.data = newBook
        } else {
            response.success = false
            response.messages.push('You are already registered')
        }
    } catch (err) {
        response.success = false
        response.messages.push('Something went wrong! Please try again later')
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
        var books = await models.Book?.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Rates.rate')), 'avgRating'],
                    [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'reviewsCount'],
                 
                ],
            },
            include: [
              
                { model: models.Review, attributes: [] },
                { model: models.Publisher },
                { model: models.Category },
                { model: models.Rate, attributes: [] },
                // { model: models.User, as: 'Creator' },
                // { model: models.User, as: 'Favorite' },
            ],
            // raw: true,
            group: ['Book.id', 'Reviews.id', /**'Favorite.favorites.bookId' */]
        })

        if (Array?.isArray(books)) {
            response.data = booksTransformer(books)
        } else {
            res.status(404)
            res.success = false
            response.messages.push('Please try again later.')
        }

        res.send(response)
    } catch (err) {
        console.log('ERORR-->', err)
        response.messages.push('Something went wrong! Please try again later')
        res.send(response)
    }
}

var show = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    // console.log(req)
    var id = req?.params?.id

    var book = await models.Book?.findByPk(id, {
        include: [
            { model: models.User, as: 'Creator' },
            { model: models.User, as: 'Favorite' },
            { model: models.Review },
            { model: models.Publisher },
            { model: models.Category },
        ]
    })

    if (book) {
        response.data = bookTransformer(book)
    } else {
        res.status(404)
        response.success = false
        response.messages.push('Please Provide a Valid ID.')
    }
    res.send(response)
} 

var destroy = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id
    console.log(fn("now"));
    // new Date()
    var deleted = await models.Book?.destroy(
        {
            where: {
                id: id
            }
        });

    if (deleted) {
        response.messages.push('Book has been deleted.')
    } else {
        res.status(404)
        response.success = false
        response.messages.push('Please try again later.')
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
   
    var pagesCount = Number(req?.body?.pagesCount)
    var categoryId = Number(req?.body?.categoryId)
    var des = req?.body?.des?.trim()
    var publish = req?.body?.publish?.trim()
    var lang = req?.body?.lang?.trim()
    var ISBN = req?.body?.ISBN.trim()
    var author = req?.body?.author.trim()
    var kindle = Number(req?.body?.kindle)
    var paper = Number(req?.body?.paper)

    //  Check the input values
    if (!name || name?.length < 1) {
        response.success = false
        response.messages.push('The book name should be more than one letter.')
    }
    if (!ISBN || ISBN.length < 4) {
        response.success = false
        response.messages.push('This field should have more than 3 letters.')
    }
    if (!pagesCount || pagesCount < 1) {
        response.success = false
        response.messages.push('The pages count should be a number.')
    }
    if (!categoryId || categoryId < 1) {
        response.success = false
        response.messages.push('This field should be a number.')
    }
    if (!des || des?.length < 5) {
        response.success = false
        response.messages.push('The description should have more than 5 letters.')
    }

    if (!(/^(((\d{4})(-)(0[13578]|10|12)(-)(0[1-9]|[12][0-9]|3[01]))|((\d{4})(-)(0[469]|11)(-)([0][1-9]|[12][0-9]|30))|((\d{4})(-)(02)(-)(0[1-9]|1[0-9]|2[0-8]))|(([02468][048]00)(-)(02)(-)(29))|(([13579][26]00)(-)(02)(-)(29))|(([0-9][0-9][0][48])(-)(02)(-)(29))|(([0-9][0-9][2468][048])(-)(02)(-)(29))|(([0-9][0-9][13579][26])(-)(02)(-)(29)))$/.test(publish))) {
        response.success = false,
            response.messages.push('please check the publish date')
    }
    if (!lang || lang?.length < 1) {
        response.success = false
        response.messages.push('The language should have at least 2 letters.')
    }
    if (!author || author?.length < 1) {
        response.success = false
        response.messages.push('Please enter the name of the author.')
    }
    // if the response is false return
    if (!response.success) {
        res.send(response)
        return
    }
    const bookCover = req?.file?.filename

    try {
        var id = req?.params?.id
        var updateBook = await models.Book?.update({
            name: name,
            userId: req?.user?.id,
            pagesCount: pagesCount,
            categoryId: categoryId,
            des: des,
            cover: bookCover,
            publish: publish,
            lang: lang,
            ISBN: ISBN,
            author: author,
            kindle: kindle,
            paper: paper,
        }, {
            where: {
                id: id
            }
        })
        response.data = bookTransformer(updateBook)

        if (response.data == 1) {
            res.status(200)
            response.messages.push('Book has been updated successfully.')
        } else {
            res.status(404)
            response.success = false
            response.messages.push('Please try again later.')
        }

    } catch (err) {
        console.log('ERORR-->', err)
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