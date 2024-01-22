const { StatusCodes } = require('http-status-codes')
const User = require('../model/userModel')

const adminAuth = async (req, res, next) => {
    try {
        let userId = req.userId
        let extUser = await User.findById(userId)

        // validate the user
        if(!extUser)
            return res.status(StatusCodes.CONFLICT).json({ msg : `requested user info not exists.`, success : false })

        if(extUser.role !== "admin")
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg : `Unauthoried requested user info not exists.`, success : false })

            next()

        return res.json({ msg : extUser })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err.message , success : false})
    }
}

module.exports = adminAuth