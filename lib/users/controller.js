var bcrypt = require('bcryptjs')
var models = require("../../models")
var authService = require('../../services/authService');
const { Op, fn } = require("sequelize");
const { token } = require('morgan');
const { booksTransformer } = require('../../transformers/bookTransformer');
const { userInfoTransformer } = require('../../transformers/userInfoTransformer');


var SignUp = async function (req, res, next) {

    var response = {
        success: true,
        messages: [],
        data: {}
    }
    //this is for email validation
    function validateEmail(email) {
        const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
    }
    //this is for password validation
    function checkPassword(password) {

        var numbers = password.match(/\d+/g);
        var uppers = password.match(/[A-Z]/);
        var lowers = password.match(/[a-z]/);
        var special = password.match(/[!@#$%\^&*\+]/);

        if (numbers === null || uppers === null || lowers === null || special === null)
            result = false;

        if (numbers !== null && uppers !== null && lowers !== null && special !== null)
            result = true;

        return result;
    }
    var username = req?.body?.username?.trim()
    var email = req?.body?.email?.trim()
    var password = req?.body?.password?.trim()
    var passwordConfirmation = req?.body?.passwordConfirmation?.trim();

    if (!validateEmail(email)) {
        response.success = false
        response.messages.push('Email is not a VALID')
        return res.send(response)
    }
    if (username?.length < 3) {
        response.success = false
        response.messages.push('Username is not a VALID!!, try again')
        return res.send(response)
    }
    // here will try to validate the password
    if (!checkPassword(password)) {
        response.success = false
        response.messages.push('Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters')
        return res.send(response)
    }
    if (passwordConfirmation?.length < 7) {
        response.success = false
        response.messages.push('PasswordConfirmation is not TRUE')
        return res.send(response)
    }

    const userType = await models.UserType.findOne({

        where: {
            type: 'user'
        }
    })
    const [user, isCreated] = await models.User?.findOrCreate({
        where: {
            [Op.or]: [{ username }, { email }]
        },
        defaults: {
            username,
            email,
            password: authService.hashPassword(password),
            userTypeId: userType?.id
        }
    })
    if (isCreated) {
        response.success = true
        response.data = user
        response.messages.push("The account has been created successfully")
        return res.status(200).send(response)
    } else {
        response.success = false
        response.messages.push('You are already registered, Please go to login')
        return res.status(201).send(response)
    }
}
var index = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    var AllUsers = await models.User?.findAll(
    {

        attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            
        where: {
            userTypeId: 2
        },

        include: [
            {
                model: models.UserType,
                attributes:
                    { exclude: ['deletedAt', 'createdAt', 'updatedAt'] }
            },
            {
                model: models.UserInfo,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Review,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Book, as: 'FavoriteBooks' ,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Book, as: 'AddedBooks' ,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
        ]
    })
    if (Array.isArray(AllUsers)) {
        // console.log("AllUsers[0]::::",AllUsers[0]?.dataValues?.AddedBooks)
        if(AllUsers[0]?.dataValues?.UserInfo){
            AllUsers[0].dataValues.UserInfo = userInfoTransformer(AllUsers[0]?.dataValues?.UserInfo)
        }
        if(AllUsers[0]?.dataValues?.FavoriteBooks){
            AllUsers[0].dataValues.FavoriteBooks = booksTransformer(AllUsers[0]?.dataValues?.FavoriteBooks)
        }
        if(AllUsers[0]?.dataValues?.AddedBooks){
            AllUsers[0].dataValues.AddedBooks = booksTransformer(AllUsers[0]?.dataValues?.AddedBooks)
        }
        response.data = AllUsers
        res.send(response)
    } else {
        res.status(404)
        res.success = false
        response.messages.push('Please Try again later')
    }
}


var show = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    
    var id = Number(req?.user?.id)
    var user = await models.User?.findByPk(id, {
        attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },

        include: [
            {
                model: models.UserType,
                attributes:
                    { exclude: ['deletedAt', 'createdAt', 'updatedAt'] }
            },
            {
                model: models.UserInfo,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Review,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Book, as: 'FavoriteBooks' ,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Book, as: 'AddedBooks' ,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
        ]
    })
    if (user) {
        // console.log("user>>>>>",user);
        // console.log("user::::",user?.dataValues?.AddedBooks)
        if(user?.dataValues?.UserInfo){
            user.dataValues.UserInfo = userInfoTransformer(user?.dataValues?.UserInfo)
        }
        if(user?.dataValues?.FavoriteBooks){
            user.dataValues.FavoriteBooks = booksTransformer(user?.dataValues?.FavoriteBooks)
        }
        if(user?.dataValues?.AddedBooks){
            user.dataValues.AddedBooks = booksTransformer(user?.dataValues?.AddedBooks)
        }
        response.data = user

    } else {
        res.status(404)
        response.success = false
        response.messages.push('Please Provide a valid ID')
    }
    res.send(response)
}

var destroy = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    var username = req?.body?.username?.trim()
    //this will enable the user to login by username or email
    var id = Number(req?.user?.id)
    var password = req?.body?.password?.trim()
    try {
        var user = await models.User?.findOne({
            where: {
                id: id
            },
        })
        if (user) {
            if (authService.comparePassword(password, user.password)) {
                var deleted = await models.User?.destroy(
                    {
                        where: {
                            id: id,
                            username: username,
                        }
                    });
                response.data = deleted
                if (deleted) {
                    response.messages.push("Your account has been deleted successfully.")
                    res.status(200)
                } else {
                    response.success = false
                    response.messages.push('Please try again later.')
                }
            } else {
                response.messages.push('Wrong username or password!')
                response.success = false
            }
        } else {
            response.success = false
            response.messages.push('This user is not valid!')
        }
    } catch (err) {
        console.log("Error->", err)
        response.success = false
        response.messages.push('Catch an Error!!!!')
        res.status(500)
    }
    res.send(response)
}

var update = async function (req, res, next) {

    var response = {
        success: true,
        messages: [],
        data: {}
    }
    function validateEmail(email) {
        const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
    }
    //this is for password validation
    function checkPassword(password) {

        var numbers = password.match(/\d+/g);
        var uppers = password.match(/[A-Z]/);
        var lowers = password.match(/[a-z]/);
        var special = password.match(/[!@#$%\^&*\+]/);

        if (numbers === null || uppers === null || lowers === null || special === null)
            result = false;

        if (numbers !== null && uppers !== null && lowers !== null && special !== null)
            result = true;

        return result;
    }

    // column names
    var username = req?.body?.username.trim()
    var email = req?.body?.email.trim()
    var password = req?.body?.password.trim()

    // //  Check the input values
    if (!username || username?.length < 3) {
        response.success = false
        response.messages.push('The username name should have more than 2 letters.')
    }
    if (!validateEmail(email)) {
        response.success = false
        response.messages.push('Email is not a VALID')
        return res.send(response)
    }
    if (!checkPassword(password)) {
        response.success = false
        response.messages.push('Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters')
        return res.send(response)
    }
    if (!email || email?.length < 5) {
        response.success = false
        response.messages.push('The email should have more than 5 letters.')
    }

    // if the response is false return
    if (!response.success) {
        res.send(response)
        return
    }

    var id = Number(req?.user?.id)
    var email = req?.body?.email.trim()
    var password = req?.body?.password.trim()
    var username = req?.body?.username.trim()
    var updateUser = await models.User?.update({
        email: email,
        username: username,
        password: authService.hashPassword(password),
    }, {
        where: {
            id
        }
    })
    response.data = updateUser
    if (updateUser) {
        response.success = true
        response.messages.push('Your account has been Updated successfully')
        return res.status(200).send(response)
    } else {
        response.success = false
        response.messages.push('Error, Please try again')
        return res.status(201).send(response)
    }
}

var login = async function (req, res, next) {
    try {
        var response = {
            success: true,
            messages: [],
            data: {},
            token: null
        }
        var account = req?.body?.account?.trim() //this will enable the user to login by username or email
        var password = req?.body?.password?.trim()
        var user = await models.User.findOne({
            where: {
                [Op.and]: [
                    { [Op.or]: [{ email: account }, { username: account }] }
                ]
            },
        })
        if (user) {
            if (authService.comparePassword(password, user.password)) {
                const token = authService.generateToken(user)
                if (token) {
                    response.success = true
                    response.token = token
                    response.messages.push('You Loged in')
                    return res.status(200).send(response)
                } else {
                    response.success = false
                    response.messages.push('Please try again')
                    return res.status(201).send(response)
                }
            }
        }
        console.log(token)
        response.success = false
        response.messages.push('Wrong email or password')
        return res.status(201).send(response)
    } catch (err) {
        console.log("Error->", err)
        response.success = false
        response.messages.push('server error')
        return res.status(500).send(response)
    }
}

var showOneUser = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    
    var id = Number(req?.params?.id)
    var user = await models.User?.findByPk(id, {
        attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: models.UserType,
                attributes:
                    { exclude: ['deletedAt', 'createdAt', 'updatedAt'] }
            },
            {
                model: models.UserInfo,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Review,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Book, as: 'FavoriteBooks' ,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
            {
                model: models.Book, as: 'AddedBooks' ,
                attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt']
                }
            },
        ]
    })
    if (user) {
        // console.log("user>>>>>",user);
        // console.log("user::::",user?.dataValues?.AddedBooks)
        if(user?.dataValues?.UserInfo){
            user.dataValues.UserInfo = userInfoTransformer(user?.dataValues?.UserInfo)
        }
        if(user?.dataValues?.FavoriteBooks){
            user.dataValues.FavoriteBooks = booksTransformer(user?.dataValues?.FavoriteBooks)
        }
        if(user?.dataValues?.AddedBooks){
            user.dataValues.AddedBooks = booksTransformer(user?.dataValues?.AddedBooks)
        }
        response.data = user

    } else {
        res.status(404)
        response.success = false
        response.messages.push('Please Provide a valid ID')
    }
    res.send(response)
}

module.exports = {
    SignUp,
    index,
    show,
    destroy,
    update,
    login,
    showOneUser,
}