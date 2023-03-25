const userTransformer = (user) => {
    const transformeredUser = {
        name: '',
        nickname:'',
        email:'',
        avatar:'',
        bgPic:'',
        type:'', 
        reviews: [],
        // book:[]
    }
    if (user) {
        transformeredUser.name = user?.username
        transformeredUser.email = user?.email
        transformeredUser.avatar = user?.UserInfo?.avatar
        transformeredUser.bgPic = user?.UserInfo?.bgPic
        transformeredUser.nickname = user?.UserInfo?.nickname
        transformeredUser.type = user?.UserType?.type
        user?.Reviews?.map(review =>{
            transformeredUser.reviews.push(review.content)
        })
        return transformeredUser
    }
    return user
}

const userInfoTransformer = (userInfo) => {
    console.log(userInfo)
    if(userInfo){
        delete userInfo['dataValues']['id']
        delete userInfo['dataValues']['userId']
        delete userInfo['dataValues']['updatedAt']
        delete userInfo['dataValues']['createdAt']
        if(userInfo['dataValues']['userId'])
        delete userInfo['dataValues']['userId']
    }
    return userInfo
}

const userTypeTransformer = (userType) => {
    console.log(userType)
    if(userType){
        delete userType['dataValues']['id']
        delete userType['dataValues']['updatedAt']
        delete userType['dataValues']['createdAt']
        if(userType['dataValues']['userId'])
        delete userType['dataValues']['userId']
    }
    return userType
}

const reviewsTransformer = (reviews) => {
    console.log(reviews)
    const transformeredReviews = {
        content: '',
        User: {name: '', email:''}
    }
    if (reviews) {
        transformeredReviews.content = reviews?.content
        transformeredReviews.User.name = reviews?.User?.username
        transformeredReviews.User.email = reviews?.User?.email

        return transformeredReviews
    }
   
    return reviews
}
const categoriesTransformer = (categories) => {
    console.log(categories)
    const transformeredCategories = {
        id: '',
        name:'',
        des:'',
        deletedAt:'',
        Books: {name: '', pagesCount:'', des:'', cover:'', publish:'', lang:'',ISBN:'',author:'',kindle:'',paper:''}
    }
    if (categories) {
        transformeredCategories.id = categories?.id
        transformeredCategories.name = categories?.name
        transformeredCategories.des = categories?.des
        transformeredCategories.deletedAt = categories?.deletedAt

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

        return transformeredCategories
    }
   
    return categories
}

// const adminsTransformer = (admins) => {
//     console.log(admins)
//     const transformeredAdmins = {
//         userTypeId: '',
//         User: {name: '', email:''},
//         UserType:{type:''}
//     }
//     if (admins) {
//         transformeredAdmins.userTypeId = admins?.userTypeId
//         transformeredAdmins.User.name = admins?.User?.username
//         transformeredAdmins.User.email = admins?.User?.email
//         transformeredAdmins.UserType.type = admins?.UserType?.type

//         return transformeredAdmins
//     }
   
//     return admins
// }
const oneCategoryTransformer = (category) => {
    const transformeredCategory = {
        id: 0,
        name:'',
        des:'',
        Books: [],
    }
    if (category) {
        transformeredCategory.id = category.id
        transformeredCategory.name = category.name
        transformeredCategory.des = category.des
        transformeredCategory.Books = (category.Books)

        return transformeredCategory

    }
    return category
}

const categoryTransformer = (categories) => {
    const transformeredCategory = []
    if (categories?.length > 0) {
        categories?.map(category => {
            transformeredCategory.push(oneCategoryTransformer(category))
        })
        return transformeredCategory
    }
    return categories
}

const publisherTransformer = (publisher) => {
    console.log(publisher)
    if(publisher){
        // delete category['dataValues']['id']
        delete publisher['dataValues']['updatedAt']
        delete publisher['dataValues']['createdAt']
        // if(category['dataValues']['userId'])
        // delete category['dataValues']['userId']
    }
    return publisher
}

// const bookTransformer = (book) => {
//     console.log(book)
//     if(book){
        // delete category['dataValues']['id']
        // delete category['dataValues']['updatedAt']
        // delete category['dataValues']['createdAt']
        // if(category['dataValues']['userId'])
        // delete category['dataValues']['userId']
//     }
//     return book
// }

module.exports = {
    userTransformer,
    userInfoTransformer,
    userTypeTransformer,
    reviewsTransformer,
    // adminsTransformer,
    categoryTransformer,
    categoriesTransformer,
    // bookTransformer,
    publisherTransformer
}