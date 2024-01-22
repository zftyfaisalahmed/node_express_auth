const mongoose = require('mongoose')

const connectD = async () => {
    const url = process.env.MODE === 'development' ? process.env.MONGO_DEV : process.env.MONGO_URL
    return mongoose.connect(url)
    .then(res => {
        console.log(`mongodb is connected`)
    })
    .catch(err => console.log(err.message))
}

module.exports = connectD