const mongoose = require('mongoose')
// connection to mongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING)

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}
// exporting a function
module.exports = connectDB