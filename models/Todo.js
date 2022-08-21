const mongoose = require('mongoose')
// schema gives the documents you put into mongodb a structure
const TodoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    microsoftId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Todo', TodoSchema)