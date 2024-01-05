// user schema
const mongoose = require('mongoose')
const userSchma = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique : [true, "email already exists"]
    },
    mobile : {
        type: String,
        required: true,
        trim: true,
        unique : [true, "mobile number already exists"]
    },
    password : {
        type: String,
        required: true,
        trim: true,
    },
    isActive : {
        type: Boolean,
        default: true,
    },
    role : {
        type: String,
        default: "user",
        enum: ["admin", "user"],
    },
    isBlocked : {
        type : Boolean,
        default: false
    }
},{
    collection: "users",
    timestamps: true
})

module.exports = mongoose.model("User", userSchma)