// jsonwebtoken
const jwt = require('jsonwebtoken')

const createAccessToken = (userid) => {
    return jwt.sign(userid, process.env.ACCESS_SECRET, {expiresIn: "1d"})
}

module.exports = createAccessToken