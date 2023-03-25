const { Op, fn } = require('sequelize')
var models = require('../../models')

var rate = async (req, res, next) => {
    var response = {
        success: true,
        messages: [],
        data: {}
    }
    var bookId = Number(req?.body?.bookId)
    var rate = Number(req?.body?.rate)
    var userId = Number(req?.user?.id)

    //  Check the input values
    if(!rate || rate < 1 || rate > 5 ){
        response.success = false
        response.messages.push('The entered rate should not be less than one or larger than 5')
    }
    if (!bookId || bookId < 1) {
        response.success = false
        response.messages.push('The book is wrong.')
    }

    // if the response is false return
    if (!response.success) {
        res.send(response)
        return
    }
    
    const [SharedRate, isRated] = await models.Rate.findOrCreate({
        where: {
            [Op.and]: [{ userId }, { bookId }]
        },
        defaults: {
            userId,
            bookId,
            rate,
        }
    })
    console.log("rate",SharedRate)
    console.log("isRated",isRated)
    if (isRated) {
        response.data = SharedRate
        response.messages.push('A new rate have been added successfully.')
        return res.send(response)
    } else {
        if (SharedRate) {
            const updateRate = await models.Rate.update(
                {
                    rate
                },
                    { where: {
                         [Op.and]: [{ userId }, { bookId }]
                     }
                    }  
                 
            )
                console.log("UpdateRate", updateRate)
            if (Array.isArray(updateRate)) {
                response.data = updateRate
                response.messages.push('A rate have been updated successfully.')
                return res.send(response)
            } else {
                response.success = false
                response.messages.push('Failed to update Rating')
                return res.send(response)
            }
        } 
    }
}
var destroy = async function (req, res, nex) {
    var response = {
        success: true,
        data: {},
        messages: []
    }

    
    var userId = Number(req?.user?.id)
    var id = req?.params?.id

    try{
        var deleted = await models.Rate?.destroy( {
            where: {
                [Op.and]: [{ userId }, {id}]
            }
        });
      
        if (deleted) {
            response.messages.push('Your rate has been deleted successfuly')
        } else {
            res.status(404)
            response.success = false
            response.messages.push('Error!! Please try again later')
        }
    } catch(err){
        console.log(err)
        response.success = false
        response.messages.push('Please try again')
    }
    res.send(response)
}

module.exports = { 
    rate,
    destroy
}
