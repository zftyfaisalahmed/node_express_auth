const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const User = require('../model/userModel')
const comparePassword = require('../util/password')
const createAccessToken = require('../util/token')
const jwt = require('jsonwebtoken')
const passwordReset = require('../template/gen_password')
const mailConfig = require('../util/mail.config')


const authController = {
    register : async (req , res) => {
        try {
            const { name, email, mobile, password } = req.body;

            //email
            const extEmail = await User.findOne({email})
            const extMobile = await User.findOne({mobile})

            // point duplicates, any server response error 409
            if(extEmail)
                return res.status(StatusCodes.CONFLICT).json({msg: `${email} already exists`})
            
            if(extMobile)
                return res.status(StatusCodes.CONFLICT).json({msg: `${email} already exists`})


            const encPass = await bcrypt.hash(password,10)

            let data = await User.create({
                name,
                email,
                mobile,
                password: encPass
            })

            res.status(StatusCodes.ACCEPTED).json({msg: "new user registered success", user: data })
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message})    
        }
        

    },
    login : async (req , res) => {
        try {
            const { email, mobile, password } = req.body;

            if( email ){
                let extEmail = await User.findOne({email})
                    if(!extEmail)
                    return res.status(StatusCodes.CONFLICT).json({msg: `${email} is not registered`})

                // compare the password(string, hash)
                let isMatch = await comparePassword(password, extEmail.password)
                    if(!isMatch)
                    return res.status(StatusCodes.UNAUTHORIZED).json({msg: `password are not matched`})

                let authToken = createAccessToken({id : extEmail._id })

                res.cookie('loginToken', authToken, {
                    httpOnly: true,
                    signed: true,
                    path: `/api/auth/token`,
                    maxAge: 1 * 24 * 60 * 60 * 1000
                })

                    res.status(StatusCodes.OK).json({msg: `login success(email)`, authToken})
            }

            if(mobile){
                let extMobile = await User.findOne({mobile})
                    if(!extMobile)
                        return res.status(StatusCodes.CONFLICT).json({msg : `Password are not matched`})

                let isMatch = await comparePassword(password,extMobile.password)
                    if(!isMatch)
                        return res.status(StatusCodes.UNAUTHORIZED).json({msg : `password are not matched`})

                let authToken = createAccessToken({id : extMobile._id })

                res.cookie('loginToken', authToken, {
                        httpOnly: true,
                        signed: true,
                        path: `/api/auth/token`,
                        maxAge: 1 * 24 * 60 * 60 * 1000
                    })

                        res.status(StatusCodes.OK).json({msg : `login success(mobile)`, authToken})
            }

        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message})    
        }
        

    },
    logout : async (req, res) => {
        try {
            res.clearCookie('loginToken', {path: `/api/auth/token`})
            res.status(StatusCodes.OK).json({msg : `logout successfully`})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message})    
        }
    },
    authToken : async (req, res) => {
        try {
            const rToken = req.signedCookies.loginToken

            if(!rToken)
                return res.status(StatusCodes.NOT_FOUND).json({msg : `token not available`})

            await jwt.verify(rToken, process.env.ACCESS_SECRET, (err, user) => {
                if(err)
                    return res.status(StatusCodes.UNAUTHORIZED).json({msg : `UnAuthorized.. login again`})

                res.status(StatusCodes.OK).json({ authToken : rToken })
            })

            
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message})    
        }
        

    },
    currentUser  : async (req, res) => {
        try {
            let single = await User.findById({ _id : req.userId }).select('-password')
            if(!single) 
                return res.status(StatusCodes.NOT_FOUND).json({ msg : `user id not found` })
            res.status(StatusCodes.ACCEPTED).json({ user : single })
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : err.message})    
        }
        

    },
    verifyUser: async (req, res) => {
        try {
            let {email} = req.body

            let extEmail = await User.findOne({ email })
                if(!extEmail)
                    return res.status(StatusCodes.CONFLICT).json({ msg : `${email} dosesn't exists`, status : false })

            res.status(StatusCodes.ACCEPTED).json({ msg : `Email id verified user Successfully`, status : true })
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
        }
    },
    passwordLink : async (req, res) => {
        try {
            let {email} = req.body

            let extEmail = await User.findOne({ email })
            if(!extEmail)
                return res.status(StatusCodes.CONFLICT).json({ msg : `${email} dosesn't exists`, status : false })

            // password token 
            let passToken = await createAccessToken({ id : extEmail._id })

            // password template
            let passTemplate = passwordReset(extEmail.name, email, passToken)

            let subjext = `Reset your password` 

            let emailRes = await mailConfig(email, subjext, passTemplate)

            res.status(StatusCodes.ACCEPTED).json({ msg : `password link successfully sent.`, status : emailRes })
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
        }
    },
    updatePassword : async (req, res) => {
        try {
            let id = req.userId
            let {password} = req.body

            let extUser = await User.findById({ _id : id })
                if(!extUser)
                    return res.status(StatusCodes.CONFLICT).json({ msg : `Requested user info not exists.` })

            const encPass = await bcrypt.hash(password,10)

            await User.findByIdAndUpdate({ _id: id }, {password : encPass})

            res.status(StatusCodes.ACCEPTED).json({ msg : `password Updated successfully.` })
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg : err })
        }
    }
}

module.exports = authController