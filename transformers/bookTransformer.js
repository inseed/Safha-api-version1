var {photoTransformer} = require('./photoTransformer')

var booksTransformer = function(books) {
    return books.map(book => bookTransformer(book))
}

var bookTransformer = function(book){

    if (book?.dataValues?.cover) {
        book.dataValues.cover = photoTransformer(book.dataValues.cover)
    }
    // transformeredCategories.Books.name = categories?.Books?.name
        // transformeredCategories.Books.pagesCount = categories?.Books?.pagesCount
        // transformeredCategories.Books.des = categories?.Books?.des
        // transformeredCategories.Books.cover = categories?.Books?.cover
        // transformeredCategories.Books.publish = categories?.Books?.publish
        // transformeredCategories.Books.lang = categories?.Books?.lang
        // transformeredCategories.Books.ISBN = categories?.Books?.ISBN
        // transformeredCategories.Books.author = categories?.Books?.author
        // transformeredCategories.Books.kindle = categories?.Books?.kindle
        // transformeredCategories.Books.paper = categories?.Books?.paper
    return book
}

module.exports = {
    bookTransformer,
    booksTransformer,
}