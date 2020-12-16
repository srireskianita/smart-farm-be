const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        trim: true
    },
    cart: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('UserChart', userSchema)