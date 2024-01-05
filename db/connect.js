const mongoose = require('mongoose')

const connectD = async () => {
    return mongoose.connect(process.env.MONGO_URL)
    .then(res => {
        console.log(`mongodb is connected`)
    })
    .catch(err => console.log(err.message))
}

module.exports = connectD