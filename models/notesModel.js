const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Notes belongs to a user']
    }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
