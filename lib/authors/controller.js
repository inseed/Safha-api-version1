var bcrypt = require('bcryptjs')
var models = require("../../models")
var authService = require('../../services/authService');
const { Op } = require("sequelize");
const { token } = require('morgan');



var index = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }
    try {
        const authorType = await models.UserType.findOne({
            where: {
                type: 'author'
            }
        })

        var AllAuthors = await models?.User?.findAll({
            where: {
                userTypeId: 3
            },
            include: [
                {
                    model: models.UserType,
                },
                {
                    model: models.UserInfo,
                }
            ],

        })
        if (Array.isArray(AllAuthors) && AllAuthors.length > 0) {
            // console.log("AllAuthors::::",AllAuthors[0]?.dataValues?.UserInfo)
            if(AllAuthors[0]?.dataValues?.UserInfo){
                AllAuthors[0].dataValues.UserInfo = userInfoTransformer(AllAuthors[0]?.dataValues?.UserInfo)
            }
            response.data = AllAuthors
            res.send(response)
        } else {
            response.success = false
            res.status(404)
            response.messages.push('Please Try again later')
        }
    } catch (err) {
        console.log("Error->", err)
        response.success = false
        response.messages.push('Something went wrong!')
        res.status(500)
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
    var user = await models.User.findOne({
        where: {
            id
        },
        include: [
            {
                model: models.UserType,
            },
            {
                model: models.UserInfo
            }
        ]
    })
    if (user) {
        // console.log("user::::",user?.dataValues?.UserInfo)
        if(user?.dataValues?.UserInfo){
            user.dataValues.UserInfo = userInfoTransformer(user?.dataValues?.UserInfo)
        }
        response.data = user
    } else {
        response.success = false
        response.messages.push('Please Provide a valid ID');
        res.status(404)
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
    var id = Number(req?.user?.id)
    var user = await models.User.findOne({
        where: {
            id
        },
    })
    if (user) {
        var deleted = await models.User.destroy({
            where: {
                id,
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
        response.messages.push('Wrong username!')
        response.success = false
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
    var id = Number(req?.user?.id)
    var email = req?.body?.email.trim()
    var password = req?.body?.password?.trim()
    var username = req?.body?.username?.trim()

    //  Check the input values
    if (username?.length < 3) {
        response.success = false
        response.messages.push('The username name should have more than 2 letters.')
    }
    if (!validateEmail(email)) {
        response.success = false
        response.messages.push('Email is not a VALID')
        return res.send(response)
    }
    if (!password || !checkPassword(password)) {
        response.success = false
        response.messages.push('Password does not exist or it Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters')
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
    try {
        console.log("req.user", req.user.type);
        var updateUser = await models.User.update({
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
    } catch (err) {
        console.log("Error->", err)
        response.success = false
        response.messages.push('Something went wrong!')
        res.status(500)
    }
    res.send(response)
}

module.exports = {
    index,
    show,
    destroy,
    update,
}