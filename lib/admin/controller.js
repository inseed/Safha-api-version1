var bcrypt = require('bcryptjs')
var models = require("../../models")
var authService = require('../../services/authService');
const { Op, fn } = require("sequelize");
const { token } = require('morgan');
const { booksTransformer } = require('../../transformers/bookTransformer');
const { userInfoTransformer } = require('../../transformers/userInfoTransformer');

var store = async function (req, res, next) {
   
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
        var uppers  = password.match(/[A-Z]/);
        var lowers  = password.match(/[a-z]/);
        var special = password.match(/[!@#$%\^&*\+]/);
    
        if (numbers === null || uppers === null || lowers === null || special === null) {
            return false
        }
        return true;
    }

    var username = req?.body?.username.trim()
    var email = req?.body?.email.trim()
    var password = req?.body?.password.trim()
    var passwordConfirmation = req?.body?.passwordConfirmation.trim();
    var userTypeId = Number(req?.body?.userTypeId)
    // console.log(req?.body)
    if(!validateEmail(email)){
        response.success = false
        response.messages.push('Email is not a valid.')
    }
    if (!username || username.length < 3) {
        response.success = false
        response.messages.push('Username is not valid.......')
    }
    // here will try to validate the password
    if (!checkPassword(password)){
        response.success = false
        response.messages.push('Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters')
    }     
    if (!passwordConfirmation || passwordConfirmation.length < 7) {
        response.success = false
        response.messages.push('PasswordConfirmation is not TRUE')
    }
    if (!password || password != passwordConfirmation) {
        response.success = false
        response.messages.push('PasswordConfirmation is not same as password')
    }
    if (!userTypeId || userTypeId < 0) {
        response.success = false
        response.messages.push('This field should be a number')
    }
    
    const [user, isCreated] = await models.User?.findOrCreate({
        where: {
            [Op.or]: [{ username }, { email }]
        },
        defaults: {
            username,
            email,
            password: authService.hashPassword(password),
            userTypeId: userTypeId
        }
    })
    if (isCreated) {
        response.success = true
        response.data = user
        response.messages.push("The account has been created successfully")
        res.status(200)
    }else {
        response.success = false
        response.messages.push('You are already registered, Please go to login')
        res.status(201)
    }
    res.send(response)
}

var index = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    const adminType = await models.UserType.findOne({
        where: {
            type: 'admin'
        }
      
    })
    var AllUsers = await models.User?.findAll({
        
        attributes: {exclude: ['deletedAt', 'createdAt', 'updatedAt','password']},

        where:{
            deletedAt: null,
            userTypeId: adminType?.id
        },
        include: {
            model: models.UserType,
            attributes:{ exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
            
        }
    })
    if (Array.isArray(AllUsers)) {
        response.data = AllUsers
    } else {
        res.status(404)
        res.success = false
        response.messages.push('Please Try again later')
    }
    res.send(response)
}

var show = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    var id = Number(req?.user?.id)
    var user = await models.User?.findByPk(id,{
        include: [
            { model: models.UserType },
            { model: models.UserInfo },
            { model: models.Review },
            { model: models.Book, as: 'FavoriteBooks' },
            { model: models.Book, as: 'AddedBooks' }
        ]
    })
  
    if(user) {
        // console.log("user>>>>>",user);
        // console.log("user::::",user?.dataValues?.UserInfo)
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
        response.messages.push('Please Provide a Valid ID.')
    }
    res.send(response)
}

var destroy = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }

    //this will enable the user to login by username or email
    var id = Number(req?.params?.id)
    try {
        var deleted = await models.User.destroy(
        {
            where: {
                id: id,
            }
        });
        response.data = deleted
        if (deleted) {
            response.success = true
            response.messages.push("Your account has been deleted successfully.")
            res.status(200)
        } else {
            response.success = false
            response.messages.push('Please try again later.')
        }
    } catch (err) {
        console.log("Error->", err)
        response.success = false
        response.messages.push('Something went wrong!')
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
        var uppers  = password.match(/[A-Z]/);
        var lowers  = password.match(/[a-z]/);
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
    var userTypeId = Number(req?.body?.userTypeId)

    //  Check the input values
    if (!username || username?.length < 3) {
        response.success = false
        response.messages.push('The username name should have more than 2 letters.')
    }
    if(!validateEmail(email)){
        response.success = false
        response.messages.push('Email is not a valid!')
    }
    if (!checkPassword(password)){
        response.success = false
        response.messages.push('Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters')
    } 
    if (!email || email?.length < 5) {
        response.success = false
        response.messages.push('The email should have more than 5 letters.')
    }
    if (!userTypeId || userTypeId < 0) {
        response.success = false
        response.messages.push('This field should be a number')
    }
    // if the response is false return
    if (!response.success) {
        response.success = false
        res.send(response)
    }
    id = req?.params?.id
    var updateUser = await models.User?.update({
        email: email,
        username: username,
        password: authService.hashPassword(password),
        userTypeId: userTypeId
    }, {
        where: {
            id: id
        }
    })
    // console.log("......................", updateUser)
    //  result.data = memberTransformer(updateUser)
    response.data = updateUser
    if (updateUser == 1) {
        response.success = true
        response.messages.push('Your account has been Updated successfully')
        res.status(200)
    }else {
        response.success = false
        response.messages.push('Error, Please try again')
        res.status(201)
    }
    res.send(response)
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
        var password = req?.body?.password?.trim();
        var user = await models.User.findOne({
            where: {
                [Op.and]: [
                    { [Op.or]: [{ email: account }, { username: account }] }
                ],
                    userTypeId : "1"
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

var showUsers = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
        var AllUsers = await models.User?.findAll(
        {
            
            where: {
                userTypeId: 2
            }
        }
        )
        if (Array.isArray(AllUsers)) {
            response.data = AllUsers
        } else {
            res.status(404)
            res.success = false
            response.messages.push('Please Try again later.')
        }

    
    res.send(response)
}



var indexUsers = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    var AllUsers = await await models.User?.findAll({
        where:{
            deletedAt: null
        }
        ,
        include: 
            { model: models.UserType }
        
    })
    if (Array.isArray(AllUsers)) {
        response.data = AllUsers
        res.send(response)
    } else {
        res.status(404)
        res.success = false
        response.messages.push('Please Try again later')
    }
}

var showUser = async function (req, res, next) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    var id = req?.params?.id
    var user = await models.User?.findByPk(id,{
    })

    if(user) {
        response.data = user
    } else {
        res.status(404)
        response.success = false
        response.messages.push('Please Provide a Valid ID.')
    }
    res.send(response)
}

module.exports = {
    store,
    index,
    show,
    destroy,
    update,
    login,
    showUsers,
    indexUsers,
    showUser
}